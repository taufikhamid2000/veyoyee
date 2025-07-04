import React, { useState } from "react";

interface SampleSizeCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (sampleSize: number) => void;
}

/**
 * Sample Size Calculator Modal
 *
 * This component provides a user-friendly interface for calculating the minimum
 * required sample size based on population size, confidence level, and margin of error.
 */
export default function SampleSizeCalculator({
  isOpen,
  onClose,
  onApply,
}: SampleSizeCalculatorProps) {
  const [populationSize, setPopulationSize] = useState<number>(100000);
  const [confidenceLevel, setConfidenceLevel] = useState<number>(95);
  const [marginOfError, setMarginOfError] = useState<number>(5);
  const [sampleSize, setSampleSize] = useState<number>(0);

  // Calculate on input change
  React.useEffect(() => {
    // Calculate sample size based on the formula
    // n = (z^2 * p * (1-p)) / e^2 / (1 + (z^2 * p * (1-p)) / (e^2 * N))
    // where:
    // n = sample size
    // z = z-score (based on confidence level)
    // p = standard deviation (0.5 is most conservative)
    // e = margin of error (as decimal)
    // N = population size
    const calculateSampleSize = () => {
      const p = 0.5; // Standard deviation (0.5 is most conservative)
      const e = marginOfError / 100;

      // Get z-score from confidence level
      let z = 1.96; // Default for 95%
      if (confidenceLevel === 90) z = 1.645;
      if (confidenceLevel === 99) z = 2.576;

      const numerator = z * z * p * (1 - p);
      const denominator = e * e;
      const correctionFactor = 1 + numerator / (denominator * populationSize);

      const calculatedSampleSize = Math.ceil(
        numerator / denominator / correctionFactor
      );
      setSampleSize(calculatedSampleSize);
    };

    calculateSampleSize();
  }, [populationSize, confidenceLevel, marginOfError]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Sample Size Calculator
          </h2>
          <button
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            This calculator helps you determine the minimum number of
            respondents needed for statistically significant results based on
            your population size, desired confidence level, and acceptable
            margin of error.
          </p>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Population Size
                </span>
                <div className="group relative">
                  <svg
                    className="w-4 h-4 text-gray-400 cursor-help"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                    The total number of people in the group you&apos;re
                    studying. For general populations, use 100,000+.
                  </div>
                </div>
              </label>
              <input
                type="number"
                value={populationSize}
                onChange={(e) =>
                  setPopulationSize(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Confidence Level
                </span>
                <div className="group relative">
                  <svg
                    className="w-4 h-4 text-gray-400 cursor-help"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                    How confident you want to be that your results represent the
                    true population. Higher confidence requires larger sample
                    size.
                  </div>
                </div>
              </label>
              <select
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value={90}>90%</option>
                <option value={95}>95% (Recommended)</option>
                <option value={99}>99%</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Margin of Error (%)
                </span>
                <div className="group relative">
                  <svg
                    className="w-4 h-4 text-gray-400 cursor-help"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                    How much error you&apos;re willing to accept in your
                    results. Lower margin of error requires larger sample size.
                  </div>
                </div>
              </label>
              <input
                type="number"
                value={marginOfError}
                onChange={(e) =>
                  setMarginOfError(
                    Math.max(1, Math.min(10, parseFloat(e.target.value) || 5))
                  )
                }
                min="1"
                max="10"
                step="0.1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
              <input
                type="range"
                value={marginOfError}
                onChange={(e) => setMarginOfError(parseFloat(e.target.value))}
                min="1"
                max="10"
                step="0.1"
                className="mt-2 w-full accent-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Recommended Sample Size
            </p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {sampleSize}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Based on {populationSize.toLocaleString()} population,{" "}
              {confidenceLevel}% confidence level, and {marginOfError}% margin
              of error
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onApply(sampleSize)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Use This Number
          </button>
        </div>
      </div>
    </div>
  );
}

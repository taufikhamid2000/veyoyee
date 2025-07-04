import { useState } from "react";
import {
  QuestionEdit,
  RatingScaleConfig,
} from "../../../../data/surveyor-data";
import { isRatingQuestion, getRatingConfig } from "../question-helpers";

interface RatingScaleInputProps {
  question: QuestionEdit;
  onQuestionChange: (updatedQuestion: QuestionEdit) => void;
}

export default function RatingScaleInput({
  question,
  onQuestionChange,
}: RatingScaleInputProps) {
  // Initialize with default values if not present
  const defaultConfig: RatingScaleConfig = {
    minValue: 1,
    maxValue: 5,
    step: 1,
    labels: {
      min: "Poor",
      max: "Excellent",
    },
  };

  // Use the type guard and helper function to safely get the rating config
  const [ratingConfig, setRatingConfig] = useState<RatingScaleConfig>(() => {
    const config = getRatingConfig(question);
    return config || defaultConfig;
  });

  // Type-safe handler for config changes
  const handleConfigChange = (
    field: keyof RatingScaleConfig,
    value: number | string | { min?: string; max?: string }
  ) => {
    const updatedConfig: RatingScaleConfig = { ...ratingConfig };

    if (field === "labels" && typeof value === "object") {
      // Handle label updates
      updatedConfig.labels = {
        ...updatedConfig.labels,
        ...value,
      };
    } else if (
      field === "minValue" ||
      field === "maxValue" ||
      field === "step"
    ) {
      // Handle numeric values
      updatedConfig[field] = Number(value);
    }

    setRatingConfig(updatedConfig);

    // Type-safe way to update the question
    if (isRatingQuestion(question)) {
      onQuestionChange({
        ...question,
        ratingConfig: updatedConfig,
      });
    }
  };

  // Generate preview rating buttons
  const renderRatingPreview = () => {
    const { minValue, maxValue, step } = ratingConfig;
    const buttons = [];

    for (let i = minValue; i <= maxValue; i += step) {
      buttons.push(
        <button
          key={i}
          type="button"
          disabled
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Rating Scale Settings</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Minimum Value
          </label>
          <input
            type="number"
            value={ratingConfig.minValue}
            onChange={(e) => handleConfigChange("minValue", e.target.value)}
            min="0"
            max={ratingConfig.maxValue - 1}
            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Maximum Value
          </label>
          <input
            type="number"
            value={ratingConfig.maxValue}
            onChange={(e) => handleConfigChange("maxValue", e.target.value)}
            min={ratingConfig.minValue + 1}
            max="10"
            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Step</label>
        <input
          type="number"
          value={ratingConfig.step}
          onChange={(e) => handleConfigChange("step", e.target.value)}
          min="1"
          max={ratingConfig.maxValue - ratingConfig.minValue}
          className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Minimum Label (Optional)
          </label>
          <input
            type="text"
            value={ratingConfig.labels?.min || ""}
            onChange={(e) =>
              handleConfigChange("labels", { min: e.target.value })
            }
            placeholder="e.g. Poor"
            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Maximum Label (Optional)
          </label>
          <input
            type="text"
            value={ratingConfig.labels?.max || ""}
            onChange={(e) =>
              handleConfigChange("labels", { max: e.target.value })
            }
            placeholder="e.g. Excellent"
            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
        <div className="text-sm text-gray-500 dark:text-gray-400">Preview:</div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {ratingConfig.labels?.min && (
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {ratingConfig.labels.min}
            </span>
          )}

          {renderRatingPreview()}

          {ratingConfig.labels?.max && (
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {ratingConfig.labels.max}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

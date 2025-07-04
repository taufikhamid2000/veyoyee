import React, { useState } from "react";
import { QuestionEdit } from "../../../data/surveyor-data";
import { SURVEY_TEMPLATES } from "../../../data/templates/survey-templates";
import SampleSizeCalculator from "./calculator/SampleSizeCalculator";

interface SurveyFormHeaderProps {
  surveyTitle: string;
  setSurveyTitle: (title: string) => void;
  surveyType: "academia" | "commerce";
  setSurveyType: (type: "academia" | "commerce") => void;
  minRespondents: number | undefined;
  setMinRespondents: (min: number | undefined) => void;
  maxRespondents: number | undefined;
  setMaxRespondents: (max: number | undefined) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  rewardAmount: string;
  setRewardAmount: (amount: string) => void;
  showReward: boolean;
  setShowReward: (show: boolean) => void;
  // New props for question management
  setQuestions?: (questions: QuestionEdit[]) => void;
}

export default function SurveyFormHeader({
  surveyTitle,
  setSurveyTitle,
  surveyType,
  setSurveyType,
  minRespondents,
  setMinRespondents,
  maxRespondents,
  setMaxRespondents,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  rewardAmount,
  setRewardAmount,
  showReward,
  setShowReward,
  setQuestions,
}: SurveyFormHeaderProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [showSampleSizeCalculator, setShowSampleSizeCalculator] =
    useState(false);
  // Calculate reward per respondent range
  let rewardRange = null;
  if (surveyType === "commerce" && rewardAmount && minRespondents) {
    const min = Number(minRespondents);
    const max = maxRespondents ? Number(maxRespondents) : min;
    const total = Number(rewardAmount);
    if (min > 0 && total > 0) {
      const high = (total / min).toFixed(2);
      const low = max > 0 ? (total / max).toFixed(2) : high;
      rewardRange = { low, high };
    }
  }

  return (
    <>
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">
          Survey Type <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="surveyType"
              value="academia"
              checked={surveyType === "academia"}
              onChange={() => {
                setSurveyType("academia");
                setShowReward(false);
              }}
              className="accent-blue-600 w-4 h-4"
            />
            <span className="text-blue-700 dark:text-blue-300 font-semibold">
              Academia
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="surveyType"
              value="commerce"
              checked={surveyType === "commerce"}
              onChange={() => {
                setSurveyType("commerce");
                setShowReward(true);
              }}
              className="accent-green-600 w-4 h-4"
            />
            <span className="text-green-700 dark:text-green-300 font-semibold">
              Commerce
            </span>
          </label>
        </div>
        {surveyType === "commerce" && (
          <div className="mt-4 animate-fade-in">
            <button
              type="button"
              className="mb-2 px-4 py-2 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setShowReward(!showReward)}
            >
              {showReward ? "Hide Reward Amount" : "Enter Reward Amount"}
            </button>
            {showReward && (
              <div className="flex items-center gap-2 mt-2">
                <label htmlFor="rewardAmount" className="text-sm font-medium">
                  Total Reward Amount (RM):
                </label>
                <input
                  type="number"
                  id="rewardAmount"
                  min="0"
                  step="0.01"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(e.target.value)}
                  placeholder="e.g. 100.00"
                  className="w-32 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-white"
                />
              </div>
            )}
            {surveyType === "commerce" && rewardRange && (
              <div className="mt-2 text-sm text-green-700 dark:text-green-300 font-semibold">
                Respondents may be rewarded from RM {rewardRange.low} to RM{" "}
                {rewardRange.high} each
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">
          Survey Title <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="surveyTitle"
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
            required
            placeholder="Enter survey title"
            className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
          />
          <div className="flex gap-2">
            {/* Generate with templates button */}
            <button
              type="button"
              onClick={() => setShowTemplates(!showTemplates)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded flex items-center gap-2"
              disabled={generatingQuestions}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
              Templates
            </button>

            {/* External ChatGPT button */}
            <button
              type="button"
              onClick={() => {
                if (!surveyTitle.trim()) {
                  alert("Please enter a survey title first");
                  return;
                }

                const promptTemplate = `Create a survey for: ${surveyTitle}

The survey should include a mix of quantitative (rating scale) and qualitative (open-ended) questions.
Focus areas should be relevant to the topic.

Include:
- At least 3 rating scale questions (1-5 scale)
- At least 2 multiple choice questions
- 2-3 short-answer questions for detailed feedback
- Make sure the language is clear and professional

Structure the questions in logical sections if appropriate.`;

                // Encode the prompt for URL
                const encodedPrompt = encodeURIComponent(promptTemplate);
                // Open ChatGPT with the pre-filled prompt
                window.open(
                  `https://chat.openai.com/?prompt=${encodedPrompt}`,
                  "_blank"
                );
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded flex items-center gap-2"
              disabled={generatingQuestions}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
              ChatGPT
            </button>
          </div>
        </div>

        {/* Templates dropdown */}
        {showTemplates && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md animate-fadeIn">
            <h3 className="font-medium mb-3">Select a template:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(SURVEY_TEMPLATES).map(([key, template]) => (
                <button
                  key={key}
                  type="button"
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition"
                  onClick={() => {
                    if (setQuestions) {
                      // Update title if it's empty
                      if (!surveyTitle) {
                        setSurveyTitle(template.title);
                      }
                      // Set the questions
                      setQuestions(template.questions as QuestionEdit[]);
                      setShowTemplates(false);
                    }
                  }}
                >
                  <div className="font-medium">{template.title}</div>
                  <div className="text-sm text-gray-500">
                    {template.questions.length} questions
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          <span className="text-gray-500">
            Need inspiration? Use templates or generate with AI
          </span>
          {setQuestions && (
            <button
              type="button"
              className={`text-blue-200 hover:text-blue-400 font-medium flex items-center gap-1 ${
                generatingQuestions ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={async () => {
                if (
                  !surveyTitle.trim() ||
                  generatingQuestions ||
                  !setQuestions
                ) {
                  alert("Please enter a survey title first");
                  return;
                }

                setGeneratingQuestions(true);

                try {
                  // This is a simulated API call - in a real app, this would call the OpenAI API
                  // For now we're just using a timeout and a template
                  await new Promise((resolve) => setTimeout(resolve, 1500));

                  // Select a random template for demonstration
                  const templateKeys = Object.keys(SURVEY_TEMPLATES);
                  const randomTemplate =
                    SURVEY_TEMPLATES[
                      templateKeys[
                        Math.floor(Math.random() * templateKeys.length)
                      ]
                    ];

                  // Set the questions using the template but customize the title
                  const customizedQuestions = randomTemplate.questions.map(
                    (q: QuestionEdit) => ({
                      ...q,
                      questionText: q.questionText.replace(
                        /our product\/service|the event/g,
                        surveyTitle
                      ),
                    })
                  );

                  setQuestions(customizedQuestions as QuestionEdit[]);
                  alert(
                    "Questions generated successfully! Check the questions section below."
                  );
                } catch (error) {
                  console.error("Error generating questions:", error);
                  alert("Failed to generate questions. Please try again.");
                } finally {
                  setGeneratingQuestions(false);
                }
              }}
              disabled={generatingQuestions}
            >
              {generatingQuestions ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-200"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>Generate Sample Questions</>
              )}
            </button>
          )}
        </div>
      </div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Respondent Requirements</h3>
          <button
            type="button"
            onClick={() => setShowSampleSizeCalculator(true)}
            className="text-blue-200 hover:text-blue-400 text-sm font-medium flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Calculate Sample Size
          </button>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          <p>
            Not sure how many respondents you need? Use our sample size
            calculator to determine the statistically significant number.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label
              htmlFor="minRespondents"
              className="font-medium mb-2 flex items-center gap-1"
            >
              Min. Respondents
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
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                  Minimum number of responses required for your survey to be
                  considered complete.
                </div>
              </div>
            </label>
            <input
              type="number"
              id="minRespondents"
              value={minRespondents !== undefined ? minRespondents : ""}
              onChange={(e) =>
                setMinRespondents(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="Enter minimum respondents"
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="maxRespondents"
              className="font-medium mb-2 flex items-center gap-1"
            >
              Max. Respondents
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
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                  Maximum number of responses to collect before closing the
                  survey.
                </div>
              </div>
            </label>
            <input
              type="number"
              id="maxRespondents"
              value={maxRespondents !== undefined ? maxRespondents : ""}
              onChange={(e) =>
                setMaxRespondents(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="Enter maximum respondents"
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Sample Size Calculator Modal */}
        <SampleSizeCalculator
          isOpen={showSampleSizeCalculator}
          onClose={() => setShowSampleSizeCalculator(false)}
          onApply={(sampleSize) => {
            setMinRespondents(sampleSize);
            setShowSampleSizeCalculator(false);
          }}
        />
      </div>
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="startDate" className="block text-lg font-medium mb-2">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Select start date"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="endDate" className="block text-lg font-medium mb-2">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Select end date"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>
    </>
  );
}

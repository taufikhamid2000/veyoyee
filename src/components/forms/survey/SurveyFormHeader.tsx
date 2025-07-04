import React from "react";

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
}: SurveyFormHeaderProps) {
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
        <input
          type="text"
          id="surveyTitle"
          value={surveyTitle}
          onChange={(e) => setSurveyTitle(e.target.value)}
          required
          placeholder="Enter survey title"
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
        />
      </div>
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label
            htmlFor="minRespondents"
            className="block text-lg font-medium mb-2"
          >
            Min. Respondents
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
            className="block text-lg font-medium mb-2"
          >
            Max. Respondents
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

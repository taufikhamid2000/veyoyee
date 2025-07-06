"use client";

import SurveyForm from "@/app/surveyor/SurveyForm";
import React, { useState, useEffect } from "react";
import { useSurveyActions } from "@/hooks/useSurveyActions";
import { FormattedSurvey } from "@/lib/services/survey/survey-types";
import { SurveyEdit } from "@/data/surveyor-data";

interface SurveyeePageProps {
  params: Promise<{ id: string }>;
}

export default function SurveyeePage({ params }: SurveyeePageProps) {
  // Use a forward-compatible approach to access the id parameter
  // This handles both current (direct access) and future (Promise-based) APIs
  const unwrappedParams =
    params instanceof Promise ? React.use(params) : params;
  const surveyId = unwrappedParams.id;

  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const [survey, setSurvey] = useState<FormattedSurvey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { getSurvey } = useSurveyActions();

  useEffect(() => {
    // Fetch the survey data from our service
    const fetchSurvey = async () => {
      try {
        setIsLoading(true);
        const surveyData = await getSurvey(surveyId);
        setSurvey(surveyData);
      } catch (err) {
        console.error("Error fetching survey:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to load survey")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurvey();
  }, [surveyId, getSurvey]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !survey) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">
          Survey Not Found
        </h1>
        <p className="mb-8">
          The survey you&apos;re looking for doesn&apos;t exist or is no longer
          available.
        </p>
        <a href="/explore" className="text-blue-600 hover:underline">
          Browse other available surveys
        </a>
      </div>
    );
  }

  // Survey is loaded, prepare it for the form
  // Format survey data for the SurveyForm component
  const safeSurvey: SurveyEdit = {
    id: survey.id,
    title: survey.title,
    type: survey.type,
    status: survey.status,
    createdBy: survey.createdBy,
    lastUpdated: survey.updatedAt || survey.createdAt,
    minRespondents: survey.minRespondents ?? 0,
    maxRespondents: survey.maxRespondents ?? 0,
    rewardAmount: survey.rewardAmount ?? "",
    questions: survey.questions || [],
    startDate: survey.startDate ?? "",
    endDate: survey.endDate ?? "",
  };

  // Render the survey for answering (readonly, no edit)
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{survey.title}</h1>
      {/* Collapsible Reputation Score Info Table */}
      <div className="mb-8">
        <button
          className="block mx-auto mb-2 text-blue-600 dark:text-blue-400 underline text-sm focus:outline-none"
          onClick={() => setShowScoreInfo((v) => !v)}
          aria-expanded={showScoreInfo}
        >
          {showScoreInfo ? "Hide" : "Show"} Reputation Score Calculation
        </button>
        {showScoreInfo && (
          <div>
            <h2
              className="text-lg font-semibold mb-2 text-center"
              style={{ color: "var(--foreground)" }}
            >
              How Reputation Score is Calculated
            </h2>
            <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg text-sm mx-auto">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
                    Action
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
                    Score Impact
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { action: "✅ Passing attention check", score: "+2" },
                  {
                    action:
                      "🔁 Consistent responses (low entropy on objective Qs)",
                    score: "+1",
                  },
                  {
                    action: "👍 Positive feedback from survey creators",
                    score: "+5",
                  },
                  { action: "⚠️ Skipped/missing answers", score: "-1" },
                  { action: "❌ Failing attention checks", score: "-5" },
                  {
                    action: "🚫 Manual report by survey creator (confirmed)",
                    score: "-10",
                  },
                  {
                    action: "🔄 Frequent duplicate IP/device/location",
                    score: "-3",
                  },
                ].map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                      {item.action}
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                      {item.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <SurveyForm initialSurvey={safeSurvey} mode="answer" />
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { mockSurveys } from "@/data/dashboard-data";
import { notFound } from "next/navigation";
import SurveyForm from "@/app/surveyor/SurveyForm";
import { use as usePromise, useState } from "react";

interface SurveyeePageProps {
  params: { id: string };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SurveyeePage({ params }: any) {
  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const resolvedParams = usePromise(
    typeof params.then === "function" ? params : Promise.resolve(params)
  ) as { id: string };
  // Fetch survey data by ID (mock for now)
  const survey = mockSurveys.find((s) => s.id === resolvedParams.id);
  if (!survey) return notFound();

  // Ensure required fields are present for SurveyForm
  const safeSurvey = {
    ...survey,
    minRespondents: survey.minRespondents ?? 0,
    maxRespondents: survey.maxRespondents ?? 0,
    rewardAmount: survey.rewardAmount ?? "",
    questions: Array.isArray(survey.questions)
      ? survey.questions
      : survey.questionsData ?? [],
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
            <h2 className="text-lg font-semibold mb-2 text-center">
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
                <tr>
                  <td className="px-4 py-2">✅ Passing attention check</td>
                  <td className="px-4 py-2">+2</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">
                    🔁 Consistent responses (low entropy on objective Qs)
                  </td>
                  <td className="px-4 py-2">+1</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">
                    👍 Positive feedback from survey creators
                  </td>
                  <td className="px-4 py-2">+5</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">⚠️ Skipped/missing answers</td>
                  <td className="px-4 py-2">-1</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">❌ Failing attention checks</td>
                  <td className="px-4 py-2">-5</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">
                    🚫 Manual report by survey creator (confirmed)
                  </td>
                  <td className="px-4 py-2">-10</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">
                    🔄 Frequent duplicate IP/device/location
                  </td>
                  <td className="px-4 py-2">-3</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      <SurveyForm initialSurvey={safeSurvey} mode="answer" />
    </div>
  );
}

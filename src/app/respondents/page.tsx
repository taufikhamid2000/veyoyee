"use client";
import { mockSurveyResults } from "@/data/results-data";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";

export default function RespondentRankingPage() {
  // Aggregate respondents across all surveys, group by respondent id
  const respondentMap: Record<
    string,
    { respondent: string; totalScore: number; count: number; latest: string }
  > = {};
  mockSurveyResults.forEach((resp) => {
    if (!respondentMap[resp.respondent]) {
      respondentMap[resp.respondent] = {
        respondent: resp.respondent,
        totalScore: 0,
        count: 0,
        latest: resp.submittedAt,
      };
    }
    respondentMap[resp.respondent].totalScore += resp.reputationScore ?? 0;
    respondentMap[resp.respondent].count += 1;
    if (
      new Date(resp.submittedAt) >
      new Date(respondentMap[resp.respondent].latest)
    ) {
      respondentMap[resp.respondent].latest = resp.submittedAt;
    }
  });
  const ranked = Object.values(respondentMap)
    .map((r) => ({
      ...r,
      avgScore: r.count ? (r.totalScore / r.count).toFixed(2) : "-",
    }))
    .sort((a, b) => Number(b.avgScore) - Number(a.avgScore));

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Respondent Reputation Rankings
      </h1>
      <p className="mb-6 text-center text-gray-600 dark:text-gray-100 bg-black dark:bg-transparent rounded px-2 py-2 shadow-sm">
        This table ranks all respondents by their average Reputation Score
        across all surveys. Use this to identify high-quality participants for
        qualitative follow-up.
      </p>
      <div className="mb-4 text-center">
        <span className="block text-blue-700 dark:text-blue-300 font-medium">
          Respondents with a <span className="font-bold">95%+</span> Reputation
          Score only need <span className="font-bold">75 Surveys</span> to claim
          a Survey Creation Pass (SCP).
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
                #
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
                Respondent ID
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
                Avg. Reputation Score
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
                Total Surveys
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
                Latest Submission
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {ranked.map((r, i) => (
              <tr
                key={r.respondent}
                className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                  {i + 1}
                </td>
                <td className="px-4 py-2 font-mono text-gray-900 dark:text-gray-100">
                  {r.respondent}
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                  {r.avgScore}
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                  {r.count}
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                  {formatDateTime(r.latest)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 text-center">
        <Link
          href="/dashboard"
          className="text-blue-600 dark:text-blue-400 underline text-sm"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

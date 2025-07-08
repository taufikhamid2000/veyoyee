import { formatDateTime } from "@/lib/utils";
import {
  RespondentRankingData,
  getAcceptanceRate,
  getPerformanceTier,
} from "./types";

interface LeaderboardTableProps {
  respondents: RespondentRankingData[];
}

export default function LeaderboardTable({
  respondents,
}: LeaderboardTableProps) {
  return (
    <div className="hidden md:block">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Reputation
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Responses
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Quality
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Active
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {respondents.map((respondent, index) => {
              const acceptanceRate = getAcceptanceRate(
                respondent.responses_accepted,
                respondent.responses_rejected
              );
              const tier = getPerformanceTier(acceptanceRate);
              const isTopThree = index < 3;

              return (
                <tr
                  key={respondent.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    isTopThree
                      ? "bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/10 dark:to-orange-900/10"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0
                            ? "bg-yellow-100 text-yellow-800"
                            : index === 1
                            ? "bg-gray-100 text-gray-800"
                            : index === 2
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-50 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index === 0 && <span className="text-lg">🏆</span>}
                      {index === 1 && <span className="text-lg">🥈</span>}
                      {index === 2 && <span className="text-lg">🥉</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {(respondent.display_name ||
                            respondent.username ||
                            "A")[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {respondent.display_name ||
                            respondent.username ||
                            "Anonymous User"}
                        </div>
                        {respondent.username && respondent.display_name && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            @{respondent.username}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {respondent.total_reputation.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm">
                      <div className="font-semibold text-green-600 dark:text-green-400">
                        {respondent.responses_accepted.toLocaleString()}
                      </div>
                      {respondent.responses_rejected > 0 && (
                        <div className="text-xs text-gray-500">
                          {respondent.responses_rejected} rejected
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {acceptanceRate}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${tier.bg} ${tier.color}`}
                    >
                      {tier.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {respondent.surveys_created}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-gray-500 dark:text-gray-400">
                    {formatDateTime(respondent.updated_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

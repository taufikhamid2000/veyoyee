import {
  RespondentRankingData,
  getAcceptanceRate,
  getPerformanceTier,
} from "./types";

interface LeaderboardCardsProps {
  respondents: RespondentRankingData[];
}

export default function LeaderboardCards({
  respondents,
}: LeaderboardCardsProps) {
  return (
    <div className="md:hidden">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {respondents.map((respondent, index) => {
          const acceptanceRate = getAcceptanceRate(
            respondent.responses_accepted,
            respondent.responses_rejected
          );
          const tier = getPerformanceTier(acceptanceRate);
          const isTopThree = index < 3;

          return (
            <div
              key={respondent.id}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                isTopThree
                  ? "bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/10 dark:to-orange-900/10"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
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
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {respondent.total_reputation.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    reputation
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {(respondent.display_name ||
                      respondent.username ||
                      "A")[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
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
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${tier.bg} ${tier.color}`}
                  >
                    {tier.label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-green-600 dark:text-green-400">
                    {respondent.responses_accepted.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    accepted
                  </div>
                  {respondent.responses_rejected > 0 && (
                    <div className="text-xs text-red-500 dark:text-red-400">
                      {respondent.responses_rejected} rejected
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {acceptanceRate}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    quality
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {respondent.surveys_created}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    created
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

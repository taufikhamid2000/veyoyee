import React from "react";

interface SurveyResponse {
  id: string;
  respondent: string;
  reputationScore?: number; // Individual response reputation (+5/-5)
  totalUserReputation?: number; // User's total reputation (for display)
  submittedAt: string;
  status: "pending" | "accepted" | "rejected";
  answers: Record<string, string | string[]>;
}

interface ResultsTableProps {
  results: SurveyResponse[];
  selectedRows: string[];
  formattedDates: Record<string, string>;
  onRowSelect: (id: string) => void;
  onSelectAll: () => void;
  onViewResponse: (response: SurveyResponse) => void;
  isAllSelected: boolean;
}

export default function ResultsTable({
  results,
  selectedRows,
  formattedDates,
  onRowSelect,
  onSelectAll,
  onViewResponse,
  isAllSelected,
}: ResultsTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table header with enhanced styling */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Survey Responses
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>
              {selectedRows.length} of {results.length} selected
            </span>
            {selectedRows.length > 0 && (
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            )}
          </div>
        </div>

        {/* Mobile bulk selection */}
        <div className="mt-4 flex items-center justify-between sm:hidden">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isAllSelected && results.length > 0}
              onChange={onSelectAll}
              className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Select all
            </span>
          </label>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-6 py-5 w-16">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected && results.length > 0}
                    onChange={onSelectAll}
                    aria-label="Select all responses"
                    className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-1 transition-all duration-200"
                  />
                </div>
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Respondent</span>
                </div>
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  <span>Reputation</span>
                  <div className="group relative">
                    <svg
                      className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help transition-all duration-200"
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
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-72 p-4 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-2xl border border-gray-600">
                      <div className="font-semibold mb-2 text-blue-300">
                        Reputation Score
                      </div>
                      <div className="text-gray-300 dark:text-gray-400 leading-relaxed">
                        A score reflecting the respondent&apos;s
                        trustworthiness, response quality, and platform
                        engagement history.
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1">
                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-transparent border-b-gray-900 dark:border-b-gray-700"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Submitted</span>
                </div>
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Status</span>
                </div>
              </th>
              <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                  <span>Actions</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {results.map((resp, index) => (
              <ResultsTableRow
                key={resp.id}
                response={resp}
                isSelected={selectedRows.includes(resp.id)}
                formattedDate={formattedDates[resp.id]}
                onSelect={() => onRowSelect(resp.id)}
                onView={() => onViewResponse(resp)}
                isEven={index % 2 === 0}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden">
        {results.map((resp, index) => (
          <MobileResponseCard
            key={resp.id}
            response={resp}
            isSelected={selectedRows.includes(resp.id)}
            formattedDate={formattedDates[resp.id]}
            onSelect={() => onRowSelect(resp.id)}
            onView={() => onViewResponse(resp)}
            isLast={index === results.length - 1}
          />
        ))}
      </div>

      {/* Enhanced empty state */}
      {results.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300 dark:text-gray-600">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No responses yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            When respondents complete your survey, their responses will appear
            here.
          </p>
        </div>
      )}
    </div>
  );
}

function ResultsTableRow({
  response,
  isSelected,
  formattedDate,
  onSelect,
  onView,
  isEven,
}: {
  response: SurveyResponse;
  isSelected: boolean;
  formattedDate: string;
  onSelect: () => void;
  onView: () => void;
  isEven: boolean;
}) {
  const isAccepted = response.status === "accepted";
  const isProcessed = isAccepted || response.status === "rejected";

  return (
    <tr
      className={`
        transition-all duration-200 hover:shadow-sm
        ${
          isEven
            ? "bg-white dark:bg-gray-800 hover:bg-gray-900 dark:hover:bg-gray-750"
            : "bg-gray-25 dark:bg-gray-825 hover:bg-gray-75 dark:hover:bg-gray-775"
        }
        ${
          isSelected
            ? "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50 dark:bg-blue-900/20"
            : ""
        }
        ${isProcessed ? "opacity-75" : ""}
      `}
    >
      <td className="px-6 py-5">
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            disabled={isAccepted} // Only disable for accepted responses
            aria-label={`Select response ${response.id}`}
            className={`w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-1 transition-all duration-200 ${
              isAccepted
                ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                : "hover:border-blue-400"
            }`}
          />
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {response.respondent.charAt(0).toUpperCase()}
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {response.respondent}
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center">
          {(() => {
            const totalRep = response.totalUserReputation ?? 0;
            const displayRep = totalRep >= 100 ? "100+" : totalRep.toString();
            const tier = getReputationTier(totalRep);

            return (
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${tier.colorClass}`}
                title={`Total Reputation: ${totalRep} (${tier.tier})`}
              >
                {displayRep}
                <svg
                  className="w-3 h-3 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </span>
            );
          })()}
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">{formattedDate}</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <StatusBadge status={response.status} />
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center justify-center">
          <button
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            onClick={onView}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View Details
          </button>
        </div>
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    accepted: {
      classes:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border border-green-200 dark:border-green-800",
      icon: (
        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    rejected: {
      classes:
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border border-red-200 dark:border-red-800",
      icon: (
        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    pending: {
      classes:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800",
      icon: (
        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${config.classes}`}
    >
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function MobileResponseCard({
  response,
  isSelected,
  formattedDate,
  onSelect,
  onView,
  isLast,
}: {
  response: SurveyResponse;
  isSelected: boolean;
  formattedDate: string;
  onSelect: () => void;
  onView: () => void;
  isLast: boolean;
}) {
  const isAccepted = response.status === "accepted";
  const isProcessed = isAccepted || response.status === "rejected";

  return (
    <div
      className={`
        p-4 transition-all duration-200
        ${!isLast ? "border-b border-gray-200 dark:border-gray-700" : ""}
        ${
          isSelected
            ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500"
            : "hover:bg-gray-50 dark:hover:bg-gray-750"
        }
        ${isProcessed ? "opacity-75" : ""}
      `}
    >
      {/* Header with checkbox and respondent info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            disabled={isAccepted} // Only disable for accepted responses
            className={`w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 ${
              isAccepted
                ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                : ""
            }`}
          />
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {response.respondent.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {response.respondent}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                ID: {response.id}
              </div>
            </div>
          </div>
        </div>
        <StatusBadge status={response.status} />
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Reputation */}
        <div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Reputation
          </div>
          {(() => {
            const totalRep = response.totalUserReputation ?? 0;
            const displayRep = totalRep >= 100 ? "100+" : totalRep.toString();
            const tier = getReputationTier(totalRep);

            return (
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${tier.colorClass}`}
                title={`Total Reputation: ${totalRep} (${tier.tier})`}
              >
                {displayRep}
                <svg
                  className="w-3 h-3 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </span>
            );
          })()}
        </div>

        {/* Submitted Date */}
        <div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Submitted
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
            <svg
              className="w-3 h-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <button
        className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        onClick={onView}
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        View Response Details
      </button>
    </div>
  );
}

// Reputation tier utility function
function getReputationTier(reputation: number): {
  tier: string;
  colorClass: string;
  minReputation: number;
} {
  if (reputation >= 100) {
    return {
      tier: "Expert",
      colorClass:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      minReputation: 100,
    };
  } else if (reputation >= 50) {
    return {
      tier: "Advanced",
      colorClass:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      minReputation: 50,
    };
  } else if (reputation >= 20) {
    return {
      tier: "Intermediate",
      colorClass:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      minReputation: 20,
    };
  } else if (reputation >= 5) {
    return {
      tier: "Beginner",
      colorClass:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      minReputation: 5,
    };
  } else if (reputation >= 0) {
    return {
      tier: "Novice",
      colorClass:
        "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
      minReputation: 0,
    };
  } else {
    return {
      tier: "Probation",
      colorClass:
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      minReputation: -Infinity,
    };
  }
}

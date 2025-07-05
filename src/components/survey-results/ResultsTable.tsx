import InfoTooltip from "@/components/ui/InfoTooltip";

interface SurveyResponse {
  id: string;
  respondent: string;
  reputationScore?: number;
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
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
        <thead className="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            <th className="px-2 py-2">
              <input
                type="checkbox"
                checked={isAllSelected && results.length > 0}
                onChange={onSelectAll}
                aria-label="Select all responses"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
              Respondent
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
              Reputation Score
              <InfoTooltip
                tooltip={
                  "A score reflecting the respondent's trustworthiness and participation quality."
                }
              >
                <span className="ml-1 align-middle inline-block"></span>
              </InfoTooltip>
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
              Submitted At
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
              Status
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {results.map((resp) => (
            <ResultsTableRow
              key={resp.id}
              response={resp}
              isSelected={selectedRows.includes(resp.id)}
              formattedDate={formattedDates[resp.id]}
              onSelect={() => onRowSelect(resp.id)}
              onView={() => onViewResponse(resp)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResultsTableRow({
  response,
  isSelected,
  formattedDate,
  onSelect,
  onView,
}: {
  response: SurveyResponse;
  isSelected: boolean;
  formattedDate: string;
  onSelect: () => void;
  onView: () => void;
}) {
  const isProcessed =
    response.status === "accepted" || response.status === "rejected";

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
      <td className="px-2 py-2 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          disabled={isProcessed}
          aria-label={`Select response ${response.id}`}
          className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
            isProcessed ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
      </td>
      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white font-medium">
        {response.respondent}
      </td>
      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          {response.reputationScore ?? "-"}
        </span>
      </td>
      <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
        {formattedDate}
      </td>
      <td className="px-4 py-2 text-sm">
        <StatusBadge status={response.status} />
      </td>
      <td className="px-4 py-2 text-sm">
        <button
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors font-medium"
          onClick={onView}
        >
          View Details
        </button>
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusClasses = {
    accepted:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        statusClasses[status as keyof typeof statusClasses] ||
        statusClasses.pending
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

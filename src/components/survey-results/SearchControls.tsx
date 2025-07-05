interface SearchControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: "respondent" | "submittedAt";
  sortOrder: "asc" | "desc";
  onSort: (field: "respondent" | "submittedAt") => void;
  onExportCSV: () => void;
  surveyId: string;
  resultsCount: number;
}

export default function SearchControls({
  searchTerm,
  onSearchChange,
  sortBy,
  sortOrder,
  onSort,
  onExportCSV,
  surveyId,
  resultsCount,
}: SearchControlsProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
      <input
        type="text"
        placeholder="Search respondent or date..."
        className="border px-2 py-1 rounded w-full md:w-64 text-sm border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="flex gap-2 items-center">
        <button
          className={`text-xs px-2 py-1 rounded border transition-colors ${
            sortBy === "respondent"
              ? "bg-blue-100 border-blue-400 dark:bg-blue-900 dark:border-blue-500 text-blue-800 dark:text-blue-200"
              : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          }`}
          onClick={() => onSort("respondent")}
        >
          Sort by Respondent
          {sortBy === "respondent" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
        </button>
        <button
          className={`text-xs px-2 py-1 rounded border transition-colors ${
            sortBy === "submittedAt"
              ? "bg-blue-100 border-blue-400 dark:bg-blue-900 dark:border-blue-500 text-blue-800 dark:text-blue-200"
              : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          }`}
          onClick={() => onSort("submittedAt")}
        >
          Sort by Date
          {sortBy === "submittedAt" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
        </button>
        <button
          className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={onExportCSV}
          disabled={resultsCount === 0}
        >
          Export as CSV
        </button>
        <a
          href={`/surveyor/analysis/${surveyId}`}
          className="ml-2 text-xs px-2 py-1 rounded border border-purple-400 bg-purple-100 dark:bg-purple-900 dark:border-purple-500 text-purple-800 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors font-semibold"
          title="View analysis of accepted responses"
        >
          View Analysis
        </a>
      </div>
    </div>
  );
}

interface BulkActionsProps {
  selectedRows: string[];
  onAcceptSelected: () => void;
  onRejectSelected: () => void;
  onDeleteSelected: () => void;
}

export default function BulkActions({
  selectedRows,
  onAcceptSelected,
  onRejectSelected,
  onDeleteSelected,
}: BulkActionsProps) {
  const hasSelection = selectedRows.length > 0;

  if (!hasSelection) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-100">
          <div className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded">
            {selectedRows.length}
          </div>
          <span className="font-medium">
            {selectedRows.length} response{selectedRows.length !== 1 ? "s" : ""}
            selected
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-lg transition-colors"
            onClick={onAcceptSelected}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Accept ({selectedRows.length})
          </button>
          <button
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded-lg transition-colors"
            onClick={onRejectSelected}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Reject ({selectedRows.length})
          </button>
          <button
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg transition-colors"
            onClick={onDeleteSelected}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete ({selectedRows.length})
          </button>
        </div>
      </div>
    </div>
  );
}

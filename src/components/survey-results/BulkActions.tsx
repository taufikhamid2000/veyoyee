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

  return (
    <div className="flex gap-2 mb-2">
      <button
        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={!hasSelection}
        onClick={onAcceptSelected}
      >
        Accept Selected ({selectedRows.length})
      </button>
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={!hasSelection}
        onClick={onRejectSelected}
      >
        Reject Selected ({selectedRows.length})
      </button>
      <button
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={!hasSelection}
        onClick={onDeleteSelected}
      >
        Delete Selected ({selectedRows.length})
      </button>
    </div>
  );
}

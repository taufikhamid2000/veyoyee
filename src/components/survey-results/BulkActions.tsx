import React, { useState } from "react";
import BulkRejectModal from "./BulkRejectModal";

interface BulkActionsProps {
  selectedRows: string[];
  selectedResponses: Array<{
    id: string;
    status: "pending" | "accepted" | "rejected";
  }>; // Need status info
  onAcceptSelected: () => void;
  onRejectSelected: (reason: string) => void; // Updated to accept reason
  onDeleteSelected: () => void;
  setSelectedRows: (rows: string[]) => void; // Add this to help users fix selection
  isLoading?: boolean; // Add loading state
}

export default function BulkActions({
  selectedRows,
  selectedResponses,
  onAcceptSelected,
  onRejectSelected,
  onDeleteSelected,
  setSelectedRows,
  isLoading = false,
}: BulkActionsProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const hasSelection = selectedRows.length > 0;

  if (!hasSelection) {
    return null;
  }

  // Handle reject with reason
  const handleRejectWithReason = (reason: string) => {
    setShowRejectModal(false);
    onRejectSelected(reason);
  };

  // Analyze selected response statuses
  const statuses = selectedResponses.map((r) => r.status);
  const hasAccepted = statuses.includes("accepted");
  const hasPending = statuses.includes("pending");
  const hasRejected = statuses.includes("rejected");
  const allPending = statuses.every((s) => s === "pending");
  const allRejected = statuses.every((s) => s === "rejected");

  // If any accepted responses are selected, disable all actions
  if (hasAccepted) {
    const handleRemoveAccepted = () => {
      const nonAcceptedIds = selectedResponses
        .filter((r) => r.status !== "accepted")
        .map((r) => r.id);
      setSelectedRows(nonAcceptedIds);
    };

    return (
      <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-red-900 dark:text-red-100">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="font-medium">
              Bulk actions disabled. Accepted responses cannot be modified.
            </span>
          </div>

          <button
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-900 dark:text-red-100 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg transition-colors"
            onClick={handleRemoveAccepted}
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
                d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Remove Accepted ({statuses.filter((s) => s === "accepted").length})
          </button>
        </div>
      </div>
    );
  }

  // Determine available actions based on selection
  const canAccept = hasPending || hasRejected; // Both pending and rejected can be accepted
  const canReject = hasPending; // Only pending can be rejected (rejected responses are already rejected)
  const canDelete = hasPending || hasRejected; // Both can be soft deleted

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
          {/* Show status breakdown */}
          <span className="text-xs opacity-75">
            (
            {hasPending && hasRejected
              ? `${statuses.filter((s) => s === "pending").length} pending, ${
                  statuses.filter((s) => s === "rejected").length
                } rejected`
              : allPending
              ? "all pending"
              : allRejected
              ? "all rejected"
              : ""}
            )
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canAccept && (
            <button
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-lg transition-colors"
              onClick={onAcceptSelected}
              title={
                hasRejected
                  ? "Rejected responses will get +10 reputation (net +5)"
                  : "Pending responses will get +5 reputation"
              }
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
          )}

          {canReject && (
            <button
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setShowRejectModal(true)}
              disabled={isLoading}
              title="Pending responses will lose 5 reputation"
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
              Reject ({statuses.filter((s) => s === "pending").length})
            </button>
          )}

          {canDelete && (
            <button
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg transition-colors"
              onClick={onDeleteSelected}
              title={
                hasRejected
                  ? "Soft delete (keeps -5 reputation penalty)"
                  : "Soft delete (no reputation impact)"
              }
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
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      <BulkRejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectWithReason}
        selectedCount={statuses.filter((s) => s === "pending").length}
        isLoading={isLoading}
      />
    </div>
  );
}

import React, { useState, useEffect } from "react";

interface RejectionReason {
  id: string;
  reason_text: string;
  is_default?: boolean;
}

interface BulkRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  selectedCount: number;
  isLoading?: boolean;
}

export default function BulkRejectModal({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  isLoading = false,
}: BulkRejectModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [predefinedReasons, setPredefinedReasons] = useState<RejectionReason[]>(
    []
  );
  const [isLoadingReasons, setIsLoadingReasons] = useState(false);

  // Load predefined reasons when modal opens
  useEffect(() => {
    if (isOpen) {
      loadPredefinedReasons();
    }
  }, [isOpen]);

  const loadPredefinedReasons = async () => {
    setIsLoadingReasons(true);
    try {
      // Import the service here to avoid circular dependencies
      const { SurveyResponseService } = await import(
        "@/lib/services/survey/survey-response-service"
      );
      const result = await SurveyResponseService.getRejectionReasons();

      if (result.success) {
        setPredefinedReasons(result.data || []);
        // Auto-select first default reason if available
        const defaultReason = result.data?.find((r) => r.is_default);
        if (defaultReason) {
          setSelectedReason(defaultReason.reason_text);
        }
      }
    } catch (error) {
      console.error("Error loading rejection reasons:", error);
    } finally {
      setIsLoadingReasons(false);
    }
  };

  const handleReasonChange = (reason: string) => {
    setSelectedReason(reason);
    if (reason !== "custom") {
      setCustomReason("");
    }
  };

  const handleConfirm = () => {
    const finalReason =
      selectedReason === "custom" ? customReason.trim() : selectedReason;

    if (!finalReason) {
      return; // Button should be disabled anyway
    }

    onConfirm(finalReason);
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedReason("");
      setCustomReason("");
      onClose();
    }
  };

  const finalReason =
    selectedReason === "custom" ? customReason.trim() : selectedReason;
  const canConfirm = finalReason.length > 0 && !isLoading;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Reject Responses
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Rejecting {selectedCount} response
                {selectedCount !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
            >
              <svg
                className="w-6 h-6"
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
            </button>
          </div>

          {/* Reason Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>

              {isLoadingReasons ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {predefinedReasons.map((reason) => (
                    <label
                      key={reason.id}
                      className="flex items-start gap-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rejectionReason"
                        value={reason.reason_text}
                        checked={selectedReason === reason.reason_text}
                        onChange={(e) => handleReasonChange(e.target.value)}
                        className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 dark:border-gray-600"
                        disabled={isLoading}
                      />
                      <div className="flex-1">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {reason.reason_text}
                        </span>
                        {reason.is_default && (
                          <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </label>
                  ))}

                  {/* Custom reason option */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="rejectionReason"
                      value="custom"
                      checked={selectedReason === "custom"}
                      onChange={(e) => handleReasonChange(e.target.value)}
                      className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 dark:border-gray-600"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-gray-900 dark:text-white">
                      Custom reason
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Custom reason text area */}
            {selectedReason === "custom" && (
              <div>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Enter your rejection reason..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white text-sm"
                  rows={3}
                  maxLength={500}
                  disabled={isLoading}
                />
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {customReason.length}/500 characters
                </div>
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
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
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium">Important:</p>
                <ul className="mt-1 list-disc list-inside space-y-1 text-xs">
                  <li>
                    Each rejected response will result in -5 reputation for the
                    respondent
                  </li>
                  <li>
                    Rejected responses can later be accepted (which awards +10
                    reputation for a net +5)
                  </li>
                  <li>
                    The rejection reason will be visible to the respondent
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Rejecting...
                </>
              ) : (
                <>
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
                  Reject {selectedCount} Response
                  {selectedCount !== 1 ? "s" : ""}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

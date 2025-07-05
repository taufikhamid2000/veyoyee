interface Question {
  id: string;
  questionText: string;
}

interface SurveyResponse {
  id: string;
  respondent: string;
  submittedAt: string;
  status: "pending" | "accepted" | "rejected";
  answers: Record<string, string | string[]>;
}

interface ResponseModalProps {
  response: SurveyResponse | null;
  questions: Question[];
  formattedDate: string;
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
  onDelete: () => void;
}

export default function ResponseModal({
  response,
  questions,
  formattedDate,
  isOpen,
  onClose,
  onAccept,
  onReject,
  onDelete,
}: ResponseModalProps) {
  if (!isOpen || !response) return null;

  const isProcessed =
    response.status === "accepted" || response.status === "rejected";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Response Details
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Response Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Respondent:
              </span>
              <p className="text-gray-900 dark:text-white font-medium">
                {response.respondent}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Submitted At:
              </span>
              <p className="text-gray-900 dark:text-white font-medium">
                {formattedDate}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status:
              </span>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${
                  response.status === "accepted"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : response.status === "rejected"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}
              >
                {response.status.charAt(0).toUpperCase() +
                  response.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Questions and Answers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Survey Responses
            </h3>
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white mb-2">
                      {question.questionText}
                    </p>
                    <div className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      {Array.isArray(response.answers[question.id])
                        ? (response.answers[question.id] as string[]).join(", ")
                        : response.answers[question.id] || (
                            <span className="text-gray-400 italic">
                              No response
                            </span>
                          )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          {!isProcessed && (
            <>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors"
                onClick={onAccept}
              >
                Accept
              </button>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded font-medium transition-colors"
                onClick={onReject}
              >
                Reject
              </button>
            </>
          )}
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition-colors"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

interface ShortAnswerInputProps {
  type: "shortAnswer" | "paragraph";
}

export default function ShortAnswerInput({ type }: ShortAnswerInputProps) {
  // No special configuration for short answer or paragraph types
  return (
    <div className="mt-4">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {type === "shortAnswer"
          ? "Respondents will enter a short text answer"
          : "Respondents will enter a longer paragraph of text"}
      </p>
      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
        <div className="text-sm text-gray-500 dark:text-gray-400">Preview:</div>
        <div className="mt-1">
          {type === "shortAnswer" ? (
            <input
              type="text"
              disabled
              placeholder="Short answer text"
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded"
            />
          ) : (
            <textarea
              disabled
              rows={3}
              placeholder="Longer paragraph text..."
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
}

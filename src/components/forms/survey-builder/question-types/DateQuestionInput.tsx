// No imports needed as we don't use any props

export default function DateQuestionInput() {
  // No special configuration for date questions at this time

  return (
    <div className="mt-4">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Respondents will select a date from a calendar picker
      </p>

      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
        <div className="text-sm text-gray-500 dark:text-gray-400">Preview:</div>
        <div className="mt-1">
          <input
            type="date"
            disabled
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded"
          />
        </div>
      </div>
    </div>
  );
}

// No imports needed as we don't use any props

export default function LinkInputQuestion() {
  // No special configuration for link input questions at this time

  return (
    <div className="mt-4">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Respondents will enter a URL/link (e.g., Google Drive, Dropbox, etc.)
      </p>

      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
        <div className="text-sm text-gray-500 dark:text-gray-400">Preview:</div>
        <div className="mt-1">
          <input
            type="url"
            disabled
            placeholder="https://"
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded"
          />
        </div>
      </div>
    </div>
  );
}

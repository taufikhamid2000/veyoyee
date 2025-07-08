interface LoadingStateProps {
  message?: string;
  className?: string;
}

export default function LoadingState({
  message = "Loading...",
  className = "min-h-screen bg-gray-50 dark:bg-gray-900",
}: LoadingStateProps) {
  return (
    <div className={className}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

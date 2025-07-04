import { Skeleton } from "@/components/ui/skeleton";

export default function SurveyorLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-8 space-y-3">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          {/* Form Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
            {/* Survey Title */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-80" />
            </div>

            {/* Survey Description */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-3 w-72" />
            </div>

            {/* Survey Type and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Additional Settings */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

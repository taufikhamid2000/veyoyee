import { Skeleton, SkeletonStats } from "@/components/ui/skeleton";

export default function SurveyAnalysisLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-88" />
        </div>

        {/* Analysis Tabs */}
        <div className="space-y-4">
          <div className="flex space-x-1 border-b">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-30" />
            <Skeleton className="h-10 w-26" />
          </div>

          {/* Analysis Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Analysis Panel */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-80 w-full" />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <SkeletonStats />
              <SkeletonStats />

              <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

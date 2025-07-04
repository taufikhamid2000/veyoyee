import {
  SkeletonStats,
  SkeletonTable,
  Skeleton,
} from "@/components/ui/skeleton";

export default function SurveyResultsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonStats />
          <SkeletonStats />
          <SkeletonStats />
          <SkeletonStats />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>

        {/* Responses Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border">
          <div className="p-6 border-b space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="p-6">
            <SkeletonTable rows={8} columns={5} />
          </div>
        </div>
      </div>
    </div>
  );
}

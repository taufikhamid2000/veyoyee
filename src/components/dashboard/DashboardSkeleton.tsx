import {
  SkeletonCard,
  SkeletonStats,
  SkeletonTable,
  Skeleton,
} from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonStats />
        <SkeletonStats />
        <SkeletonStats />
        <SkeletonStats />
      </div>

      {/* Survey Tabs Skeleton */}
      <div className="space-y-4">
        <div className="flex space-x-1">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-18" />
        </div>

        {/* Survey Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="rounded-lg border">
          <SkeletonTable rows={5} columns={4} className="p-4" />
        </div>
      </div>
    </div>
  );
}

export function SurveyCardSkeleton() {
  return <SkeletonCard />;
}

export function StatsCardSkeleton() {
  return <SkeletonStats />;
}

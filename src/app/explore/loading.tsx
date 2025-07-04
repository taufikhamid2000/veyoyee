import { SkeletonCard, Skeleton } from "@/components/ui/skeleton";

export function ExploreSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-wrap gap-4 py-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Survey Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export default function ExploreLoading() {
  return (
    <div className="min-w-0 w-screen max-w-none bg-inherit">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <ExploreSkeleton />
      </div>
    </div>
  );
}

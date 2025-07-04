import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export default function DashboardLoading() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <DashboardSkeleton />
    </div>
  );
}

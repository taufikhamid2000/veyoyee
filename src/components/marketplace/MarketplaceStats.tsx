interface MarketplaceStatsProps {
  transferableCount: number;
  totalCount: number;
}

export default function MarketplaceStats({
  transferableCount,
  totalCount,
}: MarketplaceStatsProps) {
  return (
    <div className="mb-8 flex flex-col md:flex-row gap-4 md:gap-8">
      <div className="bg-blue-900 dark:bg-blue-900/30 rounded-lg px-5 py-3 flex-1 flex items-center gap-3">
        <span className="font-semibold text-blue-100 dark:text-white">
          Datasets for Sale:
        </span>
        <span className="text-lg font-bold text-blue-100 dark:text-white">
          {transferableCount}
        </span>
        <span className="text-xs text-blue-200 flex items-center gap-1">
          Transferable
        </span>
      </div>
      <div className="bg-green-50 dark:bg-green-900/30 rounded-lg px-5 py-3 flex-1 flex items-center gap-3">
        <span className="font-semibold text-green-900 dark:text-white">
          Total Datasets:
        </span>
        <span className="text-lg font-bold text-green-900 dark:text-white">
          {totalCount}
        </span>
      </div>
    </div>
  );
}

interface MarketplaceControlsProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  showTransferable: boolean;
  onTransferableChange: (value: boolean) => void;
  onPageChange: (page: number) => void;
}

export default function MarketplaceControls({
  search,
  onSearchChange,
  sort,
  onSortChange,
  showTransferable,
  onTransferableChange,
  onPageChange,
}: MarketplaceControlsProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search datasets..."
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              onPageChange(1);
            }}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm w-full sm:w-80 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="recent">Sort: Most Recent</option>
          <option value="price">Sort: Price (Low to High)</option>
          <option value="sample">Sort: Sample Size (High to Low)</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <input
          type="checkbox"
          checked={showTransferable}
          onChange={(e) => {
            onTransferableChange(e.target.checked);
            onPageChange(1);
          }}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
        <span className="select-none">Show transferable only</span>
      </label>
    </div>
  );
}

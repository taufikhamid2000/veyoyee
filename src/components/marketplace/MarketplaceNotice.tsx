export default function MarketplaceNotice() {
  return (
    <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <svg
          className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="text-sm text-blue-200">
          <p className="font-medium mb-1">Secure Marketplace for Survey Data</p>
          <p>
            All datasets are verified and comply with privacy standards.
            Transferable datasets can be purchased securely, while private
            datasets require owner approval for access.
          </p>
        </div>
      </div>
    </div>
  );
}

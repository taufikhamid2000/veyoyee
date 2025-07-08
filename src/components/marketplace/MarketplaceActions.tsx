import Link from "next/link";

interface MarketplaceActionsProps {
  className?: string;
}

export default function MarketplaceActions({
  className = "flex justify-end mb-6",
}: MarketplaceActionsProps) {
  return (
    <div className={className}>
      <Link href="/marketplace/list">
        <button className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition">
          + List/Upload Your Survey Data
        </button>
      </Link>
    </div>
  );
}

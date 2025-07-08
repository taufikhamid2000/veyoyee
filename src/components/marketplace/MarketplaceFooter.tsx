import Link from "next/link";

interface MarketplaceFooterProps {
  className?: string;
}

export default function MarketplaceFooter({
  className = "mt-10 text-center",
}: MarketplaceFooterProps) {
  return (
    <div className={className}>
      <Link
        href="/dashboard"
        className="text-blue-600 dark:text-blue-400 underline text-sm"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

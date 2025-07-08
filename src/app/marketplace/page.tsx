"use client";
import { useState, useEffect } from "react";
import { MarketplaceItem } from "@/components/marketplace/MarketplaceGrid";
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import MarketplaceControls from "@/components/marketplace/MarketplaceControls";
import MarketplaceNotice from "@/components/marketplace/MarketplaceNotice";
import MarketplaceGrid from "@/components/marketplace/MarketplaceGrid";
import Pagination from "@/components/marketplace/Pagination";
import UploadModal from "@/components/marketplace/UploadModal";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";

// Mock data for marketplace listings
const mockMarketplace: MarketplaceItem[] = [
  {
    id: "survey-001",
    title: "2025 Student Wellbeing Survey",
    description:
      "Responses from 500 university students on mental health, study habits, and campus life.",
    sampleSize: 500,
    price: 49.99,
    owner: "researcher_abc",
    isTransferable: true,
    lastUpdated: "2025-06-20",
  },
  {
    id: "survey-002",
    title: "Consumer Electronics Preferences",
    description:
      "Survey data on 300 consumers' preferences for electronics brands and features.",
    sampleSize: 300,
    price: 29.99,
    owner: "surveyor_xyz",
    isTransferable: false,
    lastUpdated: "2025-06-10",
  },
  {
    id: "survey-003",
    title: "Open Access: Urban Mobility Habits",
    description:
      "Anonymized responses from 200 city residents about daily transportation choices. Free to download and use.",
    sampleSize: 200,
    price: 0.0,
    owner: "urban_researcher",
    isTransferable: true,
    lastUpdated: "2025-06-22",
  },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [showTransferable, setShowTransferable] = useState(false);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState("csv");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 6;

  useEffect(() => {
    // Simulate loading marketplace data
    const loadMarketplace = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Simulate random error for demo (remove in production)
        if (Math.random() < 0.1) {
          throw new Error("Failed to load marketplace data");
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    loadMarketplace();
  }, []);

  if (loading) {
    return <LoadingState message="Loading marketplace data..." />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => {
          setError(null);
          setLoading(true);
          // Trigger reload
          setTimeout(() => setLoading(false), 800);
        }}
      />
    );
  }

  // Filter, search, sort logic
  let filtered = mockMarketplace.filter((item) => {
    if (showTransferable && !item.isTransferable) return false;
    // Hide non-transferable datasets by default
    if (!item.isTransferable) return false;
    if (
      search &&
      !(
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.owner.toLowerCase().includes(search.toLowerCase())
      )
    )
      return false;
    return true;
  });

  if (sort === "recent") {
    filtered = filtered.sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
  } else if (sort === "price") {
    filtered = filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "sample") {
    filtered = filtered.sort((a, b) => b.sampleSize - a.sampleSize);
  }

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    alert(`Uploaded ${uploadFile.name} as ${uploadType.toUpperCase()}`);
    setShowModal(false);
    setUploadFile(null);
  };

  // Calculate stats for header
  const transferableCount = mockMarketplace.filter(
    (d) => d.isTransferable
  ).length;
  const totalSampleSize = mockMarketplace.reduce(
    (sum, item) => sum + item.sampleSize,
    0
  );
  const avgPrice = mockMarketplace
    .filter((item) => item.isTransferable && item.price > 0)
    .reduce((sum, item, _, array) => sum + item.price / array.length, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MarketplaceHeader
        title="Survey Data Marketplace"
        description="Browse, buy, or request access to existing survey datasets"
        transferableCount={transferableCount}
        totalCount={mockMarketplace.length}
        totalSampleSize={totalSampleSize}
        avgPrice={avgPrice}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <MarketplaceNotice />

        <MarketplaceControls
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
          showTransferable={showTransferable}
          onTransferableChange={setShowTransferable}
          onPageChange={setPage}
        />

        <UploadModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          uploadFile={uploadFile}
          onFileChange={setUploadFile}
          uploadType={uploadType}
          onTypeChange={setUploadType}
          onSubmit={handleUploadSubmit}
        />

        <MarketplaceGrid items={paged} />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

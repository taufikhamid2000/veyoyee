"use client";
import Link from "next/link";
import { useState, useRef } from "react";

// Mock data for marketplace listings
const mockMarketplace = [
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pageSize = 6;

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

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent mb-2">
        Survey Data Marketplace
      </h1>
      <p className="mb-8 text-gray-900 dark:text-gray-400 max-w-2xl">
        Browse, buy, or request access to existing survey datasets. Survey
        owners can list their data for sale or transfer to other researchers.
      </p>
      {/* Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 md:gap-8 items-center">
        <input
          type="text"
          placeholder="Search datasets..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm w-full md:w-64"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
        >
          <option value="recent">Sort: Most Recent</option>
          <option value="price">Sort: Price (Low to High)</option>
          <option value="sample">Sort: Sample Size (High to Low)</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showTransferable}
            onChange={(e) => {
              setShowTransferable(e.target.checked);
              setPage(1);
            }}
            className="accent-blue-600"
          />
          Transferable Only
        </label>
      </div>
      <div className="flex justify-end mb-6">
        <Link href="/marketplace/list">
          <button className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition">
            + List/Upload Your Survey Data
          </button>
        </Link>
      </div>
      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-200">
              Upload Survey Data
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!uploadFile) return;
                alert(
                  `Uploaded ${uploadFile.name} as ${uploadType.toUpperCase()}`
                );
                setShowModal(false);
                setUploadFile(null);
              }}
            >
              <label className="block mb-2 font-medium">File Type</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="mb-4 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm w-full"
              >
                <option value="csv">CSV (Comma Separated Values)</option>
                <option value="pdf">PDF (Portable Document Format)</option>
              </select>
              <label className="block mb-2 font-medium">Select File</label>
              <input
                ref={fileInputRef}
                type="file"
                accept={uploadType === "csv" ? ".csv" : ".pdf"}
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="mb-4 block w-full text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploadFile && (
                <div className="mb-4 text-xs text-gray-600 dark:text-gray-300">
                  Selected: {uploadFile.name}
                </div>
              )}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                disabled={!uploadFile}
              >
                Upload
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Stat cards */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 md:gap-8">
        <div className="bg-blue-900 dark:bg-blue-900/30 rounded-lg px-5 py-3 flex-1 flex items-center gap-3">
          <span className="font-semibold text-blue-100 dark:text-white">
            Datasets for Sale:
          </span>
          <span className="text-lg font-bold text-blue-100 dark:text-white">
            {mockMarketplace.filter((d) => d.isTransferable).length}
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
            {mockMarketplace.length}
          </span>
        </div>
      </div>
      {/* Marketplace grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {paged.length === 0 ? (
          <div className="col-span-2 text-center text-gray-500 dark:text-gray-400 py-12">
            No datasets found.
          </div>
        ) : (
          paged.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-5 bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2 text-blue-900 dark:text-blue-300">
                  {item.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-200 mb-2">
                  {item.description}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Sample Size:
                  <span className="font-medium">{item.sampleSize}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Owner: <span className="font-mono">{item.owner}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Last Updated:
                  {new Date(item.lastUpdated).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                {item.isTransferable ? (
                  item.price === 0 ? (
                    <a
                      href="#"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-center w-full block"
                    >
                      Free Download
                    </a>
                  ) : (
                    <>
                      <span className="text-lg font-bold text-green-700 dark:text-green-400">
                        ${item.price.toFixed(2)}
                      </span>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                        Buy
                      </button>
                    </>
                  )
                ) : (
                  <span className="text-xs text-gray-400 w-full block text-center">
                    Not transferable
                    <br />
                    <span className="text-gray-500">
                      Contact owner to request access
                    </span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="px-2 py-1 text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
      <div className="mt-10 text-center">
        <Link
          href="/dashboard"
          className="text-blue-600 dark:text-blue-400 underline text-sm"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

"use client";
import { useState, useRef } from "react";
import Link from "next/link";

export default function ListSurveyPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [price, setPrice] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the data to your backend
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
        List Your Survey Data
      </h1>
      <p className="mb-8 text-center text-gray-600 dark:text-gray-100">
        Fill in the details below to list your survey dataset for sale, sharing,
        or free download in the marketplace.
      </p>
      {submitted ? (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded p-6 text-center font-semibold">
          Your dataset has been submitted! (Demo only)
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium mb-1">Owner Name</label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              required
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Price (USD)</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
            />
            <span className="text-xs text-gray-500">
              Set to 0 for free/open access
            </span>
          </div>
          {/* Removed transferable checkbox, all listings are transferable */}
          <div>
            <label className="block font-medium mb-1">
              Upload Files (CSV or PDF)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.pdf"
              multiple
              onChange={(e) =>
                setFiles(e.target.files ? Array.from(e.target.files) : [])
              }
              required
              className="block w-full text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {files.length > 0 && (
              <ul className="mt-1 text-xs text-gray-600 dark:text-gray-300 list-disc list-inside">
                {files.map((f) => (
                  <li key={f.name}>{f.name}</li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
            disabled={!title || !description || !owner || files.length === 0}
          >
            Submit
          </button>
        </form>
      )}
      <div className="mt-8 text-center">
        <Link
          href="/marketplace"
          className="text-blue-600 dark:text-blue-400 underline text-sm"
        >
          Back to Marketplace
        </Link>
      </div>
    </div>
  );
}

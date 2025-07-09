"use client";
import { useState } from "react";
import Link from "next/link";

interface ClosedSurvey {
  id: string;
  title: string;
  description: string;
  price: number;
}

interface ListSurveyPageProps {
  closedSurveys: ClosedSurvey[];
}

export default function ListSurveyPage({
  closedSurveys = [],
}: ListSurveyPageProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [price, setPrice] = useState(0);
  const [fileLinks, setFileLinks] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showClosedSurveys, setShowClosedSurveys] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the data to your backend, including fileLinks
  }

  // Prefill form from closed survey
  function handleSelectClosedSurvey(survey: ClosedSurvey) {
    setTitle(survey.title);
    setDescription(survey.description || "");
    setPrice(survey.price);
  }

  return (
    <>
      <div className="max-w-xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
          List Your Survey Data
        </h1>
        <p className="mb-8 text-center text-gray-600 dark:text-gray-100">
          Fill in the details below to list your survey dataset for sale,
          sharing, or free download in the marketplace.
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
            <div>
              <label className="block font-medium mb-1">
                File Links (Google Drive, Dropbox, etc.)
              </label>
              <div className="space-y-2">
                {fileLinks.map((link, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => {
                        const newLinks = [...fileLinks];
                        newLinks[idx] = e.target.value;
                        setFileLinks(newLinks);
                      }}
                      required
                      placeholder="https://drive.google.com/yourfile"
                      className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFileLinks(fileLinks.filter((_, i) => i !== idx))
                      }
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFileLinks([...fileLinks, ""])}
                  className="text-blue-600 dark:text-blue-400 underline text-xs mt-1"
                >
                  + Add File Link
                </button>
              </div>
              <span className="text-xs text-gray-500">
                Paste public or shareable links to your dataset files (Google
                Drive, Dropbox, etc.)
              </span>
            </div>
            {/* Closed surveys section inserted here */}
            {closedSurveys.length > 0 && (
              <div className="mt-8">
                <p className="text-center text-base font-medium mb-2">
                  Or do you have a closed survey in Veyoyee you want to list?
                </p>
                <button
                  type="button"
                  className="flex items-center gap-2 text-lg font-semibold mb-2 mx-auto focus:outline-none"
                  onClick={() => setShowClosedSurveys((v) => !v)}
                  aria-expanded={showClosedSurveys}
                >
                  <span>{showClosedSurveys ? "▼" : "▶"}</span>
                  List a Closed Survey
                </button>
                {showClosedSurveys && (
                  <ul className="space-y-2 mt-2">
                    {closedSurveys.map((survey) => (
                      <li
                        key={survey.id}
                        className="flex items-center gap-2 justify-center"
                      >
                        <button
                          type="button"
                          className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-sm hover:bg-blue-100 dark:hover:bg-blue-900"
                          onClick={() => handleSelectClosedSurvey(survey)}
                        >
                          Use
                        </button>
                        <span className="font-medium">{survey.title}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          (ID: {survey.id})
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
              disabled={
                !title ||
                !description ||
                !owner ||
                fileLinks.length === 0 ||
                fileLinks.some((l) => !l)
              }
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
    </>
  );
}

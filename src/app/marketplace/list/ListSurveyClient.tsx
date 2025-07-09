"use client";
import { useState } from "react";
import Link from "next/link";

interface ClosedSurvey {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  start_date: string | null;
  end_date: string | null;
  reward_amount: number | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  owned_by: string;
}

interface ListSurveyPageProps {
  closedSurveys: ClosedSurvey[];
}

export default function ListSurveyPage({
  closedSurveys = [],
}: ListSurveyPageProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showClosedSurveys, setShowClosedSurveys] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the data to your backend, including selectedSurveyId
  }

  // Prefill form from closed survey
  function handleSelectClosedSurvey(survey: ClosedSurvey) {
    setTitle(survey.title);
    setDescription(survey.description || "");
    setPrice(survey.price);
    setSelectedSurveyId(survey.id);
  }

  return (
    <>
      <div className="max-w-xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
          List Your Closed Survey
        </h1>
        <p className="mb-8 text-center text-gray-600 dark:text-gray-100">
          Select one of your closed surveys below to list it in the marketplace.
        </p>
        {submitted ? (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded p-6 text-center font-semibold">
            Your closed survey has been listed! (Demo only)
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="mb-8">
              <button
                type="button"
                className="flex items-center gap-2 text-lg font-semibold mb-2 mx-auto focus:outline-none"
                onClick={() => setShowClosedSurveys((v) => !v)}
                aria-expanded={showClosedSurveys}
              >
                <span>{showClosedSurveys ? "▼" : "▶"}</span>
                Select a Closed Survey
              </button>
              {showClosedSurveys && (
                <ul className="space-y-2 mt-2">
                  {closedSurveys.map((survey) => (
                    <li
                      key={survey.id}
                      className="flex flex-col gap-1 p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 mb-2"
                    >
                      <div className="flex items-center gap-2 justify-between">
                        <button
                          type="button"
                          className={`px-2 py-1 rounded text-sm font-semibold border ${
                            selectedSurveyId === survey.id
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                          }`}
                          onClick={() => handleSelectClosedSurvey(survey)}
                        >
                          {selectedSurveyId === survey.id
                            ? "Selected"
                            : "Select"}
                        </button>
                        <span className="font-medium text-lg">
                          {survey.title}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          (ID: {survey.id})
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-700 dark:text-gray-200 mt-2">
                        <div>
                          <span className="font-semibold">Type:</span>{" "}
                          {survey.type}
                        </div>
                        <div>
                          <span className="font-semibold">Reward:</span>{" "}
                          {survey.reward_amount ?? "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Start:</span>{" "}
                          {survey.start_date ?? "-"}
                        </div>
                        <div>
                          <span className="font-semibold">End:</span>{" "}
                          {survey.end_date ?? "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Created At:</span>{" "}
                          {new Date(survey.created_at).toLocaleString()}
                        </div>
                        <div>
                          <span className="font-semibold">Updated At:</span>{" "}
                          {new Date(survey.updated_at).toLocaleString()}
                        </div>
                        <div>
                          <span className="font-semibold">Created By:</span>{" "}
                          {survey.created_by}
                        </div>
                        <div>
                          <span className="font-semibold">Owned By:</span>{" "}
                          {survey.owned_by}
                        </div>
                        <div className="col-span-2">
                          <span className="font-semibold">Description:</span>{" "}
                          {survey.description}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Title</label>
              <input
                type="text"
                value={title}
                readOnly
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                value={description}
                readOnly
                rows={3}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm cursor-not-allowed"
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
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
              disabled={!selectedSurveyId}
            >
              List Survey
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

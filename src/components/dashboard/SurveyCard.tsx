import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface SurveyCardProps {
  id: string;
  title: string;
  responses: number;
  completionRate: number;
  status: "active" | "draft" | "closed";
  lastUpdated: string;
  questions: number;
  isOwner?: boolean;
}

export default function SurveyCard({
  id,
  title,
  responses,
  completionRate,
  status,
  lastUpdated,
  questions,
  isOwner = false,
}: SurveyCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const handleShare = async () => {
    const url = `${window.location.origin}/explore?survey=${id}`;
    const message = `Hi, can you help me answer this survey ${url}`;
    await navigator.clipboard.writeText(message);
    setMenuOpen(false);
    alert("Share message copied to clipboard!");
  };

  const handleDelete = () => {
    setMenuOpen(false);
    // TODO: Implement delete logic (e.g., confirmation dialog, API call)
    alert("Delete survey (not implemented)");
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border ${
        status === "active"
          ? "border-green-100 dark:border-green-900/30"
          : status === "draft"
          ? "border-amber-100 dark:border-amber-900/30"
          : "border-gray-100 dark:border-gray-700"
      } overflow-hidden shadow-sm hover:shadow-md transition-all`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                status === "active"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : status === "draft"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            {/* Share button always visible */}
            <button
              className="ml-1 px-2 py-1 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600/30 flex items-center justify-center"
              onClick={handleShare}
              aria-label="Share survey"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m7.5 0v10.5A2.25 2.25 0 0113.5 21h-3A2.25 2.25 0 018.25 19.5V9m7.5 0H8.25m7.5 0l-3.72-3.72a.75.75 0 00-1.06 0L8.25 9"
                />
              </svg>
            </button>
            {/* More options only for owner */}
            {isOwner && (
              <div className="relative" ref={menuRef}>
                <button
                  className="ml-1 px-2 py-1 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600/30 flex items-center justify-center"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  aria-label="More options"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                    />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 py-1 animate-fade-in">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50"
                      onClick={handleDelete}
                      disabled={status !== "draft"}
                      title={
                        status !== "draft"
                          ? "Can only delete draft surveys"
                          : "Delete"
                      }
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-4 mb-4 text-sm">
          <div>
            <span className="block text-gray-500 dark:text-gray-400">
              Responses
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {responses}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 dark:text-gray-400">
              Questions
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {questions}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 dark:text-gray-400">
              Completion
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {completionRate}%
            </span>
          </div>
        </div>
        {responses > 0 && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        )}
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Last updated: {lastUpdated}
        </div>
        <div className="flex space-x-2">
          {isOwner && (
            <>
              <button
                className="px-3 py-1.5 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-center flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => router.push(`/surveyor/edit/${id}`)}
                disabled={status === "active" || status === "closed"}
                title={
                  status === "active"
                    ? "Cannot edit an active survey"
                    : status === "closed"
                    ? "Cannot edit a closed survey"
                    : "Edit"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                Edit
              </button>
              <button
                className="px-3 py-1.5 bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 flex items-center justify-center flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => router.push(`/surveyor/results/${id}`)}
                disabled={status === "draft"}
                title={
                  status === "draft" ? "No results for draft survey" : "Results"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                  />
                </svg>
                Results
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

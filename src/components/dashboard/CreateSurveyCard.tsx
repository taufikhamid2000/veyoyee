import Link from "next/link";
import React from "react";

export default function CreateSurveyCard() {
  return (
    <Link href="/surveyor" className="block">
      <div
        className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer flex items-center justify-center"
        style={{ minHeight: "230px" }}
      >
        <div className="text-center p-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-7 h-7 text-blue-600 dark:text-blue-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
          <h3 className="font-medium text-gray-700 dark:text-gray-300">
            Create New Survey
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Start from scratch or use a template
          </p>
        </div>
      </div>
    </Link>
  );
}

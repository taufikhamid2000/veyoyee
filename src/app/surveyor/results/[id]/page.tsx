"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { mockSurveys } from "@/data/dashboard-data";
import { mockSurveyResults } from "@/data/results-data";
import { useState, use as usePromise } from "react";

export default function SurveyResultsPage({ params }: any) {
  // Always call usePromise, pass params if it's a Promise, else pass Promise.resolve(params)
  const resolvedParams = usePromise(
    typeof params.then === "function" ? params : Promise.resolve(params)
  ) as { id: string };
  const [selectedResponse, setSelectedResponse] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"respondent" | "submittedAt">(
    "submittedAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const id = resolvedParams.id;
  const survey = mockSurveys.find((s) => s.id === id);
  if (!survey) return notFound();
  if (survey.status === "draft") return notFound();

  const results = mockSurveyResults.filter((r) => r.surveyId === id);
  const questions = survey.questionsData || [];

  // If there are no questions, show answers as JSON for debugging
  const showRawAnswers = questions.length === 0 && results.length > 0;

  // Filtered and sorted results
  const filteredResults = results.filter(
    (r) =>
      r.respondent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(r.submittedAt)
        .toLocaleString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === "respondent") {
      return sortOrder === "asc"
        ? a.respondent.localeCompare(b.respondent)
        : b.respondent.localeCompare(a.respondent);
    } else {
      return sortOrder === "asc"
        ? new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
        : new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    }
  });

  const totalPages = Math.ceil(sortedResults.length / pageSize);
  const paginatedResults = sortedResults.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // CSV export helper
  function exportToCSV() {
    if (results.length === 0) return;
    const headers = [
      "Respondent",
      "Submitted At",
      ...questions.map((q) => q.questionText),
    ];
    const rows = results.map((resp) => [
      resp.respondent,
      new Date(resp.submittedAt).toLocaleString(),
      ...questions.map((q) => {
        const ans = resp.answers[q.id];
        return Array.isArray(ans) ? ans.join(", ") : ans || "";
      }),
    ]);
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${survey?.title?.replace(/[^a-z0-9]/gi, "_") || "survey"}_results.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Handler for toggling a single row
  const handleRowCheckbox = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Handler for toggling all rows
  const handleAllCheckbox = () => {
    if (selectedRows.length === results.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(results.map((r) => r.id));
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6">
        Survey Results: {survey.title}
      </h1>
      {results.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">
          No responses yet.
        </div>
      ) : showRawAnswers ? (
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Raw Answers</h2>
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
          <div className="text-gray-500 mt-2">
            No question metadata available for this survey.
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
            <input
              type="text"
              placeholder="Search respondent or date..."
              className="border px-2 py-1 rounded w-full md:w-64 text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <div className="flex gap-2">
              <button
                className={`text-xs px-2 py-1 rounded border transition-colors ${
                  sortBy === "respondent"
                    ? "bg-blue-100 border-blue-400 dark:bg-blue-900 dark:border-blue-500 text-blue-800 dark:text-blue-200"
                    : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                }`}
                onClick={() => {
                  setSortBy("respondent");
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
              >
                Sort by Respondent{" "}
                {sortBy === "respondent"
                  ? sortOrder === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </button>
              <button
                className={`text-xs px-2 py-1 rounded border ${
                  sortBy === "submittedAt"
                    ? "bg-blue-100 border-blue-400 dark:bg-blue-900 dark:border-blue-500 text-blue-800 dark:text-blue-200"
                    : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                }`}
                onClick={() => {
                  setSortBy("submittedAt");
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
              >
                Sort by Date{" "}
                {sortBy === "submittedAt"
                  ? sortOrder === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </button>
              <button
                className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={exportToCSV}
                disabled={results.length === 0}
              >
                Export as CSV
              </button>
            </div>
          </div>
          <div className="overflow-x-auto mb-4">
            <div className="flex gap-2 mb-2">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-semibold disabled:opacity-50"
                disabled={selectedRows.length === 0}
                onClick={() => {
                  // TODO: Implement bulk accept logic
                  alert(`Accepted: ${selectedRows.join(", ")}`);
                }}
              >
                Accept Selected
              </button>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded font-semibold disabled:opacity-50"
                disabled={selectedRows.length === 0}
                onClick={() => {
                  // TODO: Implement bulk reject logic
                  alert(`Rejected: ${selectedRows.join(", ")}`);
                }}
              >
                Reject Selected
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold disabled:opacity-50"
                disabled={selectedRows.length === 0}
                onClick={() => {
                  // TODO: Implement bulk delete logic
                  alert(`Deleted: ${selectedRows.join(", ")}`);
                }}
              >
                Delete Selected
              </button>
            </div>
            <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-2 py-2">
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === results.length &&
                        results.length > 0
                      }
                      onChange={handleAllCheckbox}
                      aria-label="Select all responses"
                    />
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Respondent
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Submitted At
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedResults.map((resp) => (
                  <tr key={resp.id}>
                    <td className="px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(resp.id)}
                        onChange={() => handleRowCheckbox(resp.id)}
                        aria-label={`Select response ${resp.id}`}
                      />
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                      {resp.respondent}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(resp.submittedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => {
                          setSelectedResponse(resp);
                          setModalOpen(true);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination controls */}
          <div className="flex justify-center gap-2 mb-4">
            <button
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm px-2 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          {/* Modal for viewing individual response */}
          {modalOpen && selectedResponse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Response Details</h2>
                <div className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Respondent:</span>{" "}
                  {selectedResponse.respondent}
                </div>
                <div className="mb-4 text-sm text-gray-500">
                  <span className="font-semibold">Submitted At:</span>{" "}
                  {new Date(selectedResponse.submittedAt).toLocaleString()}
                </div>
                <div className="space-y-3 mb-6">
                  {questions.map((q) => (
                    <div key={q.id}>
                      <div className="font-semibold text-gray-700 dark:text-gray-200">
                        {q.questionText}
                      </div>
                      <div className="text-gray-900 dark:text-white">
                        {Array.isArray(selectedResponse.answers[q.id])
                          ? (selectedResponse.answers[q.id] as string[]).join(
                              ", "
                            )
                          : selectedResponse.answers[q.id] || (
                              <span className="text-gray-400">-</span>
                            )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
                    onClick={() => {
                      // TODO: Implement accept logic
                      alert("Accepted! (Implement logic)");
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded font-semibold"
                    onClick={() => {
                      // TODO: Implement reject logic
                      alert("Rejected! (Implement logic)");
                    }}
                  >
                    Reject
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
                    onClick={() => {
                      // TODO: Implement delete logic
                      alert("Deleted! (Implement logic)");
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

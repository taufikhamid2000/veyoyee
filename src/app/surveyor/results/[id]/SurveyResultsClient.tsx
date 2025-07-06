"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSurveyResults } from "@/hooks/useSurveyResults";
import { formatDate } from "@/lib/utils";
import SearchControls from "@/components/survey-results/SearchControls";
import BulkActions from "@/components/survey-results/BulkActions";
import ResultsTable from "@/components/survey-results/ResultsTable";
import Pagination from "@/components/survey-results/Pagination";
import ResponseModal from "@/components/survey-results/ResponseModal";
import { FormattedSurvey } from "@/lib/services/survey-service";

interface SurveyResultsClientProps {
  survey: FormattedSurvey;
  responses: any[];
  surveyId: string;
}

export default function SurveyResultsClient({
  survey,
  responses,
  surveyId,
}: SurveyResultsClientProps) {
  const [selectedResponse, setSelectedResponse] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const questions = survey?.questions || [];

  const {
    selectedRows,
    searchTerm,
    sortBy,
    sortOrder,
    currentPage,
    formattedDates,
    filteredResults,
    paginatedResults,
    totalPages,
    isAllSelected,
    handleSearchChange,
    handleSort,
    handleRowSelect,
    handleSelectAll,
    handlePageChange,
  } = useSurveyResults({ results: responses, pageSize: 10 });

  // If there are no questions, show answers as JSON for debugging
  const showRawAnswers = questions.length === 0 && responses.length > 0;

  // Event handlers
  const handleViewResponse = (response: any) => {
    setSelectedResponse(response);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedResponse(null);
  };

  const handleAcceptSelected = () => {
    // TODO: Implement bulk accept logic
    alert(`Accepted: ${selectedRows.join(", ")}`);
  };

  const handleRejectSelected = () => {
    // TODO: Implement bulk reject logic
    alert(`Rejected: ${selectedRows.join(", ")}`);
  };

  const handleDeleteSelected = () => {
    // TODO: Implement bulk delete logic
    alert(`Deleted: ${selectedRows.join(", ")}`);
  };

  const handleAcceptResponse = () => {
    // TODO: Implement accept logic
    alert("Accepted! (Implement logic)");
    handleCloseModal();
  };

  const handleRejectResponse = () => {
    // TODO: Implement reject logic
    alert("Rejected! (Implement logic)");
    handleCloseModal();
  };

  const handleDeleteResponse = () => {
    // TODO: Implement delete logic
    alert("Deleted! (Implement logic)");
    handleCloseModal();
  };

  // CSV export helper
  const handleExportCSV = () => {
    // Only export accepted responses
    const acceptedResults = responses.filter(
      (resp) => resp.status === "accepted"
    );
    if (acceptedResults.length === 0) return;
    const headers = [
      "Respondent",
      "Submitted At",
      ...questions.map((q) => q.questionText),
    ];
    const rows = acceptedResults.map((resp) => [
      resp.respondent,
      formattedDates[resp.id],
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
      `${
        survey?.title?.replace(/[^a-z0-9]/gi, "_") || "survey"
      }_accepted_results.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Calculate stats for the header
  const totalResponses = responses.length;
  const acceptedResponses = responses.filter(
    (r) => r.status === "accepted"
  ).length;
  const pendingResponses = responses.filter(
    (r) => r.status === "pending"
  ).length;
  const rejectedResponses = responses.filter(
    (r) => r.status === "rejected"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 md:px-6 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <a
              href="/surveyor"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Surveys
            </a>
            <span className="mx-2">›</span>
            <span className="text-gray-900 dark:text-white font-medium">
              Results
            </span>
          </div>

          {/* Survey Info & Actions */}
          <div className="flex flex-col gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {survey.title || "Survey Results"}
              </h1>

              {/* Survey Meta */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    {questions.length} question
                    {questions.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Created {formatDate(survey.createdAt || "")}</span>
                </div>
                {survey.status && (
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        survey.status === "active"
                          ? "bg-green-500"
                          : survey.status === "draft"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}
                    />
                    <span className="capitalize">{survey.status}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={`/surveyor/edit/${surveyId}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Survey
              </a>
              <a
                href={`/surveyor/analysis/${surveyId}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                View Analysis
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Responses
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalResponses}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Accepted
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {acceptedResponses}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {pendingResponses}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Rejected
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {rejectedResponses}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {responses.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No responses yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Once people start responding to your survey, their responses
                will appear here for review and analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`/surveyor/edit/${surveyId}`}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Survey
                </a>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}/survey/${surveyId}`
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy Survey Link
                </button>
              </div>
            </div>
          </div>
        ) : showRawAnswers ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <svg
                    className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Raw Response Data
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No question metadata available for this survey
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {JSON.stringify(responses, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <SearchControls
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                onExportCSV={handleExportCSV}
                surveyId={surveyId}
                resultsCount={responses.length}
              />

              <BulkActions
                selectedRows={selectedRows}
                onAcceptSelected={handleAcceptSelected}
                onRejectSelected={handleRejectSelected}
                onDeleteSelected={handleDeleteSelected}
              />
            </div>

            <ResultsTable
              results={paginatedResults}
              selectedRows={selectedRows}
              formattedDates={formattedDates}
              onRowSelect={handleRowSelect}
              onSelectAll={handleSelectAll}
              onViewResponse={handleViewResponse}
              isAllSelected={isAllSelected}
            />

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={filteredResults.length}
                pageSize={10}
              />
            </div>

            <ResponseModal
              response={selectedResponse}
              questions={questions}
              formattedDate={
                selectedResponse ? formattedDates[selectedResponse.id] : ""
              }
              isOpen={modalOpen}
              onClose={handleCloseModal}
              onAccept={handleAcceptResponse}
              onReject={handleRejectResponse}
              onDelete={handleDeleteResponse}
            />
          </div>
        )}
      </div>
    </div>
  );
}

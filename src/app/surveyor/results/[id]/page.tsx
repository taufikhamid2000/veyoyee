"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { mockSurveys } from "@/data/dashboard-data";
import { mockSurveyResults } from "@/data/results-data";
import { useState, use as usePromise } from "react";
import { useSurveyResults } from "@/hooks/useSurveyResults";
import SearchControls from "@/components/survey-results/SearchControls";
import BulkActions from "@/components/survey-results/BulkActions";
import ResultsTable from "@/components/survey-results/ResultsTable";
import Pagination from "@/components/survey-results/Pagination";
import ResponseModal from "@/components/survey-results/ResponseModal";

export default function SurveyResultsPage({ params }: any) {
  // Always call usePromise, pass params if it's a Promise, else pass Promise.resolve(params)
  const resolvedParams = usePromise(
    typeof params.then === "function" ? params : Promise.resolve(params)
  ) as { id: string };

  const [selectedResponse, setSelectedResponse] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const id = resolvedParams.id;
  const survey = mockSurveys.find((s) => s.id === id);
  const results = mockSurveyResults.filter((r) => r.surveyId === id);
  const questions = survey?.questionsData || [];

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
  } = useSurveyResults({ results, pageSize: 10 });

  if (!survey) return notFound();
  if (survey.status === "draft") return notFound();

  // If there are no questions, show answers as JSON for debugging
  const showRawAnswers = questions.length === 0 && results.length > 0;

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
    const acceptedResults = results.filter(
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
          <SearchControls
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onExportCSV={handleExportCSV}
            surveyId={id}
            resultsCount={results.length}
          />

          <BulkActions
            selectedRows={selectedRows}
            onAcceptSelected={handleAcceptSelected}
            onRejectSelected={handleRejectSelected}
            onDeleteSelected={handleDeleteSelected}
          />

          <ResultsTable
            results={paginatedResults}
            selectedRows={selectedRows}
            formattedDates={formattedDates}
            onRowSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
            onViewResponse={handleViewResponse}
            isAllSelected={isAllSelected}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredResults.length}
            pageSize={10}
          />

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
        </>
      )}
    </div>
  );
}

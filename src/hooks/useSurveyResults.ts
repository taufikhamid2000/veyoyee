import { useState, useMemo } from "react";
import { formatDateTime } from "@/lib/utils";

interface SurveyResponse {
  id: string;
  respondent: string;
  submittedAt: string;
  status: "pending" | "accepted" | "rejected";
  answers: Record<string, string | string[]>;
}

interface UseSurveyResultsProps {
  results: SurveyResponse[];
  pageSize?: number;
}

export function useSurveyResults({
  results,
  pageSize = 10,
}: UseSurveyResultsProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"respondent" | "submittedAt">(
    "submittedAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Precompute formatted dates for all results to avoid hydration mismatch
  const formattedDates = useMemo(
    () =>
      results.reduce((acc, r) => {
        acc[r.id] = formatDateTime(r.submittedAt);
        return acc;
      }, {} as Record<string, string>),
    [results]
  );

  // Filtered and sorted results
  const filteredResults = useMemo(() => {
    return results.filter(
      (r) =>
        r.respondent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formattedDates[r.id].toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [results, searchTerm, formattedDates]);

  const sortedResults = useMemo(() => {
    return [...filteredResults].sort((a, b) => {
      if (sortBy === "respondent") {
        return sortOrder === "asc"
          ? a.respondent.localeCompare(b.respondent)
          : b.respondent.localeCompare(a.respondent);
      } else {
        return sortOrder === "asc"
          ? new Date(a.submittedAt).getTime() -
              new Date(b.submittedAt).getTime()
          : new Date(b.submittedAt).getTime() -
              new Date(a.submittedAt).getTime();
      }
    });
  }, [filteredResults, sortBy, sortOrder]);

  const totalPages = Math.ceil(sortedResults.length / pageSize);
  const paginatedResults = useMemo(() => {
    return sortedResults.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [sortedResults, currentPage, pageSize]);

  // Handlers
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSort = (field: "respondent" | "submittedAt") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    // Only select non-accepted responses (pending and rejected)
    const selectableResults = results.filter((r) => r.status !== "accepted");
    const selectableIds = selectableResults.map((r) => r.id);

    // Check if all selectable responses are already selected
    const allSelectableSelected =
      selectableIds.length > 0 &&
      selectableIds.every((id) => selectedRows.includes(id));

    if (allSelectableSelected) {
      // Deselect all selectable responses
      setSelectedRows((prev) =>
        prev.filter((id) => !selectableIds.includes(id))
      );
    } else {
      // Select all selectable responses (keeping any existing selections)
      setSelectedRows((prev) => {
        const newSelected = [...prev];
        selectableIds.forEach((id) => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    // State
    selectedRows,
    searchTerm,
    sortBy,
    sortOrder,
    currentPage,

    // Computed values
    formattedDates,
    filteredResults: sortedResults,
    paginatedResults,
    totalPages,
    // isAllSelected should only consider non-accepted responses
    isAllSelected: (() => {
      const selectableResults = results.filter((r) => r.status !== "accepted");
      const selectableIds = selectableResults.map((r) => r.id);
      return (
        selectableIds.length > 0 &&
        selectableIds.every((id) => selectedRows.includes(id))
      );
    })(),

    // Handlers
    handleSearchChange,
    handleSort,
    handleRowSelect,
    handleSelectAll,
    handlePageChange,

    // Utilities
    setSelectedRows,
  };
}

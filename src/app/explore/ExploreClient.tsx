"use client";
import { useState, useMemo } from "react";
import SurveyCard from "@/components/dashboard/SurveyCard";
import { mockSurveys } from "@/data/dashboard-data";

interface ExploreClientProps {
  surveys: typeof mockSurveys;
}

export default function ExploreClient({ surveys }: ExploreClientProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("all");
  const [sort, setSort] = useState<string>("recent");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Filter, search, sort, and paginate
  const filtered = useMemo(() => {
    return surveys
      .filter(
        (s) =>
          s.status === "active" &&
          (type === "all" || s.type === type) &&
          (!search.trim() ||
            s.title.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => {
        if (sort === "recent") {
          return b.lastUpdated.localeCompare(a.lastUpdated);
        } else if (sort === "responses") {
          return b.responses - a.responses;
        } else if (sort === "alpha") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [surveys, search, type, sort]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8">
        <input
          type="text"
          placeholder="Search surveys..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full md:w-64 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        >
          <option value="all">All Types</option>
          <option value="commerce">Commerce</option>
          <option value="academia">Academia</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        >
          <option value="recent">Most Recent</option>
          <option value="responses">Most Responses</option>
          <option value="alpha">A-Z</option>
        </select>
      </div>
      {/* Survey Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginated.length > 0 ? (
          paginated.map((survey: (typeof surveys)[0]) => (
            <SurveyCard key={survey.id} {...survey} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">
            No surveys found.
          </div>
        )}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

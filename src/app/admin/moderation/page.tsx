"use client";

import React, { useState, useEffect } from "react";
import FilterSearchControls from "@/components/shared/FilterSearchControls";

interface Survey {
  id: string;
  title: string;
  description: string;
  creator: {
    name: string;
    email: string;
    avatar_initials: string;
  };
  status: "pending" | "approved" | "rejected" | "draft";
  category: "commerce" | "academia" | "research" | "marketing" | "other";
  questions: number;
  estimatedTime: string;
  submittedAt: string;
  lastModified: string;
  flags: string[];
  moderationNotes?: string;
}

export default function SurveyModerationPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("submittedAt");

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);

      // Simulate API call - replace with actual Supabase query
      const mockSurveys: Survey[] = [
        {
          id: "1",
          title: "Customer Satisfaction Survey 2024",
          description:
            "Comprehensive survey to understand customer satisfaction levels across our product line",
          creator: {
            name: "Sarah Johnson",
            email: "sarah.j@example.com",
            avatar_initials: "SJ",
          },
          status: "pending",
          category: "commerce",
          questions: 25,
          estimatedTime: "15 minutes",
          submittedAt: "2024-01-15T10:30:00Z",
          lastModified: "2024-01-15T10:30:00Z",
          flags: ["sensitive_content"],
        },
        {
          id: "2",
          title: "Academic Research: Student Learning Patterns",
          description:
            "Research survey to understand how students adapt to online learning environments",
          creator: {
            name: "Dr. Mike Chen",
            email: "mike.chen@university.edu",
            avatar_initials: "MC",
          },
          status: "approved",
          category: "academia",
          questions: 18,
          estimatedTime: "12 minutes",
          submittedAt: "2024-01-14T14:20:00Z",
          lastModified: "2024-01-14T16:45:00Z",
          flags: [],
        },
        {
          id: "3",
          title: "Market Research: Product Preferences",
          description:
            "Survey to gather insights on consumer preferences for new product development",
          creator: {
            name: "Lisa Wong",
            email: "lisa.wong@company.com",
            avatar_initials: "LW",
          },
          status: "rejected",
          category: "marketing",
          questions: 30,
          estimatedTime: "20 minutes",
          submittedAt: "2024-01-13T09:15:00Z",
          lastModified: "2024-01-13T11:30:00Z",
          flags: ["inappropriate_content", "spam"],
          moderationNotes:
            "Contains inappropriate questions about personal information",
        },
        {
          id: "4",
          title: "Employee Engagement Survey",
          description:
            "Internal survey to measure employee satisfaction and engagement levels",
          creator: {
            name: "David Kim",
            email: "david.kim@hr.com",
            avatar_initials: "DK",
          },
          status: "pending",
          category: "research",
          questions: 22,
          estimatedTime: "18 minutes",
          submittedAt: "2024-01-15T08:45:00Z",
          lastModified: "2024-01-15T08:45:00Z",
          flags: ["sensitive_content"],
        },
        {
          id: "5",
          title: "Technology Adoption Survey",
          description:
            "Survey to understand how organizations adopt new technologies",
          creator: {
            name: "Alex Rodriguez",
            email: "alex.r@tech.com",
            avatar_initials: "AR",
          },
          status: "approved",
          category: "research",
          questions: 15,
          estimatedTime: "10 minutes",
          submittedAt: "2024-01-12T16:30:00Z",
          lastModified: "2024-01-12T18:20:00Z",
          flags: [],
        },
        {
          id: "6",
          title: "Quick Feedback Form",
          description: "Simple feedback form for service improvement",
          creator: {
            name: "Emma Thompson",
            email: "emma.t@service.com",
            avatar_initials: "ET",
          },
          status: "draft",
          category: "commerce",
          questions: 8,
          estimatedTime: "5 minutes",
          submittedAt: "2024-01-15T12:00:00Z",
          lastModified: "2024-01-15T12:00:00Z",
          flags: [],
        },
      ];

      setSurveys(mockSurveys);
    } catch (error) {
      console.error("Error fetching surveys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSurvey = async (surveyId: string) => {
    try {
      // Update survey status in database
      // const { error } = await supabase
      //   .from('surveys')
      //   .update({ status: 'approved' })
      //   .eq('id', surveyId);

      // For now, just update local state
      setSurveys((prev) =>
        prev.map((survey) =>
          survey.id === surveyId
            ? { ...survey, status: "approved" as const }
            : survey
        )
      );
    } catch (error) {
      console.error("Error approving survey:", error);
    }
  };

  const handleRejectSurvey = async (surveyId: string, notes: string) => {
    try {
      // Update survey status in database
      // const { error } = await supabase
      //   .from('surveys')
      //   .update({ status: 'rejected', moderation_notes: notes })
      //   .eq('id', surveyId);

      // For now, just update local state
      setSurveys((prev) =>
        prev.map((survey) =>
          survey.id === surveyId
            ? { ...survey, status: "rejected" as const, moderationNotes: notes }
            : survey
        )
      );
    } catch (error) {
      console.error("Error rejecting survey:", error);
    }
  };

  const handleBulkApprove = async () => {
    try {
      //   const pendingSurveys = surveys.filter((s) => s.status === "pending");
      // Bulk update in database
      // const { error } = await supabase
      //   .from('surveys')
      //   .update({ status: 'approved' })
      //   .in('id', pendingSurveys.map(s => s.id));

      // For now, just update local state
      setSurveys((prev) =>
        prev.map((survey) =>
          survey.status === "pending"
            ? { ...survey, status: "approved" as const }
            : survey
        )
      );
    } catch (error) {
      console.error("Error bulk approving surveys:", error);
    }
  };

  const filteredSurveys = surveys.filter((survey) => {
    const matchesStatus =
      filterStatus === "all" || survey.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || survey.category === filterCategory;
    const matchesSearch =
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.creator.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const sortedSurveys = [...filteredSurveys].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "creator":
        return a.creator.name.localeCompare(b.creator.name);
      case "status":
        return a.status.localeCompare(b.status);
      case "submittedAt":
        return (
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
      case "questions":
        return b.questions - a.questions;
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      case "draft":
        return "gray";
      default:
        return "blue";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "commerce":
        return "blue";
      case "academia":
        return "purple";
      case "research":
        return "green";
      case "marketing":
        return "orange";
      case "other":
        return "gray";
      default:
        return "blue";
    }
  };

  const getGradientColor = (status: string) => {
    switch (status) {
      case "pending":
        return "from-yellow-500 to-orange-600";
      case "approved":
        return "from-green-500 to-emerald-600";
      case "rejected":
        return "from-red-500 to-pink-600";
      case "draft":
        return "from-gray-500 to-gray-600";
      default:
        return "from-blue-500 to-indigo-600";
    }
  };

  const getFlagColor = (flag: string) => {
    switch (flag) {
      case "sensitive_content":
        return "orange";
      case "inappropriate_content":
        return "red";
      case "spam":
        return "red";
      default:
        return "yellow";
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 py-8 px-2 sm:px-4 md:px-6">
        <div className="absolute inset-0 -z-20 animate-gradient-x bg-gradient-to-tr from-blue-800 via-indigo-900 to-blue-600 opacity-30 blur-2xl" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-blue-800 rounded mb-4"></div>
                <div className="h-4 bg-blue-800 rounded mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-blue-800 rounded-2xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pendingCount = surveys.filter((s) => s.status === "pending").length;
  const approvedCount = surveys.filter((s) => s.status === "approved").length;
  const rejectedCount = surveys.filter((s) => s.status === "rejected").length;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 py-8 px-2 sm:px-4 md:px-6">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-20 animate-gradient-x bg-gradient-to-tr from-blue-800 via-indigo-900 to-blue-600 opacity-30 blur-2xl" />

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Survey Moderation
            </h1>
            <p className="text-lg text-blue-200 mb-4">
              Review and approve surveys before publication
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleBulkApprove}
                disabled={pendingCount === 0}
                className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-300 transform hover:scale-105"
              >
                <h4 className="text-xl font-semibold mb-2">
                  Approve All Pending
                </h4>
                <p className="text-blue-100 text-sm">
                  Approve all pending surveys ({pendingCount})
                </p>
              </button>
              <button className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-semibold mb-2">
                  Moderation Guidelines
                </h4>
                <p className="text-green-100 text-sm">
                  View moderation policies and guidelines
                </p>
              </button>
              <button className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-semibold mb-2">
                  Moderation History
                </h4>
                <p className="text-purple-100 text-sm">
                  View moderation activity logs
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Moderation Statistics */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Moderation Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-yellow-900/50 p-6 rounded-2xl border border-yellow-800 text-center">
              <h3 className="text-xl font-semibold text-yellow-200 mb-2">
                Pending Review
              </h3>
              <p className="text-3xl font-bold text-yellow-300">
                {pendingCount}
              </p>
              <p className="text-sm text-yellow-300 mt-2">Awaiting approval</p>
            </div>
            <div className="bg-green-900/50 p-6 rounded-2xl border border-green-800 text-center">
              <h3 className="text-xl font-semibold text-green-200 mb-2">
                Approved
              </h3>
              <p className="text-3xl font-bold text-green-300">
                {approvedCount}
              </p>
              <p className="text-sm text-green-300 mt-2">Published surveys</p>
            </div>
            <div className="bg-red-900/50 p-6 rounded-2xl border border-red-800 text-center">
              <h3 className="text-xl font-semibold text-red-200 mb-2">
                Rejected
              </h3>
              <p className="text-3xl font-bold text-red-300">{rejectedCount}</p>
              <p className="text-sm text-red-300 mt-2">Violated guidelines</p>
            </div>
            <div className="bg-blue-900/50 p-6 rounded-2xl border border-blue-800 text-center">
              <h3 className="text-xl font-semibold text-blue-200 mb-2">
                Total Surveys
              </h3>
              <p className="text-3xl font-bold text-blue-300">
                {surveys.length}
              </p>
              <p className="text-sm text-blue-300 mt-2">In moderation queue</p>
            </div>
          </div>
        </div>

        {/* Survey Filters */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Filter & Search Surveys
          </h3>
          <FilterSearchControls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search surveys by title, description, or creator..."
            filters={[
              {
                label: "Status",
                value: filterStatus,
                options: [
                  { value: "all", label: "All Status" },
                  { value: "pending", label: "Pending Review" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                  { value: "draft", label: "Draft" },
                ],
                onChange: setFilterStatus,
              },
              {
                label: "Category",
                value: filterCategory,
                options: [
                  { value: "all", label: "All Categories" },
                  { value: "commerce", label: "Commerce" },
                  { value: "academia", label: "Academia" },
                  { value: "research", label: "Research" },
                  { value: "marketing", label: "Marketing" },
                  { value: "other", label: "Other" },
                ],
                onChange: setFilterCategory,
              },
            ]}
            sortOptions={[
              { value: "submittedAt", label: "Recently Submitted" },
              { value: "title", label: "Title A-Z" },
              { value: "creator", label: "Creator A-Z" },
              { value: "status", label: "Status A-Z" },
              { value: "questions", label: "Questions (High to Low)" },
            ]}
            sortValue={sortBy}
            onSortChange={setSortBy}
            variant="blue"
          />
        </div>

        {/* Survey Moderation */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Survey Moderation ({sortedSurveys.length} surveys)
          </h3>
          <div className="space-y-4">
            {sortedSurveys.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-blue-300 text-lg">
                  No surveys found matching your criteria.
                </p>
              </div>
            ) : (
              sortedSurveys.map((survey) => {
                const statusColor = getStatusColor(survey.status);
                const categoryColor = getCategoryColor(survey.category);
                const gradientColor = getGradientColor(survey.status);
                const submittedDate = new Date(survey.submittedAt);
                const timeAgo = getTimeAgo(submittedDate);

                return (
                  <div
                    key={survey.id}
                    className={`bg-${statusColor}-900/50 p-6 rounded-2xl border border-${statusColor}-800`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${gradientColor} rounded-full flex items-center justify-center`}
                        >
                          <span className="text-white font-semibold">
                            {survey.creator.avatar_initials}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`text-${statusColor}-200 font-semibold text-lg mb-2`}
                          >
                            {survey.title}
                          </h4>
                          <p className={`text-${statusColor}-300 text-sm mb-2`}>
                            {survey.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className={`text-${statusColor}-300`}>
                              By: {survey.creator.name}
                            </span>
                            <span className={`text-${statusColor}-300`}>
                              Submitted: {timeAgo}
                            </span>
                            <span className={`text-${statusColor}-300`}>
                              {survey.questions} questions
                            </span>
                            <span className={`text-${statusColor}-300`}>
                              {survey.estimatedTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {survey.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApproveSurvey(survey.id)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                const notes = prompt("Enter rejection reason:");
                                if (notes) handleRejectSurvey(survey.id, notes);
                              }}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          className={`px-4 py-2 bg-${statusColor}-600 hover:bg-${statusColor}-700 text-white rounded-lg transition-colors`}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className={`text-${statusColor}-300`}>
                          Status:
                        </span>
                        <span
                          className={`text-${statusColor}-200 ml-2 capitalize`}
                        >
                          {survey.status}
                        </span>
                      </div>
                      <div>
                        <span className={`text-${statusColor}-300`}>
                          Category:
                        </span>
                        <span
                          className={`text-${categoryColor}-200 ml-2 capitalize`}
                        >
                          {survey.category}
                        </span>
                      </div>
                      <div>
                        <span className={`text-${statusColor}-300`}>
                          Creator:
                        </span>
                        <span className={`text-${statusColor}-200 ml-2`}>
                          {survey.creator.email}
                        </span>
                      </div>
                      <div>
                        <span className={`text-${statusColor}-300`}>
                          Flags:
                        </span>
                        <span className={`text-${statusColor}-200 ml-2`}>
                          {survey.flags.length > 0
                            ? survey.flags.length
                            : "None"}
                        </span>
                      </div>
                    </div>
                    {survey.flags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {survey.flags.map((flag) => {
                          const flagColor = getFlagColor(flag);
                          return (
                            <span
                              key={flag}
                              className={`px-2 py-1 rounded-full text-xs bg-${flagColor}-800/50 text-${flagColor}-200 border border-${flagColor}-700 capitalize`}
                            >
                              {flag.replace("_", " ")}
                            </span>
                          );
                        })}
                      </div>
                    )}
                    {survey.moderationNotes && (
                      <div className="mt-3 p-3 bg-red-900/30 rounded-lg border border-red-800">
                        <p className="text-red-200 text-sm">
                          <span className="font-medium">Rejection Reason:</span>{" "}
                          {survey.moderationNotes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

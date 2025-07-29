"use client";
import { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import SurveyStatsCard from "@/components/dashboard/SurveyStatsCard";
import SurveyCard from "@/components/dashboard/SurveyCard";
import RecentActivityTable from "@/components/dashboard/RecentActivityTable";
import { Survey, ActivityItem } from "@/data/dashboard-data";
import Link from "next/link";

interface DashboardStats {
  activeSurveys: number;
  draftSurveys: number;
  totalResponses: number;
  avgCompletionRate: number;
}

interface UserProfile {
  id: string;
  first_name: string;
  last_name?: string;
  role?: string;
  email: string;
}

interface DashboardClientProps {
  userProfile: UserProfile;
  stats: DashboardStats;
  surveys: Survey[];
  activities: ActivityItem[];
  debugSession?: Record<string, unknown>;
}

export default function DashboardClient({
  userProfile,
  stats,
  surveys,
  activities,
  debugSession,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState("All Surveys");
  const { activeSurveys, draftSurveys, totalResponses, avgCompletionRate } =
    stats;
  const tabToStatus = {
    "All Surveys": null,
    Active: "active",
    Drafts: "draft",
    Closed: "closed",
  };
  const filteredSurveys =
    tabToStatus[activeTab as keyof typeof tabToStatus] == null
      ? surveys
      : surveys.filter(
          (s) => s.status === tabToStatus[activeTab as keyof typeof tabToStatus]
        );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 py-8 px-2 sm:px-4 md:px-6">
      {/* Glassmorphism Dashboard Card */}
      <div className="max-w-5xl mx-auto rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-6 md:p-10 mb-10 border border-blue-900">
        {/* Dashboard Header with Avatar and Welcome */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-0 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center shadow-lg border-2 border-blue-800">
              <UserCircleIcon className="w-10 h-10 text-white/90" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                Welcome, {userProfile?.first_name || "Researcher"}!
              </h1>
              <p className="mt-1 text-base sm:text-lg text-blue-100 font-medium drop-shadow-sm">
                Manage your surveys and analyze responses all in one place.
              </p>
            </div>
          </div>
          <div className="mt-2 md:mt-0 flex justify-end">
            <Link href="/surveyor">
              <button className="px-6 py-3 text-lg bg-gradient-to-r from-blue-700 to-indigo-900 text-blue-100 rounded-xl hover:from-blue-800 hover:to-indigo-950 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-bold border-2 border-blue-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Create New Survey
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Grid: glassmorphism cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <SurveyStatsCard
            title="Active Surveys"
            value={activeSurveys}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-blue-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                />
              </svg>
            }
          />
          <SurveyStatsCard
            title="Total Responses"
            value={totalResponses}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-blue-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                />
              </svg>
            }
          />
          <SurveyStatsCard
            title="Avg. Completion Rate"
            value={`${avgCompletionRate}%`}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-blue-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            }
          />
          <SurveyStatsCard
            title="Draft Surveys"
            value={draftSurveys}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-blue-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            }
          />
        </div>

        {/* Survey Tabs - modern pill style */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center md:justify-start">
          {Object.keys(tabToStatus).map((tab) => (
            <button
              key={tab}
              className={`px-5 py-2 rounded-full font-semibold text-base md:text-lg shadow transition-all border-2
              ${
                activeTab === tab
                  ? "bg-blue-800 text-blue-100 border-blue-800 scale-105"
                  : "bg-blue-900/60 text-blue-200 border-blue-800 hover:bg-blue-800/80"
              }
            `}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Survey Cards - glassmorphism, hover effect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredSurveys.length === 0 ? (
            <div className="col-span-full text-center text-blue-300/60 py-12 text-lg font-medium">
              No surveys found.
            </div>
          ) : (
            filteredSurveys.map((survey) => (
              <div
                key={survey.id}
                className="rounded-2xl bg-white/80 dark:bg-blue-950/80 shadow-lg border border-blue-100 dark:border-blue-900 hover:scale-[1.03] hover:shadow-2xl transition-transform duration-200"
              >
                <SurveyCard {...survey} isOwner={true} />
              </div>
            ))
          )}
        </div>

        {/* Recent Activity Table - glassmorphism */}
        <div className="mb-8 rounded-2xl bg-blue-950/80 shadow-lg border border-blue-900 overflow-x-auto">
          <RecentActivityTable activities={activities} />
        </div>

        {/* Debug session info (dev only) */}
        {debugSession && (
          <pre className="bg-blue-900 rounded p-4 text-xs overflow-x-auto mt-6 text-blue-100 font-mono">
            {JSON.stringify(debugSession, null, 2)}
          </pre>
        )}
        {/* Floating CTA for mobile */}
        <div className="fixed bottom-6 right-6 z-50 block md:hidden">
          <Link href="/surveyor">
            <button className="px-6 py-4 rounded-full bg-gradient-to-r from-blue-800 to-indigo-900 text-blue-100 font-bold shadow-xl flex items-center gap-2 border-2 border-blue-800 text-lg hover:scale-105 transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              New Survey
            </button>
          </Link>
        </div>
        {/* Close Glassmorphism Dashboard Card */}
      </div>
    </div>
  );
}

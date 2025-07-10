"use client";
import { useState } from "react";
import SurveyStatsCard from "@/components/dashboard/SurveyStatsCard";
import SurveyCard from "@/components/dashboard/SurveyCard";
// import SurveyTabs from "@/components/dashboard/SurveyTabs";
import RecentActivityTable from "@/components/dashboard/RecentActivityTable";
// import CreateSurveyCard from "@/components/dashboard/CreateSurveyCard";
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
    <div className="container mx-auto py-8 px-2 sm:px-4 md:px-6">
      {/* Dashboard Header with Welcome and Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Welcome, {userProfile?.first_name || "Researcher"}!
          </h1>
          <p className="text-gray-900 dark:text-gray-400 mt-1 text-base sm:text-lg">
            Manage your surveys and analyze responses all in one place.
          </p>
        </div>
        <div className="mt-2 md:mt-0">
          <Link href="/surveyor">
            <button className="px-5 py-3 text-base sm:text-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 w-full md:w-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
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

      {/* Stats Grid: 2x2 on mobile, 1x4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
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
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>
          }
          trend={
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
              Created 2 this month
            </>
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
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
              />
            </svg>
          }
          trend={
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
              Up 12% from last month
            </>
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
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          }
          trend={
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
              +2% this week
            </>
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
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          }
          trend={
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
              1 new draft
            </>
          }
        />
      </div>

      {/* Survey Tabs - add horizontal scroll on mobile */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <ul className="flex flex-nowrap -mb-px min-w-max">
          {Object.keys(tabToStatus).map((tab) => (
            <li className="mr-2" key={tab}>
              <button
                className={`inline-block p-3 sm:p-4 border-b-2 font-medium transition-colors text-base sm:text-lg min-w-[120px] text-center whitespace-nowrap
                  ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Survey Cards - stack vertically on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {filteredSurveys.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
            No surveys found.
          </div>
        ) : (
          filteredSurveys.map((survey) => (
            <SurveyCard key={survey.id} {...survey} isOwner={true} />
          ))
        )}
      </div>

      {/* Recent Activity Table - add horizontal scroll on mobile */}
      <div className="mb-8">
        <RecentActivityTable activities={activities} />
      </div>

      {/* Debug session info (dev only) */}
      {debugSession && (
        <pre className="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-x-auto">
          {JSON.stringify(debugSession, null, 2)}
        </pre>
      )}
    </div>
  );
}

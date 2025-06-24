"use client";
import { useState } from "react";
import SurveyStatsCard from "@/components/dashboard/SurveyStatsCard";
import SurveyCard from "@/components/dashboard/SurveyCard";
import SurveyTabs from "@/components/dashboard/SurveyTabs";
import RecentActivityTable from "@/components/dashboard/RecentActivityTable";
import CreateSurveyCard from "@/components/dashboard/CreateSurveyCard";
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
  const filteredSurveys =
    activeTab === "All Surveys"
      ? surveys
      : surveys.filter((s) => s.status === activeTab.toLowerCase());

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Dashboard Header with Welcome and Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Welcome, {userProfile?.first_name || "Researcher"}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your surveys and analyze responses all in one place.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/surveyor">
            <button className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
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

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
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
              className="w-5 h-5 text-blue-600 dark:text-blue-400"
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
              className="w-5 h-5 text-purple-600 dark:text-purple-400"
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
              className="w-5 h-5 text-green-600 dark:text-green-400"
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
                  d="m19.5 4.5-15 15m0 0h11.25m-11.25 0V8.25"
                />
              </svg>
              Down 3% from last month
            </>
          }
          trendColor="text-red-600 dark:text-red-400"
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
              className="w-5 h-5 text-amber-600 dark:text-amber-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          }
          trend={
            <>
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
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
              Complete this draft
            </>
          }
          trendColor="text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* Survey Management Tabs */}
      <SurveyTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Survey Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredSurveys.map((survey) => (
          <SurveyCard key={survey.id} {...survey} />
        ))}
        <CreateSurveyCard />
      </div>

      {/* Recent Activity Section */}
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <RecentActivityTable activities={activities} />

      {/* Debug Session (dev only) */}
      {debugSession && (
        <pre className="mt-8 p-4 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-x-auto text-gray-900 dark:text-white">
          {JSON.stringify(debugSession, null, 2)}
        </pre>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import FilterSearchControls from "@/components/shared/FilterSearchControls";

interface AnalyticsData {
  id: string;
  metric: string;
  value: number;
  change: number;
  changeType: "increase" | "decrease";
  period: string;
  category: "users" | "surveys" | "revenue" | "engagement";
  trend: "up" | "down" | "stable";
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("30days");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("value");

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Simulate API call - replace with actual Supabase query
      const mockData: AnalyticsData[] = [
        {
          id: "1",
          metric: "Total Users",
          value: 1247,
          change: 12,
          changeType: "increase",
          period: "30 days",
          category: "users",
          trend: "up",
        },
        {
          id: "2",
          metric: "Active Surveys",
          value: 89,
          change: 5,
          changeType: "increase",
          period: "7 days",
          category: "surveys",
          trend: "up",
        },
        {
          id: "3",
          metric: "Survey Responses",
          value: 15432,
          change: 8,
          changeType: "increase",
          period: "30 days",
          category: "engagement",
          trend: "up",
        },
        {
          id: "4",
          metric: "Revenue",
          value: 2450,
          change: 15,
          changeType: "increase",
          period: "30 days",
          category: "revenue",
          trend: "up",
        },
        {
          id: "5",
          metric: "User Retention",
          value: 78,
          change: 3,
          changeType: "decrease",
          period: "30 days",
          category: "users",
          trend: "down",
        },
        {
          id: "6",
          metric: "Survey Completion Rate",
          value: 92,
          change: 2,
          changeType: "increase",
          period: "30 days",
          category: "engagement",
          trend: "up",
        },
      ];

      setAnalyticsData(mockData);

      // Mock chart data
      setChartData({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Users",
            data: [800, 950, 1100, 1200, 1300, 1247],
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderColor: "rgba(59, 130, 246, 1)",
          },
          {
            label: "Revenue",
            data: [1200, 1400, 1600, 1800, 2200, 2450],
            backgroundColor: "rgba(34, 197, 94, 0.2)",
            borderColor: "rgba(34, 197, 94, 1)",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = analyticsData.filter((item) => {
    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;
    const matchesSearch = item.metric
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "value":
        return b.value - a.value;
      case "change":
        return b.change - a.change;
      case "name":
        return a.metric.localeCompare(b.metric);
      default:
        return 0;
    }
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "users":
        return "blue";
      case "surveys":
        return "purple";
      case "revenue":
        return "green";
      case "engagement":
        return "orange";
      default:
        return "gray";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      default:
        return "→";
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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 py-8 px-2 sm:px-4 md:px-6">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-20 animate-gradient-x bg-gradient-to-tr from-blue-800 via-indigo-900 to-blue-600 opacity-30 blur-2xl" />

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-blue-200 mb-4">
              Comprehensive platform analytics and insights
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-semibold mb-2">Export Report</h4>
                <p className="text-blue-100 text-sm">
                  Download detailed analytics report
                </p>
              </button>
              <button className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-semibold mb-2">
                  Generate Insights
                </h4>
                <p className="text-green-100 text-sm">
                  AI-powered analytics insights
                </p>
              </button>
              <button className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-semibold mb-2">Schedule Reports</h4>
                <p className="text-purple-100 text-sm">
                  Set up automated reporting
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Filters */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Filter & Search Analytics
          </h3>
          <FilterSearchControls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search metrics..."
            filters={[
              {
                label: "Category",
                value: filterCategory,
                options: [
                  { value: "all", label: "All Categories" },
                  { value: "users", label: "Users" },
                  { value: "surveys", label: "Surveys" },
                  { value: "revenue", label: "Revenue" },
                  { value: "engagement", label: "Engagement" },
                ],
                onChange: setFilterCategory,
              },
              {
                label: "Period",
                value: filterPeriod,
                options: [
                  { value: "7days", label: "Last 7 days" },
                  { value: "30days", label: "Last 30 days" },
                  { value: "90days", label: "Last 90 days" },
                  { value: "1year", label: "Last year" },
                ],
                onChange: setFilterPeriod,
              },
            ]}
            sortOptions={[
              { value: "value", label: "Value (High to Low)" },
              { value: "change", label: "Change (High to Low)" },
              { value: "name", label: "Name A-Z" },
            ]}
            sortValue={sortBy}
            onSortChange={setSortBy}
            variant="blue"
          />
        </div>

        {/* Analytics Overview */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Key Metrics Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedData.map((item) => {
              const categoryColor = getCategoryColor(item.category);
              const trendIcon = getTrendIcon(item.trend);
              const changeColor =
                item.changeType === "increase" ? "green" : "red";

              return (
                <div
                  key={item.id}
                  className={`bg-${categoryColor}-900/50 p-6 rounded-2xl border border-${categoryColor}-800`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`text-${categoryColor}-200 font-semibold text-lg`}
                    >
                      {item.metric}
                    </h3>
                    <span className={`text-${categoryColor}-300 text-2xl`}>
                      {trendIcon}
                    </span>
                  </div>
                  <div className="mb-4">
                    <p
                      className={`text-${categoryColor}-300 text-3xl font-bold`}
                    >
                      {item.value.toLocaleString()}
                    </p>
                    <p className={`text-${categoryColor}-300 text-sm`}>
                      {item.period}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-${changeColor}-300 text-sm font-medium`}
                    >
                      {item.changeType === "increase" ? "+" : "-"}
                      {item.change}%
                    </span>
                    <span
                      className={`text-${categoryColor}-300 text-xs capitalize`}
                    >
                      {item.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart Section */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Growth Trends
          </h3>
          {chartData ? (
            <div className="bg-blue-900/30 p-6 rounded-2xl border border-blue-800">
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-blue-300 text-lg mb-4">
                    📈 Chart Visualization
                  </div>
                  <p className="text-blue-400 text-sm">
                    Chart library integration would go here
                  </p>
                  <p className="text-blue-400 text-sm mt-2">
                    Showing {chartData.labels.length} data points
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-blue-300 text-lg">Loading chart data...</p>
            </div>
          )}
        </div>

        {/* Detailed Analytics */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Detailed Analytics ({sortedData.length} metrics)
          </h3>
          <div className="space-y-4">
            {sortedData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-blue-300 text-lg">
                  No metrics found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-blue-800">
                      <th className="pb-3 text-blue-200 font-semibold">
                        Metric
                      </th>
                      <th className="pb-3 text-blue-200 font-semibold">
                        Value
                      </th>
                      <th className="pb-3 text-blue-200 font-semibold">
                        Change
                      </th>
                      <th className="pb-3 text-blue-200 font-semibold">
                        Category
                      </th>
                      <th className="pb-3 text-blue-200 font-semibold">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((item) => {
                      const categoryColor = getCategoryColor(item.category);
                      const changeColor =
                        item.changeType === "increase" ? "green" : "red";
                      const trendIcon = getTrendIcon(item.trend);

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-blue-800/50"
                        >
                          <td className="py-3 text-blue-200 font-medium">
                            {item.metric}
                          </td>
                          <td className="py-3 text-blue-300">
                            {item.value.toLocaleString()}
                          </td>
                          <td
                            className={`py-3 text-${changeColor}-300 font-medium`}
                          >
                            {item.changeType === "increase" ? "+" : "-"}
                            {item.change}%
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs bg-${categoryColor}-900/50 text-${categoryColor}-300 border border-${categoryColor}-800 capitalize`}
                            >
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 text-blue-300">
                            <span className="text-lg">{trendIcon}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

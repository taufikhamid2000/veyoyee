import React from "react";

interface SurveyStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: React.ReactNode;
  trendColor?: string;
  className?: string;
}

export default function SurveyStatsCard({
  title,
  value,
  icon,
  trend,
  trendColor = "text-green-600 dark:text-green-400",
  className = "",
}: SurveyStatsCardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          {title}
        </h3>
        <span className="p-2 rounded-lg">{icon}</span>
      </div>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {trend && (
        <div className={`mt-2 flex items-center text-xs ${trendColor}`}>
          {trend}
        </div>
      )}
    </div>
  );
}

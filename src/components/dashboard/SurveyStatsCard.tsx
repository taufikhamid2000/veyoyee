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
}: SurveyStatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm px-4 py-3 flex items-center gap-3 min-h-[64px]">
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
          {title}
        </div>
        <div className="text-lg font-bold text-gray-900 dark:text-white truncate">
          {value}
        </div>
      </div>
      {/* Optionally show trend text on md+ screens only, and smaller */}
      {trend && (
        <div className="hidden md:block text-xs text-gray-400 dark:text-gray-500 ml-2 whitespace-nowrap">
          {trend}
        </div>
      )}
    </div>
  );
}

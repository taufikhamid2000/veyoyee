import React from "react";

interface SurveyTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ["All Surveys", "Active", "Drafts", "Closed"];

export default function SurveyTabs({
  activeTab,
  onTabChange,
}: SurveyTabsProps) {
  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px">
        {tabs.map((tab) => (
          <li className="mr-2" key={tab}>
            <button
              className={`inline-block p-4 border-b-2 font-medium transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

import React from "react";

export interface FilterOption {
  value: string;
  label: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterSearchControlsProps {
  // Search
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchPlaceholder?: string;
  
  // Filters
  filters?: {
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }[];
  
  // Sort
  sortOptions?: SortOption[];
  sortValue?: string;
  onSortChange?: (value: string) => void;
  
  // Additional controls
  additionalControls?: React.ReactNode;
  
  // Styling
  className?: string;
  variant?: "default" | "dark" | "blue";
}

export default function FilterSearchControls({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  sortOptions = [],
  sortValue,
  onSortChange,
  additionalControls,
  className = "",
  variant = "default",
}: FilterSearchControlsProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "dark":
        return {
          container: "bg-gray-800 border-gray-600",
          input: "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500",
          select: "bg-gray-800 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500",
          label: "text-gray-300",
        };
      case "blue":
        return {
          container: "bg-blue-950/80 border-blue-900",
          input: "bg-blue-900/50 border-blue-800 text-blue-200 placeholder-blue-400 focus:ring-blue-500 focus:border-blue-500",
          select: "bg-blue-900/50 border-blue-800 text-blue-200 focus:ring-blue-500 focus:border-blue-500",
          label: "text-blue-200",
        };
      default:
        return {
          container: "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",
          input: "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500",
          select: "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500",
          label: "text-gray-700 dark:text-gray-300",
        };
    }
  };

  const classes = getVariantClasses();

  return (
    <div className={`rounded-lg border p-4 ${classes.container} ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${classes.label}`}>
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm transition-colors ${classes.input}`}
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        {filters.map((filter, index) => (
          <div key={index}>
            <label className={`block text-sm font-medium mb-2 ${classes.label}`}>
              {filter.label}
            </label>
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className={`w-full p-2.5 border rounded-lg text-sm transition-colors ${classes.select}`}
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Sort Dropdown */}
        {sortOptions.length > 0 && onSortChange && (
          <div>
            <label className={`block text-sm font-medium mb-2 ${classes.label}`}>
              Sort
            </label>
            <select
              value={sortValue}
              onChange={(e) => onSortChange(e.target.value)}
              className={`w-full p-2.5 border rounded-lg text-sm transition-colors ${classes.select}`}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Additional Controls */}
        {additionalControls && (
          <div className="flex items-end">
            {additionalControls}
          </div>
        )}
      </div>
    </div>
  );
} 
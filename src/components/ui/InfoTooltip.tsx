import { ReactNode } from "react";

interface InfoTooltipProps {
  children: ReactNode;
  tooltip: ReactNode;
  className?: string;
}

export default function InfoTooltip({
  children,
  tooltip,
  className = "",
}: InfoTooltipProps) {
  return (
    <span className={`relative group ${className}`}>
      <button
        type="button"
        aria-label="Information"
        className="ml-1 w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 flex items-center justify-center text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
        tabIndex={0}
      >
        i
      </button>
      <span className="absolute left-1/2 z-10 mt-2 w-56 -translate-x-1/2 rounded bg-white dark:bg-gray-900 p-3 text-xs text-gray-700 dark:text-gray-200 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
        {tooltip}
      </span>
      {children}
    </span>
  );
}

"use client";

import { useToastStore } from "@/hooks/useToast";
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  const getToastIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getToastStyles = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-100 dark:border-green-700 dark:bg-green-900/80";
      case "error":
        return "border-red-200 bg-red-100 dark:border-red-700 dark:bg-red-900/80";
      case "warning":
        return "border-yellow-200 bg-yellow-100 dark:border-yellow-700 dark:bg-yellow-900/80";
      case "info":
        return "border-blue-200 bg-blue-100 dark:border-blue-700 dark:bg-blue-900/80";
      default:
        return "border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800/90";
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            min-w-[300px] max-w-[400px] p-4 rounded-lg border shadow-xl backdrop-blur-sm
            transition-all duration-300 ease-in-out
            animate-slide-down
            ${getToastStyles(toast.type)}
          `}
        >
          <div className="flex items-start gap-3">
            {getToastIcon(toast.type)}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

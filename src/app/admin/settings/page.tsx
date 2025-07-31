"use client";

import React, { useState, useEffect } from "react";
import FilterSearchControls from "@/components/shared/FilterSearchControls";

interface SystemSetting {
  id: string;
  category:
    | "general"
    | "security"
    | "email"
    | "payment"
    | "notifications"
    | "advanced";
  name: string;
  description: string;
  value: string | number | boolean;
  type: "text" | "number" | "boolean" | "select" | "textarea";
  options?: string[];
  lastModified: string;
  modifiedBy: string;
  isRequired: boolean;
  validation?: string;
}

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("category");

  useEffect(() => {
    fetchSystemSettings();
  }, []);

  const fetchSystemSettings = async () => {
    try {
      setLoading(true);

      // Simulate API call - replace with actual Supabase query
      const mockSettings: SystemSetting[] = [
        {
          id: "1",
          category: "general",
          name: "Site Name",
          description: "The name of your survey platform",
          value: "Veyoyee",
          type: "text",
          lastModified: "2024-01-15T10:30:00Z",
          modifiedBy: "admin@veyoyee.com",
          isRequired: true,
        },
        {
          id: "2",
          category: "general",
          name: "Site Description",
          description: "Brief description of your platform",
          value:
            "Advanced survey and research platform for data collection and analysis",
          type: "textarea",
          lastModified: "2024-01-15T10:30:00Z",
          modifiedBy: "admin@veyoyee.com",
          isRequired: false,
        },
        {
          id: "3",
          category: "general",
          name: "Maintenance Mode",
          description: "Enable maintenance mode to restrict access",
          value: false,
          type: "boolean",
          lastModified: "2024-01-14T14:20:00Z",
          modifiedBy: "admin@veyoyee.com",
          isRequired: false,
        },
        {
          id: "4",
          category: "security",
          name: "Password Minimum Length",
          description: "Minimum length required for user passwords",
          value: 8,
          type: "number",
          lastModified: "2024-01-13T09:15:00Z",
          modifiedBy: "admin@veyoyee.com",
          isRequired: true,
          validation: "min:6,max:20",
        },
        {
          id: "5",
          category: "security",
          name: "Session Timeout",
          description: "User session timeout in minutes",
          value: 30,
          type: "number",
          lastModified: "2024-01-13T09:15:00Z",
          modifiedBy: "admin@veyoyee.com",
          isRequired: true,
          validation: "min:5,max:480",
        },
        {
          id: "6",
          category: "security",
          name: "Two-Factor Authentication",
          description: "Require 2FA for all users",
          value: true,
          type: "boolean",
          lastModified: "2024-01-12T16:30:00Z",
          modifiedBy: "admin@veyoyee.com",
          isRequired: false,
        },
        {
          id: "7",
          category: "email",
          name: "SMTP Host",
          description: "SMTP server hostname for email notifications",
          value: "smtp.gmail.com",
          type: "text",
          lastModified: "2024-01-12T16:30:00Z",
          modifiedBy: "admin@veyoyee.com",
          isRequired: true,
        },
        {
          id: "8",
          category: "email",
          name: "SMTP Port",
          description: "SMTP server port",
          value: 587,
          type: "number",
          lastModified: "2024-01-12T16:30:00Z",
          modifiedBy: "admin@veyoyee.com",
          isRequired: true,
          validation: "min:1,max:65535",
        },
        {
          id: "9",
          category: "email",
          name: "Email Encryption",
          description: "Type of email encryption to use",
          value: "tls",
          type: "select",
          options: ["none", "ssl", "tls"],
          lastModified: "2024-01-12T16:30:00Z",
          modifiedBy: "admin@veyoyee.com",
          isRequired: true,
        },
        {
          id: "10",
          category: "payment",
          name: "Currency",
          description: "Default currency for payments",
          value: "RM",
          type: "select",
          options: ["RM", "USD", "EUR", "SGD"],
          lastModified: "2024-01-11T12:00:00Z",
          modifiedBy: "admin@veyoyee.com",
          isRequired: true,
        },
        {
          id: "11",
          category: "payment",
          name: "Payment Gateway",
          description: "Primary payment gateway",
          value: "stripe",
          type: "select",
          options: ["stripe", "paypal", "razorpay"],
          lastModified: "2024-01-11T12:00:00Z",
          modifiedBy: "admin@veyoyee.com",
          isRequired: true,
        },
        {
          id: "12",
          category: "notifications",
          name: "Email Notifications",
          description: "Enable email notifications for users",
          value: true,
          type: "boolean",
          lastModified: "2024-01-10T08:45:00Z",
          modifiedBy: "admin@veyoyee.com",
          isRequired: false,
        },
        {
          id: "13",
          category: "notifications",
          name: "Push Notifications",
          description: "Enable push notifications",
          value: false,
          type: "boolean",
          lastModified: "2024-01-10T08:45:00Z",
          modifiedBy: "admin@veyoyee.com",
          isRequired: false,
        },
        {
          id: "14",
          category: "advanced",
          name: "API Rate Limit",
          description: "API requests per minute per user",
          value: 100,
          type: "number",
          lastModified: "2024-01-09T15:20:00Z",
          modifiedBy: "admin@veyoyee.com",
          isRequired: true,
          validation: "min:10,max:1000",
        },
        {
          id: "15",
          category: "advanced",
          name: "Log Level",
          description: "System logging level",
          value: "info",
          type: "select",
          options: ["debug", "info", "warn", "error"],
          lastModified: "2024-01-09T15:20:00Z",
          modifiedBy: "admin@veyoyee.com",
          isRequired: true,
        },
      ];

      setSettings(mockSettings);
    } catch (error) {
      console.error("Error fetching system settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (
    settingId: string,
    newValue: string | number | boolean
  ) => {
    try {
      // Update setting in database
      // const { error } = await supabase
      //   .from('system_settings')
      //   .update({ value: newValue, last_modified: new Date().toISOString() })
      //   .eq('id', settingId);

      // For now, just update local state
      setSettings((prev) =>
        prev.map((setting) =>
          setting.id === settingId
            ? {
                ...setting,
                value: newValue,
                lastModified: new Date().toISOString(),
              }
            : setting
        )
      );
    } catch (error) {
      console.error("Error updating setting:", error);
    }
  };

  const handleBulkReset = async () => {
    try {
      // Reset all settings to default values
      // const { error } = await supabase
      //   .from('system_settings')
      //   .update({ value: default_value, last_modified: new Date().toISOString() });

      // For now, just reload settings
      fetchSystemSettings();
    } catch (error) {
      console.error("Error resetting settings:", error);
    }
  };

  const filteredSettings = settings.filter((setting) => {
    const matchesCategory =
      filterCategory === "all" || setting.category === filterCategory;
    const matchesSearch =
      setting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setting.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedSettings = [...filteredSettings].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "category":
        return a.category.localeCompare(b.category);
      case "lastModified":
        return (
          new Date(b.lastModified).getTime() -
          new Date(a.lastModified).getTime()
        );
      default:
        return 0;
    }
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "general":
        return "blue";
      case "security":
        return "red";
      case "email":
        return "green";
      case "payment":
        return "purple";
      case "notifications":
        return "orange";
      case "advanced":
        return "gray";
      default:
        return "blue";
    }
  };

  const getGradientColor = (category: string) => {
    switch (category) {
      case "general":
        return "from-blue-500 to-indigo-600";
      case "security":
        return "from-red-500 to-pink-600";
      case "email":
        return "from-green-500 to-emerald-600";
      case "payment":
        return "from-purple-500 to-indigo-600";
      case "notifications":
        return "from-orange-500 to-red-600";
      case "advanced":
        return "from-gray-500 to-gray-600";
      default:
        return "from-blue-500 to-indigo-600";
    }
  };

  const renderSettingValue = (setting: SystemSetting) => {
    switch (setting.type) {
      case "boolean":
        return (
          <select
            value={setting.value.toString()}
            onChange={(e) =>
              handleSettingChange(setting.id, e.target.value === "true")
            }
            className={`px-3 py-2 bg-${getCategoryColor(
              setting.category
            )}-800/50 border border-${getCategoryColor(
              setting.category
            )}-700 rounded-lg text-${getCategoryColor(
              setting.category
            )}-200 text-sm`}
          >
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        );
      case "select":
        return (
          <select
            value={setting.value.toString()}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className={`px-3 py-2 bg-${getCategoryColor(
              setting.category
            )}-800/50 border border-${getCategoryColor(
              setting.category
            )}-700 rounded-lg text-${getCategoryColor(
              setting.category
            )}-200 text-sm`}
          >
            {setting.options?.map((option) => (
              <option key={option} value={option}>
                {option.toUpperCase()}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return (
          <textarea
            value={setting.value.toString()}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 bg-${getCategoryColor(
              setting.category
            )}-800/50 border border-${getCategoryColor(
              setting.category
            )}-700 rounded-lg text-${getCategoryColor(
              setting.category
            )}-200 text-sm`}
          />
        );
      default:
        return (
          <input
            type={setting.type}
            value={setting.value.toString()}
            onChange={(e) =>
              handleSettingChange(
                setting.id,
                setting.type === "number"
                  ? Number(e.target.value)
                  : e.target.value
              )
            }
            className={`w-full px-3 py-2 bg-${getCategoryColor(
              setting.category
            )}-800/50 border border-${getCategoryColor(
              setting.category
            )}-700 rounded-lg text-${getCategoryColor(
              setting.category
            )}-200 text-sm`}
          />
        );
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

  const categoryCounts = settings.reduce((acc, setting) => {
    acc[setting.category] = (acc[setting.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 py-8 px-2 sm:px-4 md:px-6">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-20 animate-gradient-x bg-gradient-to-tr from-blue-800 via-indigo-900 to-blue-600 opacity-30 blur-2xl" />

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              System Settings
            </h1>
            <p className="text-lg text-blue-200 mb-4">
              Configure platform settings and preferences
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleBulkReset}
                className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105"
              >
                <h4 className="text-xl font-semibold mb-2">
                  Reset to Defaults
                </h4>
                <p className="text-blue-100 text-sm">
                  Reset all settings to default values
                </p>
              </button>
              <button className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-semibold mb-2">Export Settings</h4>
                <p className="text-green-100 text-sm">
                  Export current configuration
                </p>
              </button>
              <button className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-semibold mb-2">Import Settings</h4>
                <p className="text-purple-100 text-sm">
                  Import configuration from file
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Settings Statistics */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Settings Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(categoryCounts).map(([category, count]) => {
              const categoryColor = getCategoryColor(category);
              return (
                <div
                  key={category}
                  className={`bg-${categoryColor}-900/50 p-6 rounded-2xl border border-${categoryColor}-800 text-center`}
                >
                  <h3
                    className={`text-xl font-semibold text-${categoryColor}-200 mb-2 capitalize`}
                  >
                    {category.replace("_", " ")}
                  </h3>
                  <p className={`text-3xl font-bold text-${categoryColor}-300`}>
                    {count}
                  </p>
                  <p className={`text-sm text-${categoryColor}-300 mt-2`}>
                    Settings
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settings Filters */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Filter & Search Settings
          </h3>
          <FilterSearchControls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search settings by name or description..."
            filters={[
              {
                label: "Category",
                value: filterCategory,
                options: [
                  { value: "all", label: "All Categories" },
                  { value: "general", label: "General" },
                  { value: "security", label: "Security" },
                  { value: "email", label: "Email" },
                  { value: "payment", label: "Payment" },
                  { value: "notifications", label: "Notifications" },
                  { value: "advanced", label: "Advanced" },
                ],
                onChange: setFilterCategory,
              },
            ]}
            sortOptions={[
              { value: "category", label: "Category A-Z" },
              { value: "name", label: "Name A-Z" },
              { value: "lastModified", label: "Recently Modified" },
            ]}
            sortValue={sortBy}
            onSortChange={setSortBy}
            variant="blue"
          />
        </div>

        {/* System Settings */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            System Configuration ({sortedSettings.length} settings)
          </h3>
          <div className="space-y-6">
            {sortedSettings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-blue-300 text-lg">
                  No settings found matching your criteria.
                </p>
              </div>
            ) : (
              sortedSettings.map((setting) => {
                const categoryColor = getCategoryColor(setting.category);
                const gradientColor = getGradientColor(setting.category);
                const lastModifiedDate = new Date(setting.lastModified);
                const timeAgo = getTimeAgo(lastModifiedDate);

                return (
                  <div
                    key={setting.id}
                    className={`bg-${categoryColor}-900/50 p-6 rounded-2xl border border-${categoryColor}-800`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${gradientColor} rounded-full flex items-center justify-center`}
                        >
                          <span className="text-white font-semibold">
                            {setting.category.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4
                              className={`text-${categoryColor}-200 font-semibold text-lg`}
                            >
                              {setting.name}
                            </h4>
                            {setting.isRequired && (
                              <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                                Required
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-${categoryColor}-300 text-sm mb-2`}
                          >
                            {setting.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className={`text-${categoryColor}-300`}>
                              Type: {setting.type}
                            </span>
                            <span className={`text-${categoryColor}-300`}>
                              Modified: {timeAgo}
                            </span>
                            <span className={`text-${categoryColor}-300`}>
                              By: {setting.modifiedBy}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label
                          className={`block text-sm font-medium text-${categoryColor}-200 mb-2`}
                        >
                          Value:
                        </label>
                        {renderSettingValue(setting)}
                      </div>
                      {setting.validation && (
                        <div className="text-xs text-gray-400">
                          Validation: {setting.validation}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

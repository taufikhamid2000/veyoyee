import React from "react";

export default function AdminPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 py-8 px-2 sm:px-4 md:px-6">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-20 animate-gradient-x bg-gradient-to-tr from-blue-800 via-indigo-900 to-blue-600 opacity-30 blur-2xl" />

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-semibold mb-2">Export Data</h4>
                <p className="text-blue-100 text-sm">
                  Download platform statistics
                </p>
              </button>
              <button className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-semibold mb-2">
                  Send Notification
                </h4>
                <p className="text-green-100 text-sm">
                  Broadcast message to users
                </p>
              </button>
              <button className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-semibold mb-2">Backup System</h4>
                <p className="text-purple-100 text-sm">Create system backup</p>
              </button>
            </div>
          </div>
        </div>

        {/* Admin Stats Overview */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-green-900/50 p-6 rounded-2xl border border-green-800 text-center">
              <h3 className="text-xl font-semibold text-green-200 mb-2">
                Total Users
              </h3>
              <p className="text-3xl font-bold text-green-300">1,247</p>
              <p className="text-sm text-green-300 mt-2">+12% this month</p>
            </div>
            <div className="bg-blue-900/50 p-6 rounded-2xl border border-blue-800 text-center">
              <h3 className="text-xl font-semibold text-blue-200 mb-2">
                Active Surveys
              </h3>
              <p className="text-3xl font-bold text-blue-300">89</p>
              <p className="text-sm text-blue-300 mt-2">+5 this week</p>
            </div>
            <div className="bg-purple-900/50 p-6 rounded-2xl border border-purple-800 text-center">
              <h3 className="text-xl font-semibold text-purple-200 mb-2">
                Total Responses
              </h3>
              <p className="text-3xl font-bold text-purple-300">15,432</p>
              <p className="text-sm text-purple-300 mt-2">+8% this month</p>
            </div>
            <div className="bg-orange-900/50 p-6 rounded-2xl border border-orange-800 text-center">
              <h3 className="text-xl font-semibold text-orange-200 mb-2">
                Revenue
              </h3>
              <p className="text-3xl font-bold text-orange-300">RM2,450</p>
              <p className="text-sm text-orange-300 mt-2">+15% this month</p>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Management */}
          <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 border border-blue-900">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              User Management
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-900/50 p-4 rounded-2xl border border-blue-800">
                <h4 className="font-semibold text-blue-200 mb-2">
                  User Analytics
                </h4>
                <p className="text-blue-300 text-sm mb-3">
                  View detailed user statistics and behavior patterns
                </p>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  View Analytics
                </button>
              </div>
              <div className="bg-green-900/50 p-4 rounded-2xl border border-green-800">
                <h4 className="font-semibold text-green-200 mb-2">
                  User Verification
                </h4>
                <p className="text-green-300 text-sm mb-3">
                  Manage user verification status and approvals
                </p>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  Manage Users
                </button>
              </div>
              <div className="bg-purple-900/50 p-4 rounded-2xl border border-purple-800">
                <h4 className="font-semibold text-purple-200 mb-2">
                  Role Management
                </h4>
                <p className="text-purple-300 text-sm mb-3">
                  Assign and manage user roles and permissions
                </p>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  Manage Roles
                </button>
              </div>
            </div>
          </div>

          {/* Content Management */}
          <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 border border-blue-900">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Content Management
            </h3>
            <div className="space-y-4">
              <div className="bg-orange-900/50 p-4 rounded-2xl border border-orange-800">
                <h4 className="font-semibold text-orange-200 mb-2">
                  Survey Moderation
                </h4>
                <p className="text-orange-300 text-sm mb-3">
                  Review and approve surveys before publication
                </p>
                <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
                  Review Surveys
                </button>
              </div>
              <div className="bg-teal-900/50 p-4 rounded-2xl border border-teal-800">
                <h4 className="font-semibold text-teal-200 mb-2">
                  Marketplace Management
                </h4>
                <p className="text-teal-300 text-sm mb-3">
                  Manage marketplace listings and transactions
                </p>
                <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors">
                  Manage Marketplace
                </button>
              </div>
              <div className="bg-indigo-900/50 p-4 rounded-2xl border border-indigo-800">
                <h4 className="font-semibold text-indigo-200 mb-2">
                  System Settings
                </h4>
                <p className="text-indigo-300 text-sm mb-3">
                  Configure platform settings and preferences
                </p>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                  System Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  avatar_initials: string;
}

interface VerificationStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export default function UserVerificationPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<VerificationStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Simulate API call - replace with actual Supabase query
      const mockUsers: User[] = [
        {
          id: "1",
          email: "john.doe@example.com",
          name: "John Doe",
          phone: "+60 12-345-6789",
          location: "Kuala Lumpur, Malaysia",
          status: "pending",
          submitted_at: "2024-01-15T10:30:00Z",
          avatar_initials: "JD",
        },
        {
          id: "2",
          email: "sarah.j@example.com",
          name: "Sarah Johnson",
          phone: "+60 12-987-6543",
          location: "Penang, Malaysia",
          status: "pending",
          submitted_at: "2024-01-15T08:45:00Z",
          avatar_initials: "SJ",
        },
        {
          id: "3",
          email: "mike.chen@example.com",
          name: "Mike Chen",
          phone: "+60 12-456-7890",
          location: "Johor Bahru, Malaysia",
          status: "pending",
          submitted_at: "2024-01-15T06:20:00Z",
          avatar_initials: "MC",
        },
      ];

      setUsers(mockUsers);

      // Calculate stats
      const pending = mockUsers.filter((u) => u.status === "pending").length;
      const approved = 1156; // Mock data
      const rejected = 12; // Mock data
      const total = 1247; // Mock data

      setStats({ pending, approved, rejected, total });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      // Update user status in database
      // const { error } = await supabase
      //   .from('users')
      //   .update({ status: 'approved' })
      //   .eq('id', userId);

      // For now, just update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: "approved" as const } : user
        )
      );

      // Update stats
      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1,
      }));
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      // Update user status in database
      // const { error } = await supabase
      //   .from('users')
      //   .update({ status: 'rejected' })
      //   .eq('id', userId);

      // For now, just update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: "rejected" as const } : user
        )
      );

      // Update stats
      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        rejected: prev.rejected + 1,
      }));
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  const handleBulkApprove = async () => {
    try {
      // Bulk update in database
      // const { error } = await supabase
      //   .from('users')
      //   .update({ status: 'approved' })
      //   .in('id', pendingUsers.map(u => u.id));

      // For now, just update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.status === "pending"
            ? { ...user, status: "approved" as const }
            : user
        )
      );

      // Update stats
      setStats((prev) => ({
        ...prev,
        approved: prev.approved + prev.pending,
        pending: 0,
      }));
    } catch (error) {
      console.error("Error bulk approving users:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "blue";
    }
  };

  const getGradientColor = (status: string) => {
    switch (status) {
      case "pending":
        return "from-yellow-500 to-orange-600";
      case "approved":
        return "from-green-500 to-emerald-600";
      case "rejected":
        return "from-red-500 to-pink-600";
      default:
        return "from-blue-500 to-indigo-600";
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 py-8 px-2 sm:px-4 md:px-6">
        <div className="absolute inset-0 -z-20 animate-gradient-x bg-gradient-to-tr from-blue-800 via-indigo-900 to-blue-600 opacity-30 blur-2xl" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 border border-blue-900">
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
              User Verification
            </h1>
            <p className="text-lg text-blue-200 mb-4">
              Review and approve user verification requests
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleBulkApprove}
                disabled={stats.pending === 0}
                className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-300 transform hover:scale-105"
              >
                <h4 className="text-xl font-semibold mb-2">Approve All</h4>
                <p className="text-blue-100 text-sm">
                  Approve all pending verifications ({stats.pending})
                </p>
              </button>
              <button className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-semibold mb-2">Export Data</h4>
                <p className="text-green-100 text-sm">
                  Download verification reports
                </p>
              </button>
              <button className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-semibold mb-2">Settings</h4>
                <p className="text-purple-100 text-sm">
                  Configure verification rules
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Verification Stats */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Verification Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-yellow-900/50 p-6 rounded-2xl border border-yellow-800 text-center">
              <h3 className="text-xl font-semibold text-yellow-200 mb-2">
                Pending
              </h3>
              <p className="text-3xl font-bold text-yellow-300">
                {stats.pending}
              </p>
              <p className="text-sm text-yellow-300 mt-2">Awaiting review</p>
            </div>
            <div className="bg-green-900/50 p-6 rounded-2xl border border-green-800 text-center">
              <h3 className="text-xl font-semibold text-green-200 mb-2">
                Approved
              </h3>
              <p className="text-3xl font-bold text-green-300">
                {stats.approved}
              </p>
              <p className="text-sm text-green-300 mt-2">This month</p>
            </div>
            <div className="bg-red-900/50 p-6 rounded-2xl border border-red-800 text-center">
              <h3 className="text-xl font-semibold text-red-200 mb-2">
                Rejected
              </h3>
              <p className="text-3xl font-bold text-red-300">
                {stats.rejected}
              </p>
              <p className="text-sm text-red-300 mt-2">This month</p>
            </div>
            <div className="bg-blue-900/50 p-6 rounded-2xl border border-blue-800 text-center">
              <h3 className="text-xl font-semibold text-blue-200 mb-2">
                Total Users
              </h3>
              <p className="text-3xl font-bold text-blue-300">{stats.total}</p>
              <p className="text-sm text-blue-300 mt-2">Verified users</p>
            </div>
          </div>
        </div>

        {/* Verification Filters */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Filter & Search
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-3 bg-blue-900/50 border border-blue-800 rounded-lg text-blue-200"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Date Range
              </label>
              <select className="w-full p-3 bg-blue-900/50 border border-blue-800 rounded-lg text-blue-200">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Custom range</option>
              </select>
            </div>
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Location
              </label>
              <select className="w-full p-3 bg-blue-900/50 border border-blue-800 rounded-lg text-blue-200">
                <option>All Locations</option>
                <option>Kuala Lumpur</option>
                <option>Penang</option>
                <option>Johor Bahru</option>
              </select>
            </div>
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full p-3 bg-blue-900/50 border border-blue-800 rounded-lg text-blue-200 placeholder-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            User Verifications ({filteredUsers.length})
          </h3>
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-blue-300 text-lg">
                  No users found matching your criteria.
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const statusColor = getStatusColor(user.status);
                const gradientColor = getGradientColor(user.status);
                const submittedDate = new Date(user.submitted_at);
                const timeAgo = getTimeAgo(submittedDate);

                return (
                  <div
                    key={user.id}
                    className={`bg-${statusColor}-900/50 p-6 rounded-2xl border border-${statusColor}-800`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${gradientColor} rounded-full flex items-center justify-center`}
                        >
                          <span className="text-white font-semibold">
                            {user.avatar_initials}
                          </span>
                        </div>
                        <div>
                          <h4
                            className={`text-${statusColor}-200 font-semibold`}
                          >
                            {user.name}
                          </h4>
                          <p className={`text-${statusColor}-300 text-sm`}>
                            {user.email}
                          </p>
                          <p className={`text-${statusColor}-300 text-sm`}>
                            Submitted: {timeAgo}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {user.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApproveUser(user.id)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectUser(user.id)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          className={`px-4 py-2 bg-${statusColor}-600 hover:bg-${statusColor}-700 text-white rounded-lg transition-colors`}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className={`text-${statusColor}-300`}>
                          Phone:
                        </span>
                        <span className={`text-${statusColor}-200 ml-2`}>
                          {user.phone}
                        </span>
                      </div>
                      <div>
                        <span className={`text-${statusColor}-300`}>
                          Location:
                        </span>
                        <span className={`text-${statusColor}-200 ml-2`}>
                          {user.location}
                        </span>
                      </div>
                      <div>
                        <span className={`text-${statusColor}-300`}>
                          Status:
                        </span>
                        <span
                          className={`text-${
                            statusColor === "yellow" ? "yellow" : statusColor
                          }-300 ml-2 capitalize`}
                        >
                          {user.status}
                        </span>
                      </div>
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

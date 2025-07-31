"use client";

import React, { useState, useEffect } from "react";
import FilterSearchControls from "@/components/shared/FilterSearchControls";

interface User {
  id: string;
  email: string;
  name: string;
  currentRole: string;
  previousRole?: string;
  lastActive: string;
  avatar_initials: string;
  status: "active" | "inactive" | "suspended";
  permissions: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isDefault: boolean;
  createdAt: string;
}

export default function RoleManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Simulate API call - replace with actual Supabase query
      const mockUsers: User[] = [
        {
          id: "1",
          email: "john.doe@example.com",
          name: "John Doe",
          currentRole: "admin",
          previousRole: "moderator",
          lastActive: "2024-01-15T10:30:00Z",
          avatar_initials: "JD",
          status: "active",
          permissions: ["manage_users", "manage_surveys", "view_analytics"],
        },
        {
          id: "2",
          email: "sarah.j@example.com",
          name: "Sarah Johnson",
          currentRole: "moderator",
          lastActive: "2024-01-15T08:45:00Z",
          avatar_initials: "SJ",
          status: "active",
          permissions: ["manage_surveys", "view_analytics"],
        },
        {
          id: "3",
          email: "mike.chen@example.com",
          name: "Mike Chen",
          currentRole: "user",
          lastActive: "2024-01-15T06:20:00Z",
          avatar_initials: "MC",
          status: "active",
          permissions: ["create_surveys", "view_own_data"],
        },
        {
          id: "4",
          email: "lisa.wong@example.com",
          name: "Lisa Wong",
          currentRole: "moderator",
          lastActive: "2024-01-14T15:20:00Z",
          avatar_initials: "LW",
          status: "inactive",
          permissions: ["manage_surveys", "view_analytics"],
        },
        {
          id: "5",
          email: "david.kim@example.com",
          name: "David Kim",
          currentRole: "user",
          lastActive: "2024-01-13T12:10:00Z",
          avatar_initials: "DK",
          status: "suspended",
          permissions: ["create_surveys"],
        },
      ];

      const mockRoles: Role[] = [
        {
          id: "1",
          name: "admin",
          description: "Full system administrator with all permissions",
          permissions: [
            "manage_users",
            "manage_surveys",
            "view_analytics",
            "manage_roles",
            "system_settings",
          ],
          userCount: 2,
          isDefault: false,
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          name: "moderator",
          description: "Can manage surveys and view analytics",
          permissions: ["manage_surveys", "view_analytics", "moderate_content"],
          userCount: 3,
          isDefault: false,
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "3",
          name: "user",
          description: "Standard user with basic permissions",
          permissions: [
            "create_surveys",
            "view_own_data",
            "participate_surveys",
          ],
          userCount: 1242,
          isDefault: true,
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "4",
          name: "premium_user",
          description: "Premium user with enhanced features",
          permissions: [
            "create_surveys",
            "view_own_data",
            "participate_surveys",
            "advanced_analytics",
          ],
          userCount: 156,
          isDefault: false,
          createdAt: "2024-01-01T00:00:00Z",
        },
      ];

      setUsers(mockUsers);
      setRoles(mockRoles);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // Update user role in database
      // const { error } = await supabase
      //   .from('users')
      //   .update({ role: newRole })
      //   .eq('id', userId);

      // For now, just update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, previousRole: user.currentRole, currentRole: newRole }
            : user
        )
      );
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleUserStatusChange = async (userId: string, newStatus: string) => {
    try {
      // Update user status in database
      // const { error } = await supabase
      //   .from('users')
      //   .update({ status: newStatus })
      //   .eq('id', userId);

      // For now, just update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: newStatus as any } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole === "all" || user.currentRole === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "role":
        return a.currentRole.localeCompare(b.currentRole);
      case "status":
        return a.status.localeCompare(b.status);
      case "lastActive":
        return (
          new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
        );
      default:
        return 0;
    }
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "red";
      case "moderator":
        return "purple";
      case "premium_user":
        return "yellow";
      case "user":
        return "blue";
      default:
        return "gray";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "yellow";
      case "suspended":
        return "red";
      default:
        return "gray";
    }
  };

  const getGradientColor = (role: string) => {
    switch (role) {
      case "admin":
        return "from-red-500 to-pink-600";
      case "moderator":
        return "from-purple-500 to-indigo-600";
      case "premium_user":
        return "from-yellow-500 to-orange-600";
      case "user":
        return "from-blue-500 to-indigo-600";
      default:
        return "from-gray-500 to-gray-600";
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
              Role Management
            </h1>
            <p className="text-lg text-blue-200 mb-4">
              Manage user roles, permissions, and access levels
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-semibold mb-2">Create Role</h4>
                <p className="text-blue-100 text-sm">Create new custom roles</p>
              </button>
              <button className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-semibold mb-2">Bulk Actions</h4>
                <p className="text-green-100 text-sm">
                  Update multiple users at once
                </p>
              </button>
              <button className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-semibold mb-2">Permission Audit</h4>
                <p className="text-purple-100 text-sm">
                  Review and audit permissions
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Role Statistics */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Role Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => {
              const roleColor = getRoleColor(role.name);
              return (
                <div
                  key={role.id}
                  className={`bg-${roleColor}-900/50 p-6 rounded-2xl border border-${roleColor}-800 text-center`}
                >
                  <h3
                    className={`text-xl font-semibold text-${roleColor}-200 mb-2 capitalize`}
                  >
                    {role.name.replace("_", " ")}
                  </h3>
                  <p className={`text-3xl font-bold text-${roleColor}-300`}>
                    {role.userCount}
                  </p>
                  <p className={`text-sm text-${roleColor}-300 mt-2`}>
                    {role.isDefault ? "Default Role" : "Custom Role"}
                  </p>
                  <p className={`text-xs text-${roleColor}-400 mt-1`}>
                    {role.permissions.length} permissions
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Filters */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Filter & Search Users
          </h3>
          <FilterSearchControls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search by name or email..."
            filters={[
              {
                label: "Role",
                value: filterRole,
                options: [
                  { value: "all", label: "All Roles" },
                  ...roles.map((role) => ({
                    value: role.name,
                    label: role.name
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase()),
                  })),
                ],
                onChange: setFilterRole,
              },
              {
                label: "Status",
                value: filterStatus,
                options: [
                  { value: "all", label: "All Status" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "suspended", label: "Suspended" },
                ],
                onChange: setFilterStatus,
              },
            ]}
            sortOptions={[
              { value: "name", label: "Name A-Z" },
              { value: "role", label: "Role A-Z" },
              { value: "status", label: "Status A-Z" },
              { value: "lastActive", label: "Last Active" },
            ]}
            sortValue={sortBy}
            onSortChange={setSortBy}
            variant="blue"
          />
        </div>

        {/* User Management */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            User Management ({sortedUsers.length} users)
          </h3>
          <div className="space-y-4">
            {sortedUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-blue-300 text-lg">
                  No users found matching your criteria.
                </p>
              </div>
            ) : (
              sortedUsers.map((user) => {
                const roleColor = getRoleColor(user.currentRole);
                const statusColor = getStatusColor(user.status);
                const gradientColor = getGradientColor(user.currentRole);
                const lastActiveDate = new Date(user.lastActive);
                const timeAgo = getTimeAgo(lastActiveDate);

                return (
                  <div
                    key={user.id}
                    className={`bg-${roleColor}-900/50 p-6 rounded-2xl border border-${roleColor}-800`}
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
                          <h4 className={`text-${roleColor}-200 font-semibold`}>
                            {user.name}
                          </h4>
                          <p className={`text-${roleColor}-300 text-sm`}>
                            {user.email}
                          </p>
                          <p className={`text-${roleColor}-300 text-sm`}>
                            Last active: {timeAgo}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <select
                          value={user.currentRole}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          className={`px-3 py-2 bg-${roleColor}-800/50 border border-${roleColor}-700 rounded-lg text-${roleColor}-200 text-sm`}
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.name}>
                              {role.name
                                .replace("_", " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </option>
                          ))}
                        </select>
                        <select
                          value={user.status}
                          onChange={(e) =>
                            handleUserStatusChange(user.id, e.target.value)
                          }
                          className={`px-3 py-2 bg-${statusColor}-800/50 border border-${statusColor}-700 rounded-lg text-${statusColor}-200 text-sm`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className={`text-${roleColor}-300`}>
                          Current Role:
                        </span>
                        <span
                          className={`text-${roleColor}-200 ml-2 capitalize`}
                        >
                          {user.currentRole.replace("_", " ")}
                        </span>
                      </div>
                      <div>
                        <span className={`text-${roleColor}-300`}>Status:</span>
                        <span
                          className={`text-${statusColor}-200 ml-2 capitalize`}
                        >
                          {user.status}
                        </span>
                      </div>
                      <div>
                        <span className={`text-${roleColor}-300`}>
                          Permissions:
                        </span>
                        <span className={`text-${roleColor}-200 ml-2`}>
                          {user.permissions.length} granted
                        </span>
                      </div>
                    </div>
                    {user.previousRole && (
                      <div className="mt-3 p-3 bg-yellow-900/30 rounded-lg border border-yellow-800">
                        <p className="text-yellow-200 text-sm">
                          <span className="font-medium">Role History:</span>{" "}
                          Previously{" "}
                          <span className="capitalize">
                            {user.previousRole.replace("_", " ")}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Role Definitions */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Role Definitions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role) => {
              const roleColor = getRoleColor(role.name);
              return (
                <div
                  key={role.id}
                  className={`bg-${roleColor}-900/50 p-6 rounded-2xl border border-${roleColor}-800`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4
                      className={`text-${roleColor}-200 font-semibold text-lg capitalize`}
                    >
                      {role.name.replace("_", " ")}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs bg-${roleColor}-800 text-${roleColor}-200`}
                    >
                      {role.userCount} users
                    </span>
                  </div>
                  <p className={`text-${roleColor}-300 text-sm mb-4`}>
                    {role.description}
                  </p>
                  <div className="space-y-2">
                    <h5 className={`text-${roleColor}-200 font-medium text-sm`}>
                      Permissions:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission) => (
                        <span
                          key={permission}
                          className={`px-2 py-1 rounded-full text-xs bg-${roleColor}-800/50 text-${roleColor}-200 border border-${roleColor}-700`}
                        >
                          {permission.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                  {role.isDefault && (
                    <div className="mt-4 p-2 bg-green-900/30 rounded-lg border border-green-800">
                      <p className="text-green-200 text-xs">Default Role</p>
                    </div>
                  )}
                </div>
              );
            })}
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

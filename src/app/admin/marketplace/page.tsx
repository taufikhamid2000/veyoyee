"use client";

import React, { useState, useEffect } from "react";
import FilterSearchControls from "@/components/shared/FilterSearchControls";

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  seller: {
    name: string;
    email: string;
    avatar_initials: string;
  };
  status: "active" | "pending" | "suspended" | "sold";
  category:
    | "survey_data"
    | "research_tools"
    | "templates"
    | "services"
    | "other";
  price: number;
  currency: "RM" | "USD";
  views: number;
  sales: number;
  rating: number;
  listedAt: string;
  lastUpdated: string;
  tags: string[];
  moderationNotes?: string;
}

export default function MarketplaceManagementPage() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("listedAt");

  useEffect(() => {
    fetchMarketplaceItems();
  }, []);

  const fetchMarketplaceItems = async () => {
    try {
      setLoading(true);

      // Simulate API call - replace with actual Supabase query
      const mockItems: MarketplaceItem[] = [
        {
          id: "1",
          title: "Customer Satisfaction Survey Dataset 2024",
          description:
            "Comprehensive dataset from 500+ customer satisfaction surveys across multiple industries",
          seller: {
            name: "Sarah Johnson",
            email: "sarah.j@example.com",
            avatar_initials: "SJ",
          },
          status: "active",
          category: "survey_data",
          price: 250,
          currency: "RM",
          views: 1247,
          sales: 23,
          rating: 4.8,
          listedAt: "2024-01-15T10:30:00Z",
          lastUpdated: "2024-01-15T10:30:00Z",
          tags: ["customer_satisfaction", "retail", "2024"],
        },
        {
          id: "2",
          title: "Academic Research Survey Template Pack",
          description:
            "Professional survey templates for academic research with validated question sets",
          seller: {
            name: "Dr. Mike Chen",
            email: "mike.chen@university.edu",
            avatar_initials: "MC",
          },
          status: "active",
          category: "templates",
          price: 150,
          currency: "RM",
          views: 892,
          sales: 45,
          rating: 4.9,
          listedAt: "2024-01-14T14:20:00Z",
          lastUpdated: "2024-01-14T16:45:00Z",
          tags: ["academic", "research", "templates"],
        },
        {
          id: "3",
          title: "Market Research Analysis Tool",
          description:
            "Advanced analytics tool for processing and visualizing survey responses",
          seller: {
            name: "Lisa Wong",
            email: "lisa.wong@company.com",
            avatar_initials: "LW",
          },
          status: "suspended",
          category: "research_tools",
          price: 500,
          currency: "RM",
          views: 156,
          sales: 0,
          rating: 0,
          listedAt: "2024-01-13T09:15:00Z",
          lastUpdated: "2024-01-13T11:30:00Z",
          tags: ["analytics", "tools", "premium"],
          moderationNotes: "Suspended due to licensing issues",
        },
        {
          id: "4",
          title: "Employee Engagement Survey Data",
          description:
            "Dataset from 200+ employee engagement surveys across various companies",
          seller: {
            name: "David Kim",
            email: "david.kim@hr.com",
            avatar_initials: "DK",
          },
          status: "pending",
          category: "survey_data",
          price: 180,
          currency: "RM",
          views: 0,
          sales: 0,
          rating: 0,
          listedAt: "2024-01-15T08:45:00Z",
          lastUpdated: "2024-01-15T08:45:00Z",
          tags: ["employee_engagement", "hr", "workplace"],
        },
        {
          id: "5",
          title: "Survey Design Consultation Service",
          description:
            "Professional consultation for designing effective surveys and research studies",
          seller: {
            name: "Alex Rodriguez",
            email: "alex.r@consulting.com",
            avatar_initials: "AR",
          },
          status: "active",
          category: "services",
          price: 300,
          currency: "RM",
          views: 234,
          sales: 8,
          rating: 4.7,
          listedAt: "2024-01-12T16:30:00Z",
          lastUpdated: "2024-01-12T18:20:00Z",
          tags: ["consultation", "design", "professional"],
        },
        {
          id: "6",
          title: "Technology Adoption Survey Results",
          description:
            "Comprehensive data on technology adoption patterns in Malaysian businesses",
          seller: {
            name: "Emma Thompson",
            email: "emma.t@tech.com",
            avatar_initials: "ET",
          },
          status: "sold",
          category: "survey_data",
          price: 120,
          currency: "RM",
          views: 567,
          sales: 1,
          rating: 5.0,
          listedAt: "2024-01-10T12:00:00Z",
          lastUpdated: "2024-01-15T12:00:00Z",
          tags: ["technology", "adoption", "malaysia"],
        },
      ];

      setItems(mockItems);
    } catch (error) {
      console.error("Error fetching marketplace items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveItem = async (itemId: string) => {
    try {
      // Update item status in database
      // const { error } = await supabase
      //   .from('marketplace_items')
      //   .update({ status: 'active' })
      //   .eq('id', itemId);

      // For now, just update local state
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, status: "active" as const } : item
        )
      );
    } catch (error) {
      console.error("Error approving item:", error);
    }
  };

  const handleSuspendItem = async (itemId: string, notes: string) => {
    try {
      // Update item status in database
      // const { error } = await supabase
      //   .from('marketplace_items')
      //   .update({ status: 'suspended', moderation_notes: notes })
      //   .eq('id', itemId);

      // For now, just update local state
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, status: "suspended" as const, moderationNotes: notes }
            : item
        )
      );
    } catch (error) {
      console.error("Error suspending item:", error);
    }
  };

  const handleBulkApprove = async () => {
    try {
      // Bulk update in database
      // const { error } = await supabase
      //   .from('marketplace_items')
      //   .update({ status: 'active' })
      //   .in('id', pendingItems.map(i => i.id));

      // For now, just update local state
      setItems((prev) =>
        prev.map((item) =>
          item.status === "pending"
            ? { ...item, status: "active" as const }
            : item
        )
      );
    } catch (error) {
      console.error("Error bulk approving items:", error);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.seller.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "seller":
        return a.seller.name.localeCompare(b.seller.name);
      case "status":
        return a.status.localeCompare(b.status);
      case "price":
        return b.price - a.price;
      case "sales":
        return b.sales - a.sales;
      case "views":
        return b.views - a.views;
      case "listedAt":
        return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime();
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "active":
        return "green";
      case "suspended":
        return "red";
      case "sold":
        return "blue";
      default:
        return "gray";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "survey_data":
        return "blue";
      case "research_tools":
        return "purple";
      case "templates":
        return "green";
      case "services":
        return "orange";
      case "other":
        return "gray";
      default:
        return "blue";
    }
  };

  const getGradientColor = (status: string) => {
    switch (status) {
      case "pending":
        return "from-yellow-500 to-orange-600";
      case "active":
        return "from-green-500 to-emerald-600";
      case "suspended":
        return "from-red-500 to-pink-600";
      case "sold":
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

  const activeCount = items.filter((i) => i.status === "active").length;
  const pendingCount = items.filter((i) => i.status === "pending").length;
  const suspendedCount = items.filter((i) => i.status === "suspended").length;
  const totalRevenue = items
    .filter((i) => i.status === "sold")
    .reduce((sum, item) => sum + item.price * item.sales, 0);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 py-8 px-2 sm:px-4 md:px-6">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-20 animate-gradient-x bg-gradient-to-tr from-blue-800 via-indigo-900 to-blue-600 opacity-30 blur-2xl" />

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Marketplace Management
            </h1>
            <p className="text-lg text-blue-200 mb-4">
              Manage marketplace listings, transactions, and seller activities
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleBulkApprove}
                disabled={pendingCount === 0}
                className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-300 transform hover:scale-105"
              >
                <h4 className="text-xl font-semibold mb-2">
                  Approve All Pending
                </h4>
                <p className="text-blue-100 text-sm">
                  Approve all pending listings ({pendingCount})
                </p>
              </button>
              <button className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-semibold mb-2">
                  Transaction History
                </h4>
                <p className="text-green-100 text-sm">
                  View all marketplace transactions
                </p>
              </button>
              <button className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-semibold mb-2">Seller Analytics</h4>
                <p className="text-purple-100 text-sm">
                  Analyze seller performance and trends
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Marketplace Statistics */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Marketplace Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-green-900/50 p-6 rounded-2xl border border-green-800 text-center">
              <h3 className="text-xl font-semibold text-green-200 mb-2">
                Active Listings
              </h3>
              <p className="text-3xl font-bold text-green-300">{activeCount}</p>
              <p className="text-sm text-green-300 mt-2">Currently available</p>
            </div>
            <div className="bg-yellow-900/50 p-6 rounded-2xl border border-yellow-800 text-center">
              <h3 className="text-xl font-semibold text-yellow-200 mb-2">
                Pending Review
              </h3>
              <p className="text-3xl font-bold text-yellow-300">
                {pendingCount}
              </p>
              <p className="text-sm text-yellow-300 mt-2">Awaiting approval</p>
            </div>
            <div className="bg-red-900/50 p-6 rounded-2xl border border-red-800 text-center">
              <h3 className="text-xl font-semibold text-red-200 mb-2">
                Suspended
              </h3>
              <p className="text-3xl font-bold text-red-300">
                {suspendedCount}
              </p>
              <p className="text-sm text-red-300 mt-2">Under review</p>
            </div>
            <div className="bg-blue-900/50 p-6 rounded-2xl border border-blue-800 text-center">
              <h3 className="text-xl font-semibold text-blue-200 mb-2">
                Total Revenue
              </h3>
              <p className="text-3xl font-bold text-blue-300">
                RM{totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-blue-300 mt-2">From completed sales</p>
            </div>
          </div>
        </div>

        {/* Marketplace Filters */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Filter & Search Listings
          </h3>
          <FilterSearchControls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search listings by title, description, or seller..."
            filters={[
              {
                label: "Status",
                value: filterStatus,
                options: [
                  { value: "all", label: "All Status" },
                  { value: "pending", label: "Pending Review" },
                  { value: "active", label: "Active" },
                  { value: "suspended", label: "Suspended" },
                  { value: "sold", label: "Sold" },
                ],
                onChange: setFilterStatus,
              },
              {
                label: "Category",
                value: filterCategory,
                options: [
                  { value: "all", label: "All Categories" },
                  { value: "survey_data", label: "Survey Data" },
                  { value: "research_tools", label: "Research Tools" },
                  { value: "templates", label: "Templates" },
                  { value: "services", label: "Services" },
                  { value: "other", label: "Other" },
                ],
                onChange: setFilterCategory,
              },
            ]}
            sortOptions={[
              { value: "listedAt", label: "Recently Listed" },
              { value: "title", label: "Title A-Z" },
              { value: "seller", label: "Seller A-Z" },
              { value: "price", label: "Price (High to Low)" },
              { value: "sales", label: "Sales (High to Low)" },
              { value: "views", label: "Views (High to Low)" },
            ]}
            sortValue={sortBy}
            onSortChange={setSortBy}
            variant="blue"
          />
        </div>

        {/* Marketplace Management */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Marketplace Listings ({sortedItems.length} items)
          </h3>
          <div className="space-y-4">
            {sortedItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-blue-300 text-lg">
                  No listings found matching your criteria.
                </p>
              </div>
            ) : (
              sortedItems.map((item) => {
                const statusColor = getStatusColor(item.status);
                const categoryColor = getCategoryColor(item.category);
                const gradientColor = getGradientColor(item.status);
                const listedDate = new Date(item.listedAt);
                const timeAgo = getTimeAgo(listedDate);

                return (
                  <div
                    key={item.id}
                    className={`bg-${statusColor}-900/50 p-6 rounded-2xl border border-${statusColor}-800`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${gradientColor} rounded-full flex items-center justify-center`}
                        >
                          <span className="text-white font-semibold">
                            {item.seller.avatar_initials}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`text-${statusColor}-200 font-semibold text-lg mb-2`}
                          >
                            {item.title}
                          </h4>
                          <p className={`text-${statusColor}-300 text-sm mb-2`}>
                            {item.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className={`text-${statusColor}-300`}>
                              By: {item.seller.name}
                            </span>
                            <span className={`text-${statusColor}-300`}>
                              Listed: {timeAgo}
                            </span>
                            <span className={`text-${statusColor}-300`}>
                              {item.views} views
                            </span>
                            <span className={`text-${statusColor}-300`}>
                              {item.sales} sales
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {item.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApproveItem(item.id)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                const notes = prompt(
                                  "Enter suspension reason:"
                                );
                                if (notes) handleSuspendItem(item.id, notes);
                              }}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                              Suspend
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className={`text-${statusColor}-300`}>
                          Status:
                        </span>
                        <span
                          className={`text-${statusColor}-200 ml-2 capitalize`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div>
                        <span className={`text-${statusColor}-300`}>
                          Category:
                        </span>
                        <span
                          className={`text-${categoryColor}-200 ml-2 capitalize`}
                        >
                          {item.category.replace("_", " ")}
                        </span>
                      </div>
                      <div>
                        <span className={`text-${statusColor}-300`}>
                          Price:
                        </span>
                        <span
                          className={`text-${statusColor}-200 ml-2 font-semibold`}
                        >
                          {item.currency} {item.price.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className={`text-${statusColor}-300`}>
                          Rating:
                        </span>
                        <span className={`text-${statusColor}-200 ml-2`}>
                          {item.rating > 0
                            ? `${item.rating}/5.0`
                            : "No ratings"}
                        </span>
                      </div>
                    </div>
                    {item.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-1 rounded-full text-xs bg-${statusColor}-800/50 text-${statusColor}-200 border border-${statusColor}-700 capitalize`}
                          >
                            {tag.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.moderationNotes && (
                      <div className="mt-3 p-3 bg-red-900/30 rounded-lg border border-red-800">
                        <p className="text-red-200 text-sm">
                          <span className="font-medium">
                            Suspension Reason:
                          </span>{" "}
                          {item.moderationNotes}
                        </p>
                      </div>
                    )}
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

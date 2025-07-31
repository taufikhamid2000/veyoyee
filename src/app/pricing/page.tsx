import React from "react";

export default function HandoverPricingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 py-8 px-2 sm:px-4 md:px-6">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-20 animate-gradient-x bg-gradient-to-tr from-blue-800 via-indigo-900 to-blue-600 opacity-30 blur-2xl" />

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Veyoyee Project: Hourly Rate Pricing Breakdown
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-lg font-medium text-blue-200 mb-2">
                  Hourly Rate
                </p>
                <p className="text-4xl font-bold text-blue-300">
                  RM20 per hour
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-blue-200 mb-2">
                  Calculation Method
                </p>
                <p className="text-lg text-blue-100">
                  Feature complexity × estimated hours
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Rate Comparison Section */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mb-8 border border-blue-900">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Hourly Rate Comparison
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-900/50 p-6 rounded-2xl border border-green-800">
              <h3 className="text-xl font-semibold text-green-200 mb-4 text-center">
                My Rate (Beginner Developer)
              </h3>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-300 mb-2">
                  RM20/hour
                </p>
                <p className="text-sm text-green-300 mb-4">
                  More time taken due to learning curve
                </p>
                <div className="space-y-2 text-left">
                  <p className="text-green-200 text-sm">
                    ✓ Detailed, thorough implementation
                  </p>
                  <p className="text-green-200 text-sm">
                    ✓ Comprehensive documentation
                  </p>
                  <p className="text-green-200 text-sm">
                    ✓ Quality-focused approach
                  </p>
                  <p className="text-green-200 text-sm">
                    ✓ ~200 hours with AI assistance
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-orange-900/50 p-6 rounded-2xl border border-orange-800">
              <h3 className="text-xl font-semibold text-orange-200 mb-4 text-center">
                Market Average (Experienced Developer)
              </h3>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-300 mb-2">
                  RM40-60/hour
                </p>
                <p className="text-center text-yellow-300 mb-4">
                  <a
                    href="https://my.jobstreet.com/career-advice/role/full-stack-developer/salary"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-yellow-200"
                  >
                    Based on RM5.1k-7.5k monthly salary
                  </a>
                </p>
                <div className="space-y-2 text-left">
                  <p className="text-orange-200 text-sm">
                    ✓ Faster implementation
                  </p>
                  <p className="text-orange-200 text-sm">
                    ✓ ~280 hours estimated time
                  </p>
                  <p className="text-orange-200 text-sm">✓ Higher efficiency</p>
                  <p className="text-orange-200 text-sm">
                    ✓ More expensive total cost
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-900/50 rounded-2xl border border-blue-800">
            <div className="text-center">
              <p className="text-lg font-semibold text-blue-200 mb-2">
                Cost Comparison
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-300">
                    Your Rate (~200 hours)
                  </p>
                  <p className="text-2xl font-bold text-blue-300">RM4,000</p>
                </div>
                <div>
                  <p className="text-sm text-blue-300">
                    Market Rate (280 hours)
                  </p>
                  <p className="text-2xl font-bold text-blue-300">
                    RM11,200-16,800
                  </p>
                </div>
              </div>
              <p className="text-sm text-blue-200 mt-4">
                <span className="font-semibold text-green-300">Result:</span>{" "}
                Significant cost savings of RM7,200-12,800 while maintaining
                quality through AI-assisted development.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Core Architecture */}
          <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 border border-blue-900">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              1. Core Architecture & Stack
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-900/50 p-6 rounded-2xl border border-blue-800">
                  <h4 className="font-semibold text-blue-200 mb-2">
                    Next.js 13+ (App Router)
                  </h4>
                  <p className="text-2xl font-bold text-blue-300">
                    8 hours × RM20 = RM160
                  </p>
                </div>
                <div className="bg-blue-900/50 p-6 rounded-2xl border border-blue-800">
                  <h4 className="font-semibold text-blue-200 mb-2">
                    TypeScript Throughout
                  </h4>
                  <p className="text-2xl font-bold text-blue-300">
                    5 hours × RM20 = RM100
                  </p>
                </div>
                <div className="bg-blue-900/50 p-6 rounded-2xl border border-blue-800">
                  <h4 className="font-semibold text-blue-200 mb-2">
                    Tailwind CSS Setup
                  </h4>
                  <p className="text-2xl font-bold text-blue-300">
                    4 hours × RM20 = RM80
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-900/50 p-6 rounded-2xl border border-blue-800">
                  <h4 className="font-semibold text-blue-200 mb-2">
                    Supabase Integration
                  </h4>
                  <p className="text-2xl font-bold text-blue-300">
                    6 hours × RM20 = RM120
                  </p>
                </div>
                <div className="bg-blue-900/50 p-6 rounded-2xl border border-blue-800">
                  <h4 className="font-semibold text-blue-200 mb-2">
                    Modular Structure
                  </h4>
                  <p className="text-2xl font-bold text-blue-300">
                    7 hours × RM20 = RM140
                  </p>
                </div>
              </div>
              <div className="bg-green-900/50 p-6 rounded-2xl text-center border border-green-800">
                <p className="text-xl font-bold text-green-300">
                  Subtotal: 30 hours = RM600
                </p>
              </div>
            </div>
          </div>

          {/* Authentication */}
          <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 border border-blue-900">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              2. Authentication & Authorization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-purple-900/50 p-6 rounded-2xl border border-purple-800">
                <h4 className="font-semibold text-purple-200 mb-2">
                  Secure Registration
                </h4>
                <p className="text-xl font-bold text-purple-300">
                  4 hours × RM20 = RM80
                </p>
              </div>
              <div className="bg-purple-900/50 p-6 rounded-2xl border border-purple-800">
                <h4 className="font-semibold text-purple-200 mb-2">
                  Secure Login
                </h4>
                <p className="text-xl font-bold text-purple-300">
                  4 hours × RM20 = RM80
                </p>
              </div>
              <div className="bg-purple-900/50 p-6 rounded-2xl border border-purple-800">
                <h4 className="font-semibold text-purple-200 mb-2">
                  Protected Routes
                </h4>
                <p className="text-xl font-bold text-purple-300">
                  4 hours × RM20 = RM80
                </p>
              </div>
              <div className="bg-purple-900/50 p-6 rounded-2xl border border-purple-800">
                <h4 className="font-semibold text-purple-200 mb-2">
                  Session Management
                </h4>
                <p className="text-xl font-bold text-purple-300">
                  4 hours × RM20 = RM80
                </p>
              </div>
              <div className="bg-purple-900/50 p-6 rounded-2xl border border-purple-800">
                <h4 className="font-semibold text-purple-200 mb-2">
                  Custom Hooks
                </h4>
                <p className="text-xl font-bold text-purple-300">
                  4 hours × RM20 = RM80
                </p>
              </div>
            </div>
            <div className="bg-green-900/50 p-6 rounded-2xl text-center mt-6 border border-green-800">
              <p className="text-xl font-bold text-green-300">
                Subtotal: 50 hours = RM1,000
              </p>
            </div>
          </div>

          {/* Survey Platform */}
          <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 border border-blue-900">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              3. Survey Platform
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-orange-900/50 p-6 rounded-2xl border border-orange-800">
                <h4 className="font-semibold text-orange-200 mb-2">
                  Survey Creation
                </h4>
                <p className="text-xl font-bold text-orange-300">
                  25 hours × RM20 = RM500
                </p>
              </div>
              <div className="bg-orange-900/50 p-6 rounded-2xl border border-orange-800">
                <h4 className="font-semibold text-orange-200 mb-2">
                  Survey Editing
                </h4>
                <p className="text-xl font-bold text-orange-300">
                  15 hours × RM20 = RM300
                </p>
              </div>
              <div className="bg-orange-900/50 p-6 rounded-2xl border border-orange-800">
                <h4 className="font-semibold text-orange-200 mb-2">
                  Multiple Question Types
                </h4>
                <p className="text-xl font-bold text-orange-300">
                  12 hours × RM20 = RM240
                </p>
              </div>
              <div className="bg-orange-900/50 p-6 rounded-2xl border border-orange-800">
                <h4 className="font-semibold text-orange-200 mb-2">
                  Bulk Actions
                </h4>
                <p className="text-xl font-bold text-orange-300">
                  18 hours × RM20 = RM360
                </p>
              </div>
              <div className="bg-orange-900/50 p-6 rounded-2xl border border-orange-800">
                <h4 className="font-semibold text-orange-200 mb-2">
                  Import/Export
                </h4>
                <p className="text-xl font-bold text-orange-300">
                  10 hours × RM20 = RM200
                </p>
              </div>
              <div className="bg-orange-900/50 p-6 rounded-2xl border border-orange-800">
                <h4 className="font-semibold text-orange-200 mb-2">
                  Analytics Dashboard
                </h4>
                <p className="text-xl font-bold text-orange-300">
                  25 hours × RM20 = RM500
                </p>
              </div>
            </div>
            <div className="bg-green-900/50 p-6 rounded-2xl text-center mt-6 border border-green-800">
              <p className="text-xl font-bold text-green-300">
                Subtotal: 105 hours = RM2,100
              </p>
            </div>
          </div>

          {/* Marketplace */}
          <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 border border-blue-900">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              4. Marketplace & Monetization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-teal-900/50 p-6 rounded-2xl border border-teal-800">
                <h4 className="font-semibold text-teal-200 mb-2">
                  Marketplace UI
                </h4>
                <p className="text-xl font-bold text-teal-300">
                  6 hours × RM20 = RM120
                </p>
              </div>
              <div className="bg-teal-900/50 p-6 rounded-2xl border border-teal-800">
                <h4 className="font-semibold text-teal-200 mb-2">
                  Purchase Logic
                </h4>
                <p className="text-xl font-bold text-teal-300">
                  6 hours × RM20 = RM120
                </p>
              </div>
              <div className="bg-teal-900/50 p-6 rounded-2xl border border-teal-800">
                <h4 className="font-semibold text-teal-200 mb-2">
                  Transfer Logic
                </h4>
                <p className="text-xl font-bold text-teal-300">
                  4 hours × RM20 = RM80
                </p>
              </div>
              <div className="bg-teal-900/50 p-6 rounded-2xl border border-teal-800">
                <h4 className="font-semibold text-teal-200 mb-2">
                  Data Models
                </h4>
                <p className="text-xl font-bold text-teal-300">
                  4 hours × RM20 = RM80
                </p>
              </div>
            </div>
            <div className="bg-green-900/50 p-6 rounded-2xl text-center mt-6 border border-green-800">
              <p className="text-xl font-bold text-green-300">
                Subtotal: 50 hours = RM1,000
              </p>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 border border-blue-900">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              5. Leaderboard & Gamification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-yellow-900/50 p-6 rounded-2xl border border-yellow-800">
                <h4 className="font-semibold text-yellow-200 mb-2">
                  Leaderboard UI
                </h4>
                <p className="text-xl font-bold text-yellow-300">
                  4 hours × RM20 = RM80
                </p>
              </div>
              <div className="bg-yellow-900/50 p-6 rounded-2xl border border-yellow-800">
                <h4 className="font-semibold text-yellow-200 mb-2">
                  Reputation System
                </h4>
                <p className="text-xl font-bold text-yellow-300">
                  10 hours × RM20 = RM200
                </p>
              </div>
              <div className="bg-yellow-900/50 p-6 rounded-2xl border border-yellow-800">
                <h4 className="font-semibold text-yellow-200 mb-2">
                  Performance Tiers
                </h4>
                <p className="text-xl font-bold text-yellow-300">
                  10 hours × RM20 = RM200
                </p>
              </div>
              <div className="bg-yellow-900/50 p-6 rounded-2xl border border-yellow-800">
                <h4 className="font-semibold text-yellow-200 mb-2">
                  Data Models
                </h4>
                <p className="text-xl font-bold text-yellow-300">
                  5 hours × RM20 = RM100
                </p>
              </div>
            </div>
            <div className="bg-green-900/50 p-6 rounded-2xl text-center mt-6 border border-green-800">
              <p className="text-xl font-bold text-green-300">
                Subtotal: 35 hours = RM700
              </p>
            </div>
          </div>

          {/* UI Components */}
          <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 border border-blue-900">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              6. Reusable UI/UX Components
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-indigo-900/50 p-6 rounded-2xl border border-indigo-800">
                <h4 className="font-semibold text-indigo-200 mb-2">
                  Custom Components
                </h4>
                <p className="text-xl font-bold text-indigo-300">
                  20 hours × RM20 = RM400
                </p>
              </div>
              <div className="bg-indigo-900/50 p-6 rounded-2xl border border-indigo-800">
                <h4 className="font-semibold text-indigo-200 mb-2">
                  Accessibility
                </h4>
                <p className="text-xl font-bold text-indigo-300">
                  10 hours × RM20 = RM200
                </p>
              </div>
              <div className="bg-indigo-900/50 p-6 rounded-2xl border border-indigo-800">
                <h4 className="font-semibold text-indigo-200 mb-2">
                  Loading States
                </h4>
                <p className="text-xl font-bold text-indigo-300">
                  10 hours × RM20 = RM200
                </p>
              </div>
            </div>
            <div className="bg-green-900/50 p-6 rounded-2xl text-center mt-6 border border-green-800">
              <p className="text-xl font-bold text-green-300">
                Subtotal: 40 hours = RM800
              </p>
            </div>
          </div>

          {/* Testing */}
          <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 border border-blue-900">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              7. Testing & Developer Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-red-900/50 p-6 rounded-2xl border border-red-800">
                <h4 className="font-semibold text-red-200 mb-2">Jest Tests</h4>
                <p className="text-xl font-bold text-red-300">
                  10 hours × RM20 = RM200
                </p>
              </div>
              <div className="bg-red-900/50 p-6 rounded-2xl border border-red-800">
                <h4 className="font-semibold text-red-200 mb-2">
                  Types/Interfaces
                </h4>
                <p className="text-xl font-bold text-red-300">
                  5 hours × RM20 = RM100
                </p>
              </div>
              <div className="bg-red-900/50 p-6 rounded-2xl border border-red-800">
                <h4 className="font-semibold text-red-200 mb-2">
                  Utility Functions
                </h4>
                <p className="text-xl font-bold text-red-300">
                  5 hours × RM20 = RM100
                </p>
              </div>
              <div className="bg-red-900/50 p-6 rounded-2xl border border-red-800">
                <h4 className="font-semibold text-red-200 mb-2">
                  Service Layers
                </h4>
                <p className="text-xl font-bold text-red-300">
                  5 hours × RM20 = RM100
                </p>
              </div>
            </div>
            <div className="bg-green-900/50 p-6 rounded-2xl text-center mt-6 border border-green-800">
              <p className="text-xl font-bold text-green-300">
                Subtotal: 25 hours = RM500
              </p>
            </div>
          </div>

          {/* Documentation */}
          <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 border border-blue-900">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              8. Documentation & Compliance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                <h4 className="font-semibold text-gray-200 mb-2">
                  Privacy Policy
                </h4>
                <p className="text-xl font-bold text-gray-300">
                  5 hours × RM20 = RM100
                </p>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                <h4 className="font-semibold text-gray-200 mb-2">
                  Security Policy
                </h4>
                <p className="text-xl font-bold text-gray-300">
                  5 hours × RM20 = RM100
                </p>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                <h4 className="font-semibold text-gray-200 mb-2">
                  Terms of Service
                </h4>
                <p className="text-xl font-bold text-gray-300">
                  5 hours × RM20 = RM100
                </p>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                <h4 className="font-semibold text-gray-200 mb-2">
                  Code Documentation
                </h4>
                <p className="text-xl font-bold text-gray-300">
                  5 hours × RM20 = RM100
                </p>
              </div>
            </div>
            <div className="bg-green-900/50 p-6 rounded-2xl text-center mt-6 border border-green-800">
              <p className="text-xl font-bold text-green-300">
                Subtotal: 20 hours = RM400
              </p>
            </div>
          </div>
        </div>

        {/* Total Summary */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-900 shadow-2xl p-8 mt-12 border border-blue-600">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
            Total Project Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-lg font-medium text-blue-200 mb-2">
                Actual Hours
              </p>
              <p className="text-4xl font-bold text-white">~200 hours</p>
            </div>
            <div>
              <p className="text-lg font-medium text-blue-200 mb-2">
                Hourly Rate
              </p>
              <p className="text-4xl font-bold text-white">RM20/hour</p>
            </div>
            <div>
              <p className="text-lg font-medium text-blue-200 mb-2">
                Total Value
              </p>
              <p className="text-4xl font-bold text-white">RM4,000</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-800/50 rounded-2xl border border-blue-700">
            <p className="text-center text-blue-200 font-medium">
              Development time reduced through AI assistance (Copilot, Cursor,
              ChatGPT) while maintaining quality and comprehensive features.
            </p>
          </div>
        </div>

        {/* Pricing Recommendations */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mt-8 border border-blue-900">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Pricing Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-900/50 p-6 rounded-2xl text-center border border-blue-800">
              <h3 className="text-xl font-semibold text-blue-200 mb-2">
                Commercial License
              </h3>
              <p className="text-sm text-blue-300 mb-4">
                Multi-use, resale rights, support/updates
              </p>
              <p className="text-2xl font-bold text-blue-300">
                RM4,000 - RM6,000
              </p>
            </div>
            <div className="bg-green-900/50 p-6 rounded-2xl text-center border border-green-800">
              <h3 className="text-xl font-semibold text-green-200 mb-2">
                Standard License
              </h3>
              <p className="text-sm text-green-300 mb-4">
                Single use, no resale
              </p>
              <p className="text-2xl font-bold text-green-300">
                RM3,000 - RM4,000
              </p>
            </div>
            <div className="bg-orange-900/50 p-6 rounded-2xl text-center border border-orange-800">
              <h3 className="text-xl font-semibold text-orange-200 mb-2">
                Basic License
              </h3>
              <p className="text-sm text-orange-300 mb-4">
                Single use, limited support
              </p>
              <p className="text-2xl font-bold text-orange-300">
                RM2,500 - RM3,000
              </p>
            </div>
          </div>
        </div>

        {/* Hourly Breakdown */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mt-8 border border-blue-900">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Hourly Breakdown Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-blue-300 mb-1">Core Architecture</p>
              <p className="text-lg font-semibold text-white">30 hours (15%)</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-300 mb-1">Authentication</p>
              <p className="text-lg font-semibold text-white">20 hours (10%)</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-300 mb-1">Survey Platform</p>
              <p className="text-lg font-semibold text-white">
                105 hours (52.5%)
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-300 mb-1">Marketplace</p>
              <p className="text-lg font-semibold text-white">20 hours (10%)</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-300 mb-1">Leaderboard</p>
              <p className="text-lg font-semibold text-white">
                35 hours (6.2%)
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-300 mb-1">UI Components</p>
              <p className="text-lg font-semibold text-white">
                40 hours (7.1%)
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-300 mb-1">Testing</p>
              <p className="text-lg font-semibold text-white">
                25 hours (4.4%)
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-300 mb-1">Documentation</p>
              <p className="text-lg font-semibold text-white">
                20 hours (3.5%)
              </p>
            </div>
          </div>
          <div className="mt-8 p-6 bg-yellow-900/50 rounded-2xl border border-yellow-800">
            <p className="text-center text-yellow-200 font-medium">
              The survey platform represents the largest portion of development
              time (47.8%) due to its complexity and comprehensive feature set.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

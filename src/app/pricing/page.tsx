import React from "react";
import {
  PricingSection,
  ComparisonCard,
  SummaryCard,
} from "@/components/pricing";
import { pricingData, comparisonData, summaryData } from "@/data/pricing-data";

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
            <ComparisonCard {...comparisonData.myRate} />
            <ComparisonCard {...comparisonData.marketRate} />
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

        {/* Pricing Sections */}
        <div className="space-y-8">
          {pricingData.map((section, index) => (
            <PricingSection
              key={index}
              title={section.title}
              items={section.items}
            />
          ))}
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
              <p className="text-4xl font-bold text-white">
                ~{summaryData.totalHours} hours
              </p>
            </div>
            <div>
              <p className="text-lg font-medium text-blue-200 mb-2">
                Hourly Rate
              </p>
              <p className="text-4xl font-bold text-white">
                RM{summaryData.hourlyRate}/hour
              </p>
            </div>
            <div>
              <p className="text-lg font-medium text-blue-200 mb-2">
                Total Value
              </p>
              <p className="text-4xl font-bold text-white">
                RM{summaryData.totalValue.toLocaleString()}
              </p>
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
            {summaryData.pricingRecommendations.map((rec, index) => (
              <SummaryCard
                key={index}
                title={rec.title}
                value={rec.value}
                subtitle={rec.subtitle}
                color={rec.color}
              />
            ))}
          </div>
        </div>

        {/* Hourly Breakdown Summary */}
        <div className="rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 mt-8 border border-blue-900">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Hourly Breakdown Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pricingData.map((section, index) => {
              const totalHours = section.items.reduce(
                (sum, item) => sum + item.hours,
                0
              );
              const percentage = (
                (totalHours / summaryData.totalHours) *
                100
              ).toFixed(1);

              return (
                <div key={index} className="text-center">
                  <p className="text-sm text-blue-300 mb-1">
                    {section.title.replace(/^\d+\.\s*/, "")}
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {totalHours} hours ({percentage}%)
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-8 p-6 bg-yellow-900/50 rounded-2xl border border-yellow-800">
            <p className="text-center text-yellow-200 font-medium">
              The survey platform represents the largest portion of development
              time (52.5%) due to its complexity and comprehensive feature set.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

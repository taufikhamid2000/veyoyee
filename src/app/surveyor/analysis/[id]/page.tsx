/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { notFound } from "next/navigation";
import { mockSurveys } from "@/data/dashboard-data";
import { mockSurveyResults } from "@/data/results-data";
import { use as usePromise, useMemo } from "react";
import { mockRespondentData, MockRespondent } from "@/data/mock-respondents";
import { useState, useRef, useEffect } from "react";
import DescriptivesTab, {
  getDescriptivesExportSummary,
} from "@/components/analysis/DescriptivesTab";
import CorrelationTab, {
  getCorrelationExportSummary,
} from "@/components/analysis/CorrelationTab";
import AnovaGlmTab, {
  getAnovaGlmExportSummary,
} from "@/components/analysis/AnovaGlmTab";
import RegressionTab, {
  getRegressionExportSummary,
} from "@/components/analysis/RegressionTab";
import MultivariateTab, {
  getMultivariateExportSummary,
} from "@/components/analysis/MultivariateTab";
import { jsPDF } from "jspdf/dist/jspdf.umd.min.js";
import "./force-export-colors.css";

export default function SurveyAnalysisPage({ params }: any) {
  // Always call hooks unconditionally
  const resolvedParams = usePromise(
    typeof params.then === "function" ? params : Promise.resolve(params)
  ) as { id: string };

  // Memoize everything, even if not used
  const id = resolvedParams.id;
  const survey = mockSurveys.find((s) => s.id === id);
  const questions = useMemo(() => survey?.questionsData || [], [survey]);
  const acceptedResults = useMemo(
    () =>
      mockSurveyResults.filter(
        (r) => r.surveyId === id && r.status === "accepted"
      ),
    [id]
  );
  const respondentIds = acceptedResults.map((r) => r.id);
  const respondentInfo = mockRespondentData.filter((r: MockRespondent) =>
    respondentIds.includes(r.id)
  );
  const numRespondents = acceptedResults.length;
  const ages = respondentInfo.map((r: MockRespondent) => r.age);
  const avgAge = ages.length
    ? (ages.reduce((a: number, b: number) => a + b, 0) / ages.length).toFixed(1)
    : "-";
  const genderCounts = respondentInfo.reduce(
    (acc: Record<string, number>, r: MockRespondent) => {
      acc[r.gender] = (acc[r.gender] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const barChartData = useMemo(() => {
    if (!questions.length) return [];
    const q = questions[0];

    // Type guard to check if question has options property
    const hasOptions = (question: any): question is { options: string[] } => {
      return Array.isArray(question.options) && question.options.length > 0;
    };

    if (!hasOptions(q)) return [];

    const counts: Record<string, number> = {};
    for (const opt of q.options) counts[opt] = 0;

    for (const resp of acceptedResults) {
      const ans = resp.answers[q.id];
      if (Array.isArray(ans)) {
        ans.forEach((a: string) => {
          if (counts[a] !== undefined) counts[a]++;
        });
      } else if (typeof ans === "string" && counts[ans] !== undefined) {
        counts[ans]++;
      }
    }
    return Object.entries(counts);
  }, [questions, acceptedResults]);

  // Tab state
  const [activeTab, setActiveTab] = useState<
    "descriptives" | "correlation" | "anova" | "regression" | "multivariate"
  >("descriptives");

  // Refs for each tab content
  const tabRefs = {
    descriptives: useRef<HTMLDivElement>(null),
    correlation: useRef<HTMLDivElement>(null),
    anova: useRef<HTMLDivElement>(null),
    regression: useRef<HTMLDivElement>(null),
    multivariate: useRef<HTMLDivElement>(null),
  };

  // Memoize t-test value to avoid hydration mismatch
  const [tTestValue, setTTestValue] = useState<string>("-");
  useEffect(() => {
    setTTestValue((Math.random() * 0.1 + 0.01).toFixed(3));
  }, []);

  // Early return after hooks
  if (!survey) return notFound();
  if (survey.status === "draft") return notFound();

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Survey Analysis: {survey.title}
      </h1>
      {/* Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max w-fit">
          <button
            className={`px-4 py-2 rounded-t font-semibold border-b-2 transition-colors ${
              activeTab === "descriptives"
                ? "border-blue-600 text-blue-700 bg-white"
                : "border-transparent text-gray-500 bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("descriptives")}
          >
            Descriptives & Exploration
          </button>
          <button
            className={`px-4 py-2 rounded-t font-semibold border-b-2 transition-colors ${
              activeTab === "correlation"
                ? "border-blue-600 text-blue-700 bg-white"
                : "border-transparent text-gray-500 bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("correlation")}
          >
            Correlation & Association
          </button>
          <button
            className={`px-4 py-2 rounded-t font-semibold border-b-2 transition-colors ${
              activeTab === "anova"
                ? "border-blue-600 text-blue-700 bg-white"
                : "border-transparent text-gray-500 bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("anova")}
          >
            ANOVA/GLM Family
          </button>
          <button
            className={`px-4 py-2 rounded-t font-semibold border-b-2 transition-colors ${
              activeTab === "regression"
                ? "border-blue-600 text-blue-700 bg-white"
                : "border-transparent text-gray-500 bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("regression")}
          >
            Regression & Predictive Models
          </button>
          <button
            className={`px-4 py-2 rounded-t font-semibold border-b-2 transition-colors ${
              activeTab === "multivariate"
                ? "border-blue-600 text-blue-700 bg-white"
                : "border-transparent text-gray-500 bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("multivariate")}
          >
            Multivariate & Data Reduction
          </button>
        </div>
      </div>
      {/* Tab content */}
      <div
        style={{ display: activeTab === "descriptives" ? "block" : "none" }}
        ref={tabRefs.descriptives}
      >
        <DescriptivesTab
          numRespondents={numRespondents}
          avgAge={avgAge}
          genderCounts={genderCounts}
          mockTTest={() => tTestValue}
          barChartData={barChartData}
          questions={questions}
        />
      </div>
      <div
        style={{ display: activeTab === "correlation" ? "block" : "none" }}
        ref={tabRefs.correlation}
      >
        {activeTab === "correlation" && <CorrelationTab />}
      </div>
      <div
        style={{ display: activeTab === "anova" ? "block" : "none" }}
        ref={tabRefs.anova}
      >
        {activeTab === "anova" && <AnovaGlmTab />}
      </div>
      <div
        style={{ display: activeTab === "regression" ? "block" : "none" }}
        ref={tabRefs.regression}
      >
        {activeTab === "regression" && <RegressionTab />}
      </div>
      <div
        style={{ display: activeTab === "multivariate" ? "block" : "none" }}
        ref={tabRefs.multivariate}
      >
        {activeTab === "multivariate" && <MultivariateTab />}
      </div>
      {/* Export as PDF section */}
      <div className="mt-8 bg-white border border-gray-200 rounded p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-900">
          Export Analysis as PDF
        </h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const selectedTabs = formData.getAll("tabs") as string[];
            if (selectedTabs.length === 0) {
              alert("Please select at least one tab to export.");
              return;
            }
            const pdf = new jsPDF({ unit: "pt", format: "a4" });
            let y = 60;
            pdf.text(`Survey Analysis: ${survey.title}`, 40, y);
            y += 30;
            pdf.text(`Number of respondents: ${numRespondents}`, 40, y);
            y += 30;
            pdf.text(`Average age: ${avgAge}`, 40, y);
            y += 30;
            pdf.text(`Gender counts: ${JSON.stringify(genderCounts)}`, 40, y);
            y += 40;
            // Export text content of each selected tab
            selectedTabs.forEach((tab, idx) => {
              let text = "";
              if (tab === "descriptives") {
                text = getDescriptivesExportSummary({
                  numRespondents,
                  avgAge,
                  genderCounts,
                  mockTTest: () => tTestValue,
                  barChartData,
                  questions,
                });
              } else if (tab === "correlation") {
                text = getCorrelationExportSummary();
              } else if (tab === "anova") {
                text = getAnovaGlmExportSummary();
              } else if (tab === "regression") {
                text = getRegressionExportSummary();
              } else if (tab === "multivariate") {
                text = getMultivariateExportSummary();
              }
              if (text.trim()) {
                if (idx === 0) {
                  pdf.text(
                    `${tab.charAt(0).toUpperCase() + tab.slice(1)} Tab:`,
                    40,
                    y
                  );
                  y += 30;
                  const lines = pdf.splitTextToSize(
                    text,
                    pdf.internal.pageSize.getWidth() - 80
                  );
                  pdf.text(lines, 40, y);
                } else {
                  pdf.addPage();
                  let pageY = 60;
                  pdf.text(
                    `${tab.charAt(0).toUpperCase() + tab.slice(1)} Tab:`,
                    40,
                    pageY
                  );
                  pageY += 30;
                  const lines = pdf.splitTextToSize(
                    text,
                    pdf.internal.pageSize.getWidth() - 80
                  );
                  pdf.text(lines, 40, pageY);
                }
              }
            });
            pdf.save(`survey-analysis-${id}.pdf`);
          }}
        >
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="tabs"
                value="descriptives"
                id="export-descriptives"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                defaultChecked
              />
              <label
                htmlFor="export-descriptives"
                className="ml-2 text-sm text-gray-700"
              >
                Descriptives & Exploration
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="tabs"
                value="correlation"
                id="export-correlation"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                defaultChecked
              />
              <label
                htmlFor="export-correlation"
                className="ml-2 text-sm text-gray-700"
              >
                Correlation & Association
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="tabs"
                value="anova"
                id="export-anova"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                defaultChecked
              />
              <label
                htmlFor="export-anova"
                className="ml-2 text-sm text-gray-700"
              >
                ANOVA/GLM Family
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="tabs"
                value="regression"
                id="export-regression"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                defaultChecked
              />
              <label
                htmlFor="export-regression"
                className="ml-2 text-sm text-gray-700"
              >
                Regression & Predictive Models
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="tabs"
                value="multivariate"
                id="export-multivariate"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                defaultChecked
              />
              <label
                htmlFor="export-multivariate"
                className="ml-2 text-sm text-gray-700"
              >
                Multivariate & Data Reduction
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold transition-all hover:bg-blue-700"
          >
            Export PDF
          </button>
        </form>
      </div>
    </div>
  );
}

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
import { useRouter } from "next/navigation";
import { BarChart, Users, LineChart, Sigma, Layers3 } from "lucide-react";

export default function SurveyAnalysisPage({ params }: any) {
  // Always call hooks unconditionally
  const resolvedParams = usePromise(
    typeof params.then === "function" ? params : Promise.resolve(params)
  ) as { id: string };

  const router = useRouter();

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

  // Tab definitions with icons
  const tabs = [
    {
      key: "descriptives",
      label: "Descriptives",
      icon: <BarChart className="w-5 h-5 inline-block mr-1" />,
    },
    {
      key: "correlation",
      label: "Correlation",
      icon: <LineChart className="w-5 h-5 inline-block mr-1" />,
    },
    {
      key: "anova",
      label: "ANOVA/GLM",
      icon: <Sigma className="w-5 h-5 inline-block mr-1" />,
    },
    {
      key: "regression",
      label: "Regression",
      icon: <Layers3 className="w-5 h-5 inline-block mr-1" />,
    },
    {
      key: "multivariate",
      label: "Multivariate",
      icon: <Users className="w-5 h-5 inline-block mr-1" />,
    },
  ];

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

  // If the survey doesn't exist, redirect to the first available mock survey
  useEffect(() => {
    if (!survey && mockSurveys.length > 0) {
      router.replace(`/surveyor/analysis/${mockSurveys[0].id}`);
    }
  }, [survey, router]);

  if (!survey) return null; // Prevent rendering until redirect
  if (survey.status === "draft") return notFound();

  return (
    <div className="container mx-auto py-8 px-2 md:px-6">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white tracking-tight">
        Survey Analysis: <span className="text-blue-600">{survey.title}</span>
      </h1>
      {/* Modern Tab Bar */}
      <div className="mb-8 flex justify-center">
        <div className="flex gap-2 bg-white dark:bg-gray-900 rounded-xl shadow p-2 border border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400
                ${
                  activeTab === tab.key
                    ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 shadow"
                    : "text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* Tab content in cards */}
      <div className="max-w-4xl mx-auto">
        <div
          style={{ display: activeTab === "descriptives" ? "block" : "none" }}
          ref={tabRefs.descriptives}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
            <DescriptivesTab
              numRespondents={numRespondents}
              avgAge={avgAge}
              genderCounts={genderCounts}
              mockTTest={() => tTestValue}
              barChartData={barChartData}
              questions={questions}
            />
          </div>
        </div>
        <div
          style={{ display: activeTab === "correlation" ? "block" : "none" }}
          ref={tabRefs.correlation}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
            {activeTab === "correlation" && <CorrelationTab />}
          </div>
        </div>
        <div
          style={{ display: activeTab === "anova" ? "block" : "none" }}
          ref={tabRefs.anova}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
            {activeTab === "anova" && <AnovaGlmTab />}
          </div>
        </div>
        <div
          style={{ display: activeTab === "regression" ? "block" : "none" }}
          ref={tabRefs.regression}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
            {activeTab === "regression" && <RegressionTab />}
          </div>
        </div>
        <div
          style={{ display: activeTab === "multivariate" ? "block" : "none" }}
          ref={tabRefs.multivariate}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
            {activeTab === "multivariate" && <MultivariateTab />}
          </div>
        </div>
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

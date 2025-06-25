/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { notFound } from "next/navigation";
import { mockSurveys } from "@/data/dashboard-data";
import { mockSurveyResults } from "@/data/results-data";
import { use as usePromise, useMemo } from "react";
import { mockRespondentData, MockRespondent } from "@/data/mock-respondents";
import { useState, useRef, useEffect } from "react";
import DescriptivesTab from "@/components/analysis/DescriptivesTab";
import { mockCorrelations } from "@/data/mock-respondents";
import AnovaGlmTab from "@/components/analysis/AnovaGlmTab";
import RegressionTab from "@/components/analysis/RegressionTab";
import MultivariateTab from "@/components/analysis/MultivariateTab";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
    if (!q.options) return [];
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
        {activeTab === "correlation" && (
          <div className="space-y-4">
            <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
              <strong>Pearson Correlation:</strong>
              <span className="ml-2">
                r = {mockCorrelations.pearson.r}, p =
                {mockCorrelations.pearson.p}, n = {mockCorrelations.pearson.n}
              </span>
            </div>
            <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
              <strong>Spearman&apos;s ρ:</strong>
              <span className="ml-2">
                ρ = {mockCorrelations.spearman.rho}, p =
                {mockCorrelations.spearman.p}, n = {mockCorrelations.spearman.n}
              </span>
            </div>
            <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
              <strong>Kendall&apos;s τ-b/τ-c:</strong>
              <span className="ml-2">
                τ-b = {mockCorrelations.kendall.tau_b}, τ-c =
                {mockCorrelations.kendall.tau_c}, p =
                {mockCorrelations.kendall.p}, n = {mockCorrelations.kendall.n}
              </span>
            </div>
            <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
              <strong>Partial Correlation (controlling for weight):</strong>
              <span className="ml-2">
                r = {mockCorrelations.partial.r}, p =
                {mockCorrelations.partial.p}, n = {mockCorrelations.partial.n}
              </span>
            </div>
            <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
              <strong>Point-Biserial:</strong>
              <span className="ml-2">
                r<sub>pb</sub> = {mockCorrelations.pointBiserial.r_pb}, p =
                {mockCorrelations.pointBiserial.p}, n =
                {mockCorrelations.pointBiserial.n}
              </span>
            </div>
          </div>
        )}
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
            let y = 40;
            for (const tab of selectedTabs) {
              const ref = tabRefs[tab as keyof typeof tabRefs];
              if (ref && ref.current) {
                // Temporarily show the tab if not visible
                const prevDisplay = ref.current.style.display;
                ref.current.style.display = "block";
                // Preprocess all elements to replace oklch() in style attributes
                const elements: Array<{ el: HTMLElement; prevStyle: string }> =
                  [];
                function replaceOklchStyles(el: HTMLElement) {
                  const prevStyle = el.getAttribute("style") || "";
                  let newStyle = prevStyle;
                  // Replace oklch() in style attribute
                  newStyle = newStyle.replace(/oklch\([^)]*\)/g, "#111");
                  if (newStyle !== prevStyle) {
                    el.setAttribute("style", newStyle);
                    elements.push({ el, prevStyle });
                  }
                  // Also patch computed style if needed
                  const computed = window.getComputedStyle(el);
                  if (computed.color.includes("oklch")) {
                    el.style.color = "#111";
                  }
                  if (computed.backgroundColor.includes("oklch")) {
                    el.style.backgroundColor = "#fff";
                  }
                  Array.from(el.children).forEach((child) =>
                    replaceOklchStyles(child as HTMLElement)
                  );
                }
                replaceOklchStyles(ref.current);
                await new Promise((resolve) => setTimeout(resolve, 100));
                const canvas = await html2canvas(ref.current, { scale: 2 });
                const imgData = canvas.toDataURL("image/png");
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth() - 40;
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                if (y + pdfHeight > pdf.internal.pageSize.getHeight() - 40) {
                  pdf.addPage();
                  y = 40;
                }
                pdf.addImage(imgData, "PNG", 20, y, pdfWidth, pdfHeight);
                y += pdfHeight + 20;
                // Restore original style attributes and hide the tab again if it was hidden
                for (const { el, prevStyle } of elements) {
                  el.setAttribute("style", prevStyle);
                }
                ref.current.style.display = prevDisplay;
              }
            }
            pdf.save(`survey-analysis-${id}.pdf`);
          }}
        >
          <div className="flex flex-col gap-2 mb-4">
            {/*
             * Checkbox options for each tab
             */}
            {(
              [
                { key: "descriptives", label: "Descriptives & Exploration" },
                { key: "correlation", label: "Correlation & Association" },
                { key: "anova", label: "ANOVA/GLM Family" },
                { key: "regression", label: "Regression & Predictive Models" },
                { key: "multivariate", label: "Multivariate & Data Reduction" },
              ] as const
            ).map((tab) => (
              <label key={tab.key} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="tabs"
                  value={tab.key}
                  defaultChecked
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-900">{tab.label}</span>
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
          >
            Export Selected Tabs as PDF
          </button>
        </form>
      </div>
    </div>
  );
}

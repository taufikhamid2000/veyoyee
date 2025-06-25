/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import {
  mockDescriptives,
  mockFrequencies,
  mockBoxPlot,
  mockStemAndLeaf,
  mockNormality,
  mockCrosstabs,
  mockWeights,
  mockSplitGroups,
} from "@/data/mock-respondents";

interface Props {
  numRespondents: number;
  avgAge: string | number;
  genderCounts: Record<string, number>;
  mockTTest: () => string;
  barChartData: [string, number][];
  questions: any[];
}

const DescriptivesTab: React.FC<Props> = ({
  numRespondents,
  avgAge,
  genderCounts,
  mockTTest,
  barChartData,
  questions,
}) => (
  <>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Total Accepted Responses:</strong>
      <span className="ml-2">{numRespondents}</span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Average Age:</strong> <span className="ml-2">{avgAge}</span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Gender Breakdown:</strong>
      <ul className="ml-4 list-disc">
        {Object.entries(genderCounts).map(([gender, count]) => (
          <li key={gender} className="text-gray-900">
            {String(gender)}: {String(count)}
          </li>
        ))}
      </ul>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Mock t-test (Q1):</strong>
      <span className="ml-2">p = {mockTTest()}</span>
    </div>
    {barChartData.length > 0 && (
      <div className="mb-8 bg-white border border-gray-200 rounded p-3">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">
          Bar Chart: {questions[0]?.questionText}
        </h2>
        <div className="flex items-end gap-4 h-40">
          {barChartData.map(([option, count]) => (
            <div key={option} className="flex flex-col items-center">
              <div
                className="bg-blue-500 dark:bg-blue-400 w-8 rounded-t"
                style={{
                  height: `${
                    (Number(count) / (numRespondents || 1)) * 120 || 4
                  }px`,
                }}
                title={`${count} responses`}
              ></div>
              <span className="text-xs mt-1 text-gray-900">{option}</span>
              <span className="text-xs text-gray-500">{count}</span>
            </div>
          ))}
        </div>
      </div>
    )}
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Descriptives (Age):</strong>
      <span className="ml-2">
        Mean: {mockDescriptives.age.mean}, SD: {mockDescriptives.age.sd}, Min:
        {mockDescriptives.age.min}, Max: {mockDescriptives.age.max}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Frequencies (Gender):</strong>
      <ul className="ml-4 list-disc">
        {Object.entries(mockFrequencies.gender).map(([gender, val]) => (
          <li key={gender} className="text-gray-900">
            {gender}: {(val as { count: number; percent: number }).count} (
            {(val as { count: number; percent: number }).percent}%)
          </li>
        ))}
      </ul>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Box-Plot (Age):</strong>
      <span className="ml-2">
        Min: {mockBoxPlot.age.min}, Q1: {mockBoxPlot.age.q1}, Median:
        {mockBoxPlot.age.median}, Q3: {mockBoxPlot.age.q3}, Max:
        {mockBoxPlot.age.max}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Stem-and-Leaf (Age):</strong>
      <pre className="ml-4 text-xs bg-gray-100 p-2 rounded inline-block text-gray-900">
        {mockStemAndLeaf.age}
      </pre>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Normality (Shapiro-Wilk, Age):</strong>
      <span className="ml-2">
        W = {mockNormality.age.statistic}, p = {mockNormality.age.p}, Normal:
        {mockNormality.age.normal ? "Yes" : "No"}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Crosstabs (Gender × Group):</strong>
      <div className="overflow-x-auto">
        <table className="min-w-fit border border-gray-300 text-xs bg-white text-gray-900">
          <thead>
            <tr>
              <th className="border px-2 py-1">Group</th>
              {Object.keys(mockCrosstabs.genderByGroup.table.A).map(
                (gender) => (
                  <th key={gender} className="border px-2 py-1">
                    {gender}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {Object.entries(mockCrosstabs.genderByGroup.table).map(
              ([group, row]) => (
                <tr key={group}>
                  <td className="border px-2 py-1 font-semibold">{group}</td>
                  {Object.values(row as Record<string, number>).map(
                    (val, i) => (
                      <td key={i} className="border px-2 py-1">
                        {String(val)}
                      </td>
                    )
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-1 text-xs">
        χ² = {mockCrosstabs.genderByGroup.chi2}, p =
        {mockCrosstabs.genderByGroup.p}, Phi = {mockCrosstabs.genderByGroup.phi}
        , Cramer&apos;s V = {mockCrosstabs.genderByGroup.cramersV}
      </div>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Weight Cases:</strong>
      <span className="ml-2">
        {mockWeights.map((w) => `${w.id}: ${w.weight ?? "-"}`).join(", ")}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Split File (Groups):</strong>
      <span className="ml-2">{mockSplitGroups.join(", ")}</span>
    </div>
  </>
);

// Export summary function for PDF/text export
export function getDescriptivesExportSummary({
  numRespondents,
  avgAge,
  genderCounts,
  mockTTest,
  barChartData,
  questions,
}: {
  numRespondents: number;
  avgAge: string | number;
  genderCounts: Record<string, number>;
  mockTTest: () => string;
  barChartData: [string, number][];
  questions: any[];
}) {
  const lines = [
    `Total Accepted Responses: ${numRespondents}`,
    `Average Age: ${avgAge}`,
    `Gender Breakdown: ${Object.entries(genderCounts)
      .map(([g, c]) => `${g}: ${c}`)
      .join(", ")}`,
    `Mock t-test (Q1): p = ${mockTTest()}`,
  ];
  if (barChartData.length > 0) {
    lines.push(
      `Bar Chart: ${questions[0]?.questionText || ""}`,
      ...barChartData.map(([option, count]) => `  ${option}: ${count}`)
    );
  }
  lines.push(
    `Descriptives (Age): Mean: ${mockDescriptives.age.mean}, SD: ${mockDescriptives.age.sd}, Min: ${mockDescriptives.age.min}, Max: ${mockDescriptives.age.max}`,
    `Frequencies (Gender): ${Object.entries(mockFrequencies.gender)
      .map(
        ([gender, val]) =>
          `${gender}: ${(val as { count: number; percent: number }).count} (${
            (val as { count: number; percent: number }).percent
          }%)`
      )
      .join(", ")}`,
    `Box-Plot (Age): Min: ${mockBoxPlot.age.min}, Q1: ${mockBoxPlot.age.q1}, Median: ${mockBoxPlot.age.median}, Q3: ${mockBoxPlot.age.q3}, Max: ${mockBoxPlot.age.max}`,
    `Stem-and-Leaf (Age):\n${mockStemAndLeaf.age}`,
    `Normality (Shapiro-Wilk, Age): W = ${mockNormality.age.statistic}, p = ${
      mockNormality.age.p
    }, Normal: ${mockNormality.age.normal ? "Yes" : "No"}`,
    `Crosstabs (Gender × Group):`,
    ...Object.entries(mockCrosstabs.genderByGroup.table).map(
      ([group, row]) =>
        `  ${group}: ${Object.entries(row as Record<string, number>)
          .map(([g, v]) => `${g}: ${v}`)
          .join(", ")}`
    ),
    `  χ² = ${mockCrosstabs.genderByGroup.chi2}, p = ${mockCrosstabs.genderByGroup.p}, Phi = ${mockCrosstabs.genderByGroup.phi}, Cramer's V = ${mockCrosstabs.genderByGroup.cramersV}`,
    `Weight Cases: ${mockWeights
      .map((w) => `${w.id}: ${w.weight ?? "-"}`)
      .join(", ")}`,
    `Split File (Groups): ${mockSplitGroups.join(", ")}`
  );
  return lines.join("\n");
}

export default DescriptivesTab;

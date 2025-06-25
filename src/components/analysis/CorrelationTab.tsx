/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { mockCorrelations } from "@/data/mock-respondents";

const CorrelationTab: React.FC = () => (
  <div className="space-y-4">
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Pearson Correlation:</strong>
      <span className="ml-2">
        r = {mockCorrelations.pearson.r}, p = {mockCorrelations.pearson.p}, n =
        {mockCorrelations.pearson.n}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Spearman's ρ:</strong>
      <span className="ml-2">
        ρ = {mockCorrelations.spearman.rho}, p = {mockCorrelations.spearman.p},
        n = {mockCorrelations.spearman.n}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Kendall's τ-b/τ-c:</strong>
      <span className="ml-2">
        τ-b = {mockCorrelations.kendall.tau_b}, τ-c =
        {mockCorrelations.kendall.tau_c}, p = {mockCorrelations.kendall.p}, n =
        {mockCorrelations.kendall.n}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Partial Correlation (controlling for weight):</strong>
      <span className="ml-2">
        r = {mockCorrelations.partial.r}, p = {mockCorrelations.partial.p}, n =
        {mockCorrelations.partial.n}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Point-Biserial:</strong>
      <span className="ml-2">
        r_pb = {mockCorrelations.pointBiserial.r_pb}, p =
        {mockCorrelations.pointBiserial.p}, n =
        {mockCorrelations.pointBiserial.n}
      </span>
    </div>
  </div>
);

// Export summary function for PDF/text export
export function getCorrelationExportSummary() {
  return [
    `Pearson Correlation: r = ${mockCorrelations.pearson.r}, p = ${mockCorrelations.pearson.p}, n = ${mockCorrelations.pearson.n}`,
    `Spearman's ρ: ρ = ${mockCorrelations.spearman.rho}, p = ${mockCorrelations.spearman.p}, n = ${mockCorrelations.spearman.n}`,
    `Kendall's τ-b/τ-c: τ-b = ${mockCorrelations.kendall.tau_b}, τ-c = ${mockCorrelations.kendall.tau_c}, p = ${mockCorrelations.kendall.p}, n = ${mockCorrelations.kendall.n}`,
    `Partial Correlation (controlling for weight): r = ${mockCorrelations.partial.r}, p = ${mockCorrelations.partial.p}, n = ${mockCorrelations.partial.n}`,
    `Point-Biserial: r_pb = ${mockCorrelations.pointBiserial.r_pb}, p = ${mockCorrelations.pointBiserial.p}, n = ${mockCorrelations.pointBiserial.n}`,
  ].join("\n");
}

export default CorrelationTab;

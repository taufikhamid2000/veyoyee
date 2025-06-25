/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { mockAnovaGlm } from "@/data/mock-respondents";

const AnovaGlmTab: React.FC = () => (
  <div className="space-y-4">
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>One-Way ANOVA:</strong>
      <span className="ml-2">
        Groups: {mockAnovaGlm.oneWayAnova.groups.join(", ")}, Means:
        {mockAnovaGlm.oneWayAnova.means.join(", ")}, F =
        {mockAnovaGlm.oneWayAnova.F}, df = {mockAnovaGlm.oneWayAnova.dfBetween},
        {mockAnovaGlm.oneWayAnova.dfWithin}, p = {mockAnovaGlm.oneWayAnova.p},
        η² = {mockAnovaGlm.oneWayAnova.etaSquared}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Factorial ANOVA:</strong>
      <span className="ml-2">
        Factors: {mockAnovaGlm.factorialAnova.factors.join(", ")}, Means:
        {Object.entries(mockAnovaGlm.factorialAnova.means)
          .map(
            ([gender, means]) =>
              `${gender}: ${Object.entries(means as Record<string, number>)
                .map(([g, m]) => `${g}=${m}`)
                .join(", ")}`
          )
          .join("; ")}
        , F = {mockAnovaGlm.factorialAnova.F}, df =
        {mockAnovaGlm.factorialAnova.df.join(", ")}, p =
        {mockAnovaGlm.factorialAnova.p}, Interaction F =
        {mockAnovaGlm.factorialAnova.interactionF}, Interaction p =
        {mockAnovaGlm.factorialAnova.interactionP}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Repeated-Measures ANOVA:</strong>
      <span className="ml-2">
        Levels: {mockAnovaGlm.repeatedMeasuresAnova.levels.join(", ")}, Means:
        {mockAnovaGlm.repeatedMeasuresAnova.means.join(", ")}, F =
        {mockAnovaGlm.repeatedMeasuresAnova.F}, df =
        {mockAnovaGlm.repeatedMeasuresAnova.df.join(", ")}, p =
        {mockAnovaGlm.repeatedMeasuresAnova.p}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>MANOVA:</strong>
      <span className="ml-2">
        DVs: {mockAnovaGlm.manova.DVs.join(", ")}, Wilks' Lambda =
        {mockAnovaGlm.manova.WilksLambda}, F = {mockAnovaGlm.manova.F}, df =
        {mockAnovaGlm.manova.df.join(", ")}, p = {mockAnovaGlm.manova.p}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>MANCOVA:</strong>
      <span className="ml-2">
        DVs: {mockAnovaGlm.mancova.DVs.join(", ")}, Covariates:
        {mockAnovaGlm.mancova.covariates.join(", ")}, Wilks' Lambda =
        {mockAnovaGlm.mancova.WilksLambda}, F = {mockAnovaGlm.mancova.F}, df =
        {mockAnovaGlm.mancova.df.join(", ")}, p = {mockAnovaGlm.mancova.p}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>ANCOVA:</strong>
      <span className="ml-2">
        DV: {mockAnovaGlm.ancova.DV}, Covariate: {mockAnovaGlm.ancova.covariate}
        , F = {mockAnovaGlm.ancova.F}, df = {mockAnovaGlm.ancova.df.join(", ")},
        p = {mockAnovaGlm.ancova.p}, η² = {mockAnovaGlm.ancova.etaSquared}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>General Linear Model (GLM):</strong>
      <span className="ml-2">
        Predictors: {mockAnovaGlm.glm.predictors.join(", ")}, R² =
        {mockAnovaGlm.glm.R2}, F = {mockAnovaGlm.glm.F}, df =
        {mockAnovaGlm.glm.df.join(", ")}, p = {mockAnovaGlm.glm.p}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Levene's Test:</strong>
      <span className="ml-2">
        Statistic = {mockAnovaGlm.levene.statistic}, df =
        {mockAnovaGlm.levene.df.join(", ")}, p = {mockAnovaGlm.levene.p}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Post Hoc Tests:</strong>
      <div className="ml-2">
        <div>
          <strong>Tukey:</strong>
          {mockAnovaGlm.postHoc.tukey
            .map((t) => `${t.comparison}: p = ${t.p}`)
            .join(", ")}
        </div>
        <div>
          <strong>Bonferroni:</strong>
          {mockAnovaGlm.postHoc.bonferroni
            .map((t) => `${t.comparison}: p = ${t.p}`)
            .join(", ")}
        </div>
        <div>
          <strong>Scheffé:</strong>
          {mockAnovaGlm.postHoc.scheffe
            .map((t) => `${t.comparison}: p = ${t.p}`)
            .join(", ")}
        </div>
      </div>
    </div>
  </div>
);

export default AnovaGlmTab;

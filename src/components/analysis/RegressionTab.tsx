"use client";
import React from "react";
import { mockRegression } from "@/data/mock-respondents";

const RegressionTab: React.FC = () => (
  <div className="space-y-4">
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Linear Regression:</strong>
      <span className="ml-2">
        Predictors: {mockRegression.linear.predictors.join(", ")}, Coefficients:
        {Object.entries(mockRegression.linear.coefficients)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ")}
        , R² = {mockRegression.linear.R2}, Adj. R² =
        {mockRegression.linear.adjR2}, F = {mockRegression.linear.F}, df =
        {mockRegression.linear.df.join(", ")}, p = {mockRegression.linear.p}
      </span>
      <div className="text-xs mt-1">
        Durbin–Watson: {mockRegression.linear.durbinWatson}, Collinearity:
        {Object.entries(mockRegression.linear.collinearity)
          .map(([k, v]) => `${k} (VIF: ${v.VIF}, Tol: ${v.tolerance})`)
          .join(", ")}
      </div>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Binary Logistic Regression:</strong>
      <span className="ml-2">
        Predictors: {mockRegression.binaryLogistic.predictors.join(", ")},
        Coefficients:
        {Object.entries(mockRegression.binaryLogistic.coefficients)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ")}
        , Cox & Snell R² = {mockRegression.binaryLogistic.CoxSnellR2},
        Nagelkerke R² = {mockRegression.binaryLogistic.NagelkerkeR2}, χ² =
        {mockRegression.binaryLogistic.chi2}, df =
        {mockRegression.binaryLogistic.df}, p ={mockRegression.binaryLogistic.p}
        , AUC ={mockRegression.binaryLogistic.auc}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Multinomial Logistic Regression:</strong>
      <span className="ml-2">
        Predictors: {mockRegression.multinomialLogistic.predictors.join(", ")},
        Classes: {mockRegression.multinomialLogistic.classes.join(", ")},
        Coefficients:
        {Object.entries(mockRegression.multinomialLogistic.coefficients)
          .map(
            ([cls, coefs]) =>
              `${cls}: ${Object.entries(coefs as Record<string, number>)
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ")}`
          )
          .join("; ")}
        , χ² = {mockRegression.multinomialLogistic.chi2}, df =
        {mockRegression.multinomialLogistic.df}, p =
        {mockRegression.multinomialLogistic.p}, AUC =
        {mockRegression.multinomialLogistic.auc}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Ordinal Regression:</strong>
      <span className="ml-2">
        Predictors: {mockRegression.ordinal.predictors.join(", ")},
        Coefficients:
        {Object.entries(mockRegression.ordinal.coefficients)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ")}
        , χ² = {mockRegression.ordinal.chi2}, df = {mockRegression.ordinal.df},
        p = {mockRegression.ordinal.p}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Probit Regression:</strong>
      <span className="ml-2">
        Predictors: {mockRegression.probit.predictors.join(", ")}, Coefficients:
        {Object.entries(mockRegression.probit.coefficients)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ")}
        , χ² = {mockRegression.probit.chi2}, df = {mockRegression.probit.df}, p
        = {mockRegression.probit.p}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Stepwise/Forward/Backward Selection:</strong>
      <span className="ml-2">
        Method: {mockRegression.stepwise.method}, Steps:
        {mockRegression.stepwise.steps
          .map(
            (s, i) =>
              `Step ${i + 1}: [${s.included.join(", ")}] R² = ${s.R2}, p = ${
                s.p
              }`
          )
          .join("; ")}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Durbin–Watson:</strong>
      <span className="ml-2">{mockRegression.durbinWatson}</span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>Collinearity Diagnostics:</strong>
      <span className="ml-2">
        {Object.entries(mockRegression.collinearity)
          .map(([k, v]) => `${k} (VIF: ${v.VIF}, Tol: ${v.tolerance})`)
          .join(", ")}
      </span>
    </div>
    <div className="mb-4 text-gray-900 bg-white border border-gray-200 rounded p-3">
      <strong>ROC Curve / AUC:</strong>
      <span className="ml-2">AUC = {mockRegression.binaryLogistic.auc}</span>
      {/* ROC Points display removed because mockRegression.roc does not exist */}
    </div>
  </div>
);

// Export summary function for PDF/text export
export function getRegressionExportSummary() {
  const lines = [];
  // Linear Regression
  lines.push("Linear Regression:");
  lines.push(`  Predictors: ${mockRegression.linear.predictors.join(", ")}`);
  lines.push(
    `  Coefficients: ${Object.entries(mockRegression.linear.coefficients)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ")}`
  );
  lines.push(
    `  R² = ${mockRegression.linear.R2}, Adj. R² = ${
      mockRegression.linear.adjR2
    }, F = ${mockRegression.linear.F}, df = ${mockRegression.linear.df.join(
      ", "
    )}, p = ${mockRegression.linear.p}`
  );
  lines.push(`  Durbin–Watson: ${mockRegression.linear.durbinWatson}`);
  lines.push(
    `  Collinearity: ${Object.entries(mockRegression.linear.collinearity)
      .map(([k, v]) => `${k} (VIF: ${v.VIF}, Tol: ${v.tolerance})`)
      .join(", ")}`
  );
  // Binary Logistic Regression
  lines.push("\nBinary Logistic Regression:");
  lines.push(
    `  Predictors: ${mockRegression.binaryLogistic.predictors.join(", ")}`
  );
  lines.push(
    `  Coefficients: ${Object.entries(
      mockRegression.binaryLogistic.coefficients
    )
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ")}`
  );
  lines.push(
    `  Cox & Snell R² = ${mockRegression.binaryLogistic.CoxSnellR2}, Nagelkerke R² = ${mockRegression.binaryLogistic.NagelkerkeR2}, χ² = ${mockRegression.binaryLogistic.chi2}, df = ${mockRegression.binaryLogistic.df}, p = ${mockRegression.binaryLogistic.p}, AUC = ${mockRegression.binaryLogistic.auc}`
  );
  // Multinomial Logistic Regression
  lines.push("\nMultinomial Logistic Regression:");
  lines.push(
    `  Predictors: ${mockRegression.multinomialLogistic.predictors.join(", ")}`
  );
  lines.push(
    `  Classes: ${mockRegression.multinomialLogistic.classes.join(", ")}`
  );
  lines.push(
    `  Coefficients: ${Object.entries(
      mockRegression.multinomialLogistic.coefficients
    )
      .map(
        ([cls, coefs]) =>
          `${cls}: ${Object.entries(coefs as Record<string, number>)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ")}`
      )
      .join("; ")}`
  );
  lines.push(
    `  χ² = ${mockRegression.multinomialLogistic.chi2}, df = ${mockRegression.multinomialLogistic.df}, p = ${mockRegression.multinomialLogistic.p}, AUC = ${mockRegression.multinomialLogistic.auc}`
  );
  // Ordinal Regression
  lines.push("\nOrdinal Regression:");
  lines.push(`  Predictors: ${mockRegression.ordinal.predictors.join(", ")}`);
  lines.push(
    `  Coefficients: ${Object.entries(mockRegression.ordinal.coefficients)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ")}`
  );
  lines.push(
    `  χ² = ${mockRegression.ordinal.chi2}, df = ${mockRegression.ordinal.df}, p = ${mockRegression.ordinal.p}`
  );
  // Probit Regression
  lines.push("\nProbit Regression:");
  lines.push(`  Predictors: ${mockRegression.probit.predictors.join(", ")}`);
  lines.push(
    `  Coefficients: ${Object.entries(mockRegression.probit.coefficients)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ")}`
  );
  lines.push(
    `  χ² = ${mockRegression.probit.chi2}, df = ${mockRegression.probit.df}, p = ${mockRegression.probit.p}`
  );
  // Stepwise/Forward/Backward Selection
  lines.push("\nStepwise/Forward/Backward Selection:");
  lines.push(`  Method: ${mockRegression.stepwise.method}`);
  lines.push(
    `  Steps: ${mockRegression.stepwise.steps
      .map(
        (s, i) =>
          `Step ${i + 1}: [${s.included.join(", ")}] R² = ${s.R2}, p = ${s.p}`
      )
      .join("; ")}`
  );
  // Durbin–Watson (global)
  lines.push(`\nDurbin–Watson: ${mockRegression.durbinWatson}`);
  // Collinearity Diagnostics (global)
  lines.push(
    `Collinearity Diagnostics: ${Object.entries(mockRegression.collinearity)
      .map(([k, v]) => `${k} (VIF: ${v.VIF}, Tol: ${v.tolerance})`)
      .join(", ")}`
  );
  // ROC Curve / AUC
  lines.push(`ROC Curve / AUC: AUC = ${mockRegression.binaryLogistic.auc}`);
  return lines.join("\n");
}

export default RegressionTab;

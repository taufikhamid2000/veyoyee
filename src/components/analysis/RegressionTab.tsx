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

export default RegressionTab;

"use client";
import React from "react";
import {
  mockFactorAnalysis,
  mockPCA,
  mockReliability,
  mockDiscriminant,
  mockCluster,
  mockCorrespondence,
  mockOptimalScaling,
} from "@/data/mock-respondents";

const MultivariateTab: React.FC = () => (
  <div className="space-y-6">
    {/* Factor Analysis */}
    <section className="bg-white border border-gray-200 rounded p-4 text-gray-900">
      <h2 className="font-semibold text-lg mb-2 text-gray-900">
        Factor Analysis
      </h2>
      <div>
        Method: {mockFactorAnalysis.method} ({mockFactorAnalysis.rotation}
        rotation)
      </div>
      <div>Factors Extracted: {mockFactorAnalysis.nFactors}</div>
      <div>Eigenvalues: {mockFactorAnalysis.eigenvalues.join(", ")}</div>
      <div>
        Explained Variance (%):
        {mockFactorAnalysis.explainedVariance.join(", ")}
      </div>
      <div>Communalities:</div>
      <ul className="ml-4 list-disc">
        {Object.entries(mockFactorAnalysis.communalities).map(([item, val]) => (
          <li key={item}>
            {item}: {val}
          </li>
        ))}
      </ul>
      <div>Loadings:</div>
      <table className="min-w-fit border border-gray-300 text-xs bg-white text-gray-900 mt-1">
        <thead>
          <tr>
            <th className="border px-2 py-1">Factor</th>
            {Object.keys(mockFactorAnalysis.loadings.Factor1).map((item) => (
              <th key={item} className="border px-2 py-1">
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(mockFactorAnalysis.loadings).map(
            ([factor, items]) => (
              <tr key={factor}>
                <td className="border px-2 py-1 font-semibold">{factor}</td>
                {Object.values(items).map((val, i) => (
                  <td key={i} className="border px-2 py-1">
                    {val}
                  </td>
                ))}
              </tr>
            )
          )}
        </tbody>
      </table>
    </section>

    {/* PCA */}
    <section className="bg-white border border-gray-200 rounded p-4 text-gray-900">
      <h2 className="font-semibold text-lg mb-2 text-gray-900">
        Principal Component Analysis (PCA)
      </h2>
      <div>Components: {mockPCA.nComponents}</div>
      <div>Eigenvalues: {mockPCA.eigenvalues.join(", ")}</div>
      <div>Explained Variance (%): {mockPCA.explainedVariance.join(", ")}</div>
      <div>Component Loadings:</div>
      <table className="min-w-fit border border-gray-300 text-xs bg-white text-gray-900 mt-1">
        <thead>
          <tr>
            <th className="border px-2 py-1">Component</th>
            {Object.keys(mockPCA.componentLoadings.PC1).map((item) => (
              <th key={item} className="border px-2 py-1">
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(mockPCA.componentLoadings).map(([pc, items]) => (
            <tr key={pc}>
              <td className="border px-2 py-1 font-semibold">{pc}</td>
              {Object.values(items).map((val, i) => (
                <td key={i} className="border px-2 py-1">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>Scores: {mockPCA.scores.join(", ")}</div>
    </section>

    {/* Reliability Analysis */}
    <section className="bg-white border border-gray-200 rounded p-4 text-gray-900">
      <h2 className="font-semibold text-lg mb-2 text-gray-900">
        Reliability Analysis
      </h2>
      <div>Cronbach&apos;s α: {mockReliability.cronbachAlpha}</div>
      <div>Number of Items: {mockReliability.nItems}</div>
      <div>Item-Total Correlation:</div>
      <ul className="ml-4 list-disc">
        {Object.entries(mockReliability.itemTotalCorrelation).map(
          ([item, val]) => (
            <li key={item}>
              {item}: {val}
            </li>
          )
        )}
      </ul>
      <div>α if Item Deleted:</div>
      <ul className="ml-4 list-disc">
        {Object.entries(mockReliability.alphaIfItemDeleted).map(
          ([item, val]) => (
            <li key={item}>
              {item}: {val}
            </li>
          )
        )}
      </ul>
    </section>

    {/* Discriminant Analysis */}
    <section className="bg-white border border-gray-200 rounded p-4 text-gray-900">
      <h2 className="font-semibold text-lg mb-2 text-gray-900">
        Discriminant Analysis
      </h2>
      <div>Groups: {mockDiscriminant.groups.join(", ")}</div>
      <div>Canonical Correlation: {mockDiscriminant.canonicalCorrelation}</div>
      <div>Eigenvalue: {mockDiscriminant.eigenvalue}</div>
      <div>Wilks&apos; Lambda: {mockDiscriminant.wilksLambda}</div>
      <div>
        χ²: {mockDiscriminant.chi2}, df: {mockDiscriminant.df}, p:
        {mockDiscriminant.p}
      </div>
      <div>Standardized Coefficients:</div>
      <ul className="ml-4 list-disc">
        {Object.entries(mockDiscriminant.standardizedCoefficients).map(
          ([item, val]) => (
            <li key={item}>
              {item}: {val}
            </li>
          )
        )}
      </ul>
      <div>
        Group Centroids:
        {Object.entries(mockDiscriminant.groupCentroids)
          .map(([g, v]) => `${g}: ${v}`)
          .join(", ")}
      </div>
      <div>
        Classification Accuracy: {mockDiscriminant.classificationAccuracy}%
      </div>
    </section>

    {/* Cluster Analysis */}
    <section className="bg-white border border-gray-200 rounded p-4 text-gray-900">
      <h2 className="font-semibold text-lg mb-2 text-gray-900">
        Cluster Analysis
      </h2>
      <div>Method: {mockCluster.method}</div>
      <div>Clusters: {mockCluster.nClusters}</div>
      <div>Cluster Sizes: {mockCluster.clusterSizes.join(", ")}</div>
      <div>Centroids:</div>
      <table className="min-w-fit border border-gray-300 text-xs bg-white text-gray-900 mt-1">
        <thead>
          <tr>
            <th className="border px-2 py-1">Cluster</th>
            {Object.keys(mockCluster.centroids.Cluster1).map((item) => (
              <th key={item} className="border px-2 py-1">
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(mockCluster.centroids).map(([cluster, items]) => (
            <tr key={cluster}>
              <td className="border px-2 py-1 font-semibold">{cluster}</td>
              {Object.values(items).map((val, i) => (
                <td key={i} className="border px-2 py-1">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>Assignments: {mockCluster.assignments.join(", ")}</div>
      <div>Silhouette: {mockCluster.silhouette}</div>
    </section>

    {/* Correspondence Analysis */}
    <section className="bg-white border border-gray-200 rounded p-4 text-gray-900">
      <h2 className="font-semibold text-lg mb-2 text-gray-900">
        Correspondence Analysis
      </h2>
      <div>Rows: {mockCorrespondence.rowLabels.join(", ")}</div>
      <div>Columns: {mockCorrespondence.colLabels.join(", ")}</div>
      <div>Table:</div>
      <table className="min-w-fit border border-gray-300 text-xs bg-white text-gray-900 mt-1">
        <thead>
          <tr>
            <th className="border px-2 py-1"> </th>
            {mockCorrespondence.colLabels.map((col) => (
              <th key={col} className="border px-2 py-1">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mockCorrespondence.rowLabels.map((row, i) => (
            <tr key={row}>
              <td className="border px-2 py-1 font-semibold">{row}</td>
              {mockCorrespondence.table[i].map((val, j) => (
                <td key={j} className="border px-2 py-1">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>Inertia: {mockCorrespondence.inertia}</div>
      <div>
        Dim 1 (row): {mockCorrespondence.dim1.row.join(", ")}, (col):
        {mockCorrespondence.dim1.col.join(", ")}
      </div>
      <div>
        Dim 2 (row): {mockCorrespondence.dim2.row.join(", ")}, (col):
        {mockCorrespondence.dim2.col.join(", ")}
      </div>
    </section>

    {/* Optimal Scaling / CATREG */}
    <section className="bg-white border border-gray-200 rounded p-4 text-gray-900">
      <h2 className="font-semibold text-lg mb-2 text-gray-900">
        Optimal Scaling / CATREG
      </h2>
      <div>Method: {mockOptimalScaling.method}</div>
      <div>Predictors: {mockOptimalScaling.predictors.join(", ")}</div>
      <div>Transformed Predictors:</div>
      <ul className="ml-4 list-disc">
        {Object.entries(mockOptimalScaling.transformedPredictors).map(
          ([pred, levels]) => (
            <li key={pred}>
              {pred}:
              {Object.entries(levels)
                .map(([lvl, val]) => `${lvl}: ${val}`)
                .join(", ")}
            </li>
          )
        )}
      </ul>
      <div>
        Coefficients:
        {Object.entries(mockOptimalScaling.coefficients)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ")}
      </div>
      <div>
        R²: {mockOptimalScaling.R2}, F: {mockOptimalScaling.F}, df:
        {mockOptimalScaling.df.join(", ")}, p: {mockOptimalScaling.p}
      </div>
    </section>
  </div>
);

export default MultivariateTab;

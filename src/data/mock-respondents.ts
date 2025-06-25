// Mock respondent demographics for analysis
export interface MockRespondent {
  id: string;
  age: number;
  gender: string;
  group?: string; // For split file/group analysis
  weight?: number; // For weighted analysis
}

export const mockRespondentData: MockRespondent[] = [
  { id: "r1", age: 25, gender: "Male", group: "A", weight: 1.2 },
  { id: "r2", age: 32, gender: "Female", group: "B", weight: 0.8 },
  { id: "r3", age: 28, gender: "Male", group: "A", weight: 1.0 },
  { id: "r4", age: 41, gender: "Female", group: "B", weight: 1.1 },
  { id: "r5", age: 36, gender: "Other", group: "A", weight: 0.9 },
  // ...add more as needed
];

// --- MOCKS FOR ADVANCED EXPLORATION & DESCRIPTIVES ---

// Frequencies: counts and percentages for a categorical variable (e.g., gender)
export const mockFrequencies = {
  gender: {
    Male: { count: 2, percent: 40 },
    Female: { count: 2, percent: 40 },
    Other: { count: 1, percent: 20 },
  },
};

// Descriptives: mean, SD, min, max for a numeric variable (e.g., age)
export const mockDescriptives = {
  age: {
    mean: 32.4,
    sd: 6.0,
    min: 25,
    max: 41,
  },
};

// Box-plot data for age (for visualization)
export const mockBoxPlot = {
  age: {
    min: 25,
    q1: 28,
    median: 32,
    q3: 36,
    max: 41,
    outliers: [],
  },
};

// Stem-and-leaf (as string for display)
export const mockStemAndLeaf = {
  age: `2 | 5 8\n3 | 2 6\n4 | 1`,
};

// Normality check (Shapiro-Wilk test)
export const mockNormality = {
  age: {
    statistic: 0.97,
    p: 0.72,
    normal: true,
  },
};

// Crosstabs (contingency table for gender x group)
export const mockCrosstabs = {
  genderByGroup: {
    table: {
      A: { Male: 2, Female: 0, Other: 1 },
      B: { Male: 0, Female: 2, Other: 0 },
    },
    chi2: 3.2,
    p: 0.2,
    phi: 0.8,
    cramersV: 0.8,
  },
};

// Weight cases (sampling weights for each respondent)
export const mockWeights = mockRespondentData.map((r) => ({
  id: r.id,
  weight: r.weight,
}));

// Split file: groupings for split analysis
export const mockSplitGroups = ["A", "B"];

// Correlation & Association
export const mockCorrelations = {
  pearson: {
    variables: ["age", "score"],
    r: 0.42,
    p: 0.12,
    n: 5,
  },
  spearman: {
    variables: ["age", "score"],
    rho: 0.39,
    p: 0.18,
    n: 5,
  },
  kendall: {
    variables: ["age", "score"],
    tau_b: 0.36,
    tau_c: 0.34,
    p: 0.22,
    n: 5,
  },
  partial: {
    variables: ["age", "score"],
    control: ["weight"],
    r: 0.28,
    p: 0.3,
    n: 5,
  },
  pointBiserial: {
    variables: ["gender (binary)", "age"],
    r_pb: 0.21,
    p: 0.4,
    n: 5,
  },
};

// ANOVA/GLM Family
export const mockAnovaGlm = {
  oneWayAnova: {
    groups: ["A", "B", "C"],
    means: [32.1, 35.4, 30.8],
    F: 2.45,
    dfBetween: 2,
    dfWithin: 12,
    p: 0.12,
    etaSquared: 0.29,
  },
  factorialAnova: {
    factors: ["Gender", "Group"],
    means: {
      Male: { A: 32.1, B: 33.2 },
      Female: { A: 35.4, B: 36.0 },
    },
    F: 3.12,
    df: [1, 12],
    p: 0.09,
    interactionF: 1.22,
    interactionP: 0.31,
  },
  repeatedMeasuresAnova: {
    levels: ["T1", "T2", "T3"],
    means: [30.2, 32.5, 34.1],
    F: 4.01,
    df: [2, 8],
    p: 0.07,
  },
  manova: {
    DVs: ["score1", "score2"],
    WilksLambda: 0.82,
    F: 2.11,
    df: [2, 10],
    p: 0.16,
  },
  mancova: {
    DVs: ["score1", "score2"],
    covariates: ["age"],
    WilksLambda: 0.79,
    F: 2.45,
    df: [2, 9],
    p: 0.13,
  },
  ancova: {
    DV: "score",
    covariate: "age",
    F: 2.88,
    df: [1, 13],
    p: 0.11,
    etaSquared: 0.18,
  },
  glm: {
    predictors: ["group", "gender", "age"],
    R2: 0.32,
    F: 2.67,
    df: [3, 11],
    p: 0.08,
  },
  levene: {
    statistic: 1.95,
    df: [2, 12],
    p: 0.18,
  },
  postHoc: {
    tukey: [
      { comparison: "A vs B", p: 0.21 },
      { comparison: "A vs C", p: 0.04 },
      { comparison: "B vs C", p: 0.19 },
    ],
    bonferroni: [
      { comparison: "A vs B", p: 0.25 },
      { comparison: "A vs C", p: 0.06 },
      { comparison: "B vs C", p: 0.22 },
    ],
    scheffe: [
      { comparison: "A vs B", p: 0.29 },
      { comparison: "A vs C", p: 0.09 },
      { comparison: "B vs C", p: 0.27 },
    ],
  },
};

// Regression & Predictive Models
export const mockRegression = {
  linear: {
    predictors: ["age", "group"],
    coefficients: { intercept: 10.2, age: 0.8, groupB: -2.1, groupC: 1.5 },
    R2: 0.31,
    adjR2: 0.22,
    F: 2.9,
    df: [2, 12],
    p: 0.09,
    durbinWatson: 1.85,
    collinearity: {
      age: { VIF: 1.2, tolerance: 0.83 },
      group: { VIF: 1.1, tolerance: 0.91 },
    },
  },
  binaryLogistic: {
    predictors: ["age", "group"],
    coefficients: { intercept: -1.2, age: 0.15, groupB: 0.7, groupC: -0.3 },
    CoxSnellR2: 0.19,
    NagelkerkeR2: 0.27,
    chi2: 5.2,
    df: 2,
    p: 0.07,
    auc: 0.74,
  },
  multinomialLogistic: {
    predictors: ["age", "group"],
    classes: ["A", "B", "C"],
    coefficients: {
      B: { intercept: -0.8, age: 0.12, groupB: 0.5 },
      C: { intercept: 0.6, age: -0.09, groupC: 0.4 },
    },
    chi2: 6.1,
    df: 4,
    p: 0.11,
    auc: 0.68,
  },
  ordinal: {
    predictors: ["age", "group"],
    coefficients: { intercept1: -1.1, intercept2: 0.9, age: 0.13, groupB: 0.6 },
    chi2: 4.7,
    df: 3,
    p: 0.14,
  },
  probit: {
    predictors: ["age", "group"],
    coefficients: { intercept: -0.7, age: 0.11, groupB: 0.3 },
    chi2: 3.9,
    df: 2,
    p: 0.18,
  },
  stepwise: {
    method: "forward",
    steps: [
      { included: ["age"], R2: 0.18, p: 0.13 },
      { included: ["age", "group"], R2: 0.31, p: 0.09 },
    ],
  },
  durbinWatson: 1.85,
  collinearity: {
    age: { VIF: 1.2, tolerance: 0.83 },
    group: { VIF: 1.1, tolerance: 0.91 },
  },
};

// --- FACTOR ANALYSIS, PCA, RELIABILITY, DISCRIMINANT, CLUSTER, CORRESPONDENCE, OPTIMAL SCALING MOCKS ---

export const mockFactorAnalysis = {
  nFactors: 2,
  method: "Principal Axis Factoring",
  eigenvalues: [2.8, 1.3, 0.7],
  explainedVariance: [46.7, 21.7, 11.6],
  communalities: {
    item1: 0.62,
    item2: 0.71,
    item3: 0.55,
    item4: 0.68,
  },
  loadings: {
    Factor1: { item1: 0.78, item2: 0.81, item3: 0.12, item4: 0.65 },
    Factor2: { item1: 0.15, item2: 0.22, item3: 0.73, item4: 0.54 },
  },
  rotation: "Varimax",
};

export const mockPCA = {
  nComponents: 2,
  eigenvalues: [2.9, 1.1, 0.6],
  explainedVariance: [48.3, 18.3, 10.0],
  componentLoadings: {
    PC1: { item1: 0.82, item2: 0.77, item3: 0.18, item4: 0.61 },
    PC2: { item1: 0.21, item2: 0.19, item3: 0.79, item4: 0.58 },
  },
  scores: [1.2, -0.8, 0.5, 1.1, -1.0],
};

export const mockReliability = {
  cronbachAlpha: 0.84,
  nItems: 4,
  itemTotalCorrelation: {
    item1: 0.62,
    item2: 0.71,
    item3: 0.55,
    item4: 0.68,
  },
  alphaIfItemDeleted: {
    item1: 0.8,
    item2: 0.79,
    item3: 0.82,
    item4: 0.81,
  },
};

export const mockDiscriminant = {
  groups: ["A", "B"],
  canonicalCorrelation: 0.67,
  eigenvalue: 0.81,
  wilksLambda: 0.55,
  chi2: 8.2,
  df: 2,
  p: 0.017,
  standardizedCoefficients: {
    item1: 0.42,
    item2: -0.31,
    item3: 0.28,
    item4: 0.19,
  },
  groupCentroids: { A: 0.85, B: -0.73 },
  classificationAccuracy: 84,
};

export const mockCluster = {
  method: "k-means",
  nClusters: 2,
  clusterSizes: [3, 2],
  centroids: {
    Cluster1: { item1: 3.2, item2: 4.1, item3: 2.8, item4: 3.9 },
    Cluster2: { item1: 1.7, item2: 2.2, item3: 1.9, item4: 2.1 },
  },
  assignments: [1, 2, 1, 2, 1],
  silhouette: 0.61,
};

export const mockCorrespondence = {
  rowLabels: ["A", "B"],
  colLabels: ["X", "Y", "Z"],
  table: [
    [12, 7, 5],
    [6, 15, 9],
  ],
  inertia: 0.23,
  dim1: { row: [0.41, -0.41], col: [0.38, -0.29, -0.09] },
  dim2: { row: [0.12, -0.12], col: [0.09, -0.07, -0.02] },
};

export const mockOptimalScaling = {
  method: "CATREG",
  predictors: ["gender", "group"],
  transformedPredictors: {
    gender: { Male: 0.2, Female: -0.1, Other: 0.0 },
    group: { A: 0.3, B: -0.2 },
  },
  coefficients: { intercept: 1.1, gender: 0.5, group: 0.7 },
  R2: 0.28,
  F: 2.2,
  df: [2, 12],
  p: 0.14,
};

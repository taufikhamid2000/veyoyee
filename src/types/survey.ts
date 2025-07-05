/**
 * Core survey data models for the Veyoyee application
 * This file contains interfaces that are shared across the application for survey-related data
 */

import { QuestionEdit } from "../data/surveyor-data";

/**
 * Survey interface used in the UI components
 */
export interface Survey {
  id: string;
  title: string;
  type: "commerce" | "academia" | string;
  status: "active" | "draft" | "closed";
  responses: number;
  completionRate: number;
  questions: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastUpdated: string;
  minRespondents?: number;
  maxRespondents?: number;
  startDate?: string;
  endDate?: string;
  rewardAmount?: string;
  questionsData?: QuestionEdit[];
}

/**
 * Activity item for the dashboard recent activity
 */
export interface ActivityItem {
  id: string;
  type: "response" | "edit" | "export" | "create";
  surveyId: string;
  surveyTitle: string;
  date: string;
  ipAddress?: string;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  activeSurveys: number;
  draftSurveys: number;
  totalResponses: number;
  avgCompletionRate: number;
}

/**
 * Calculate dashboard statistics from survey data
 */
export function getDashboardStats(surveys: Survey[]): DashboardStats {
  const activeSurveys = surveys.filter((s) => s.status === "active").length;
  const draftSurveys = surveys.filter((s) => s.status === "draft").length;
  const totalResponses = surveys.reduce(
    (sum, survey) => sum + survey.responses,
    0
  );

  // Calculate average completion rate only for surveys with responses
  const surveysWithResponses = surveys.filter((s) => s.responses > 0);
  const avgCompletionRate =
    surveysWithResponses.length > 0
      ? Math.round(
          surveysWithResponses.reduce((sum, s) => sum + s.completionRate, 0) /
            surveysWithResponses.length
        )
      : 0;

  return {
    activeSurveys,
    draftSurveys,
    totalResponses,
    avgCompletionRate,
  };
}

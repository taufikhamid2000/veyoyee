/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuestionEdit } from "../../../data/surveyor-data";

// Survey data model for creating/updating surveys
export interface SurveyData {
  title: string;
  type: "academia" | "commerce";
  minRespondents?: number;
  maxRespondents?: number;
  startDate?: string;
  endDate?: string;
  rewardAmount?: string;
  questions: QuestionEdit[];
}

// Database response types
export interface DbSurvey {
  id: string;
  title: string;
  type: "academia" | "commerce";
  status: "draft" | "active" | "closed";
  min_respondents: number | null;
  max_respondents: number | null;
  start_date: string | null;
  end_date: string | null;
  reward_amount: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DbQuestion {
  id: string;
  survey_id: string;
  question_text: string;
  type: string;
  required: boolean;
  display_order: number;
  rating_min?: number;
  rating_max?: number;
  rating_step?: number;
  rating_min_label?: string;
  rating_max_label?: string;
}

export interface DbQuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  display_order: number;
}

export interface DbSurveyResponse {
  id: string;
  survey_id: string;
  respondent_id: string;
  started_at: string;
  completed_at: string | null;
  is_complete: boolean;
}

export interface DbResponseAnswer {
  id: string;
  response_id: string;
  question_id: string;
  answer_text: string;
  selected_options?: string[];
}

// Client-side formatted types
export interface FormattedSurvey {
  id: string;
  title: string;
  type: "academia" | "commerce";
  status: "draft" | "active" | "closed";
  minRespondents: number | null;
  maxRespondents: number | null;
  startDate: string | null;
  endDate: string | null;
  rewardAmount: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  questions: QuestionEdit[];
  responseCount?: number;
  completionRate?: number;
}

export interface SurveyListItem {
  id: string;
  title: string;
  type: "academia" | "commerce";
  status: "draft" | "active" | "closed";
  minRespondents: number | null;
  maxRespondents: number | null;
  startDate: string | null;
  endDate: string | null;
  rewardAmount: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  questions: number;
  responses: number;
  completionRate: number;
  lastUpdated: string;
}

// Response metrics type
export interface ResponseMetrics {
  responses: number;
  completedResponses?: number;
  completionRate: number;
}

// Service response types
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
}

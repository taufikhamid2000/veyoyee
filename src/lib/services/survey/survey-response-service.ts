/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DbResponseAnswer,
  DbSurveyResponse,
  ResponseMetrics,
  ServiceResponse,
} from "./survey-types";

export class SurveyResponseService {
  /**
   * Get response metrics for multiple surveys
   */
  static async getSurveyResponseMetrics(
    supabase: any,
    surveyIds: string[]
  ): Promise<Map<string, ResponseMetrics>> {
    try {
      // Create map to store metrics
      const responseMetricsMap = new Map<string, ResponseMetrics>();

      if (surveyIds.length === 0) {
        return responseMetricsMap;
      }

      // Get metrics using direct table queries instead of functions
      const { data: responseCounts, error: responseError } = await supabase
        .schema("veyoyee")
        .from("survey_responses")
        .select("survey_id, response_count, response_date")
        .in("survey_id", surveyIds);

      if (responseError) {
        console.warn("Error fetching survey metrics:", responseError);
        return responseMetricsMap;
      }

      if (!responseCounts || !responseCounts.length) {
        return responseMetricsMap;
      }

      // Process the response data directly
      const surveyMetrics: Record<
        string,
        { totalResponses: number; responseDates: Set<string> }
      > = {};

      responseCounts.forEach((item: any) => {
        const surveyId = item.survey_id;
        if (!surveyMetrics[surveyId]) {
          surveyMetrics[surveyId] = {
            totalResponses: 0,
            responseDates: new Set(),
          };
        }

        surveyMetrics[surveyId].totalResponses += item.response_count || 0;
        if (item.response_date) {
          surveyMetrics[surveyId].responseDates.add(item.response_date);
        }
      });

      // Convert to map format
      Object.entries(surveyMetrics).forEach(([surveyId, metrics]) => {
        responseMetricsMap.set(surveyId, {
          responses: metrics.totalResponses,
          completedResponses: 0, // We'll implement this properly later if needed
          completionRate: 0, // We'll calculate this properly later if needed
        });
      });

      return responseMetricsMap;
    } catch (error) {
      console.error("Error fetching response metrics:", error);
      return new Map(); // Return empty map on error
    }
  }

  /**
   * Record a new response to a survey
   */
  static async createSurveyResponse(
    surveyId: string,
    respondentId: string
  ): Promise<ServiceResponse<{ responseId: string }>> {
    const supabase = getVeyoyeeClient();

    try {
      // Create the response record
      const { data: response, error } = await supabase
        .schema("veyoyee")
        .from("survey_responses")
        .insert({
          survey_id: surveyId,
          respondent_id: respondentId,
          started_at: new Date().toISOString(),
          is_complete: false,
        })
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      return { success: true, data: { responseId: response.id } };
    } catch (error) {
      console.error("Error creating survey response:", error);
      return { success: false, error };
    }
  }

  /**
   * Mark a survey response as complete
   */
  static async completeSurveyResponse(
    responseId: string
  ): Promise<ServiceResponse<void>> {
    const supabase = getVeyoyeeClient();

    try {
      const { error } = await supabase
        .schema("veyoyee")
        .from("survey_responses")
        .update({
          completed_at: new Date().toISOString(),
          is_complete: true,
        })
        .eq("id", responseId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Error completing survey response:", error);
      return { success: false, error };
    }
  }

  /**
   * Save answer to a survey question
   */
  static async saveResponseAnswer(
    responseId: string,
    questionId: string,
    answerText: string,
    selectedOptions?: string[]
  ): Promise<ServiceResponse<void>> {
    const supabase = getVeyoyeeClient();

    try {
      const { error } = await supabase
        .schema("veyoyee")
        .from("response_answers")
        .insert({
          response_id: responseId,
          question_id: questionId,
          answer_text: answerText,
          selected_options: selectedOptions,
        });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Error saving response answer:", error);
      return { success: false, error };
    }
  }

  /**
   * Get all responses for a survey
   */
  static async getSurveyResponses(
    surveyId: string
  ): Promise<ServiceResponse<DbSurveyResponse[]>> {
    const supabase = getVeyoyeeClient();

    try {
      const { data, error } = await supabase
        .schema("veyoyee")
        .from("survey_responses")
        .select("*")
        .eq("survey_id", surveyId)
        .order("started_at", { ascending: false });

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error getting survey responses:", error);
      return { success: false, error };
    }
  }

  /**
   * Get answers for a specific response
   */
  static async getResponseAnswers(
    responseId: string
  ): Promise<ServiceResponse<DbResponseAnswer[]>> {
    const supabase = getVeyoyeeClient();

    try {
      const { data, error } = await supabase
        .schema("veyoyee")
        .from("response_answers")
        .select("*")
        .eq("response_id", responseId);

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error getting response answers:", error);
      return { success: false, error };
    }
  }
}

// Import at the bottom to avoid circular dependency
import { getVeyoyeeClient } from "../../supabase/veyoyee-client";

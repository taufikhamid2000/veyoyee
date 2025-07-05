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

      // Get total responses counts
      const { data: responseCounts, error: responseError } = await supabase
        .schema("veyoyee")
        .from("survey_responses")
        .select("survey_id, count")
        .in("survey_id", surveyIds);

      if (responseError) {
        // Check if this is just because the table doesn't exist yet
        if (responseError.code === "42P01") {
          // Table does not exist
          console.warn("survey_responses table does not exist yet");
          return responseMetricsMap;
        }
        throw responseError;
      }

      if (!responseCounts || !responseCounts.length) {
        return responseMetricsMap;
      }

      // Get completed responses counts
      const { data: completedCounts, error: completedError } = await supabase
        .schema("veyoyee")
        .from("survey_responses")
        .select("survey_id, count")
        .in("survey_id", surveyIds)
        .eq("is_complete", true)
        .group("survey_id");

      if (completedError && completedError.code !== "42P01") {
        throw completedError;
      }

      // Process the response data
      responseCounts.forEach((item: any) => {
        const surveyId = item.survey_id;
        const totalResponses = parseInt(item.count);

        // Find completed count for this survey
        const completedItem =
          completedCounts &&
          completedCounts.find((c: any) => c.survey_id === surveyId);
        const completedResponses = completedItem
          ? parseInt(completedItem.count)
          : 0;

        // Calculate completion rate
        const completionRate =
          totalResponses > 0
            ? Math.round((completedResponses / totalResponses) * 100)
            : 0;

        // Store in map
        responseMetricsMap.set(surveyId, {
          responses: totalResponses,
          completedResponses,
          completionRate,
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

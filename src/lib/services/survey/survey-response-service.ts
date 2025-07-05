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

      // Get metrics using the get_survey_metrics function which handles proper GROUP BY internally
      const { data: responseCounts, error: responseError } = await supabase.rpc(
        "get_survey_metrics",
        {
          survey_ids: surveyIds,
        }
      );

      if (responseError) {
        console.warn("Error fetching survey metrics:", responseError);
        return responseMetricsMap;
      }

      if (!responseCounts || !responseCounts.length) {
        return responseMetricsMap;
      }

      // Get completed responses counts using a direct RPC call to avoid GROUP BY syntax issues
      const { data: completedCounts, error: completedError } =
        await supabase.rpc("get_completed_survey_counts", {
          survey_ids: surveyIds,
        });

      // If the RPC doesn't exist yet, just continue with zeroes for completed counts
      if (completedError) {
        console.warn(
          "Could not get completed counts, defaulting to zero:",
          completedError
        );
        // Continue execution, we'll just use zeroes for completed counts
      }

      // Process the response data from the function
      responseCounts.forEach((item: any) => {
        const surveyId = item.survey_id;
        const totalResponses = parseInt(item.responses || 0);
        const completionRate = parseFloat(item.completion_rate || 0);

        // Get completed counts from the separate RPC (which we still need for now)
        const completedItem =
          completedCounts &&
          completedCounts.find((c: any) => c.survey_id === surveyId);
        const completedResponses = completedItem
          ? parseInt(completedItem.count)
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

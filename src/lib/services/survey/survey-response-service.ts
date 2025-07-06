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
        .from("individual_responses")
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
        .from("individual_responses")
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
        .from("individual_responses")
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
   * Get formatted survey responses with answers for results page
   */
  static async getSurveyResponsesWithAnswers(
    surveyId: string,
    supabaseClient?: any
  ): Promise<ServiceResponse<any[]>> {
    const supabase = supabaseClient || getVeyoyeeClient();

    try {
      // Simple direct query
      const { data: responses, error } = await supabase
        .schema("veyoyee")
        .from("individual_responses")
        .select("*")
        .eq("survey_id", surveyId)
        .eq("is_complete", true)
        .order("completed_at", { ascending: false });

      if (error) {
        console.error("Error fetching responses:", error);
        return { success: false, error };
      }

      if (!responses || responses.length === 0) {
        return { success: true, data: [] };
      }

      // Get all answers for these responses
      const responseIds = responses.map((r: any) => r.id);

      const { data: answers, error: answersError } = await supabase
        .schema("veyoyee")
        .from("response_answers")
        .select("*")
        .in("response_id", responseIds);

      if (answersError) {
        console.error("Error fetching answers:", answersError);
        return { success: false, error: answersError };
      }

      // Group answers by response_id
      const answersByResponse = (answers || []).reduce(
        (acc: Record<string, Record<string, any>>, answer: any) => {
          if (!acc[answer.response_id]) {
            acc[answer.response_id] = {};
          }
          acc[answer.response_id][answer.question_id] =
            answer.selected_options || answer.answer_text;
          return acc;
        },
        {}
      );

      // Format responses
      const formattedResponses = responses.map((response: any) => ({
        id: response.id,
        surveyId: response.survey_id,
        respondent: `User ${response.respondent_id.slice(-8)}`,
        submittedAt: response.completed_at,
        status: response.status || "pending", // Use database status, fallback to pending
        reputationScore: Math.floor(Math.random() * 50) + 50,
        answers: answersByResponse[response.id] || {},
      }));

      return { success: true, data: formattedResponses };
    } catch (error) {
      console.error("Error getting survey responses with answers:", error);
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

  /**
   * Check if a user has already answered a survey
   */
  static async hasUserAnsweredSurvey(
    surveyId: string,
    respondentId: string
  ): Promise<ServiceResponse<boolean>> {
    const supabase = getVeyoyeeClient();

    try {
      const { data, error } = await supabase
        .schema("veyoyee")
        .from("individual_responses")
        .select("id")
        .eq("survey_id", surveyId)
        .eq("respondent_id", respondentId)
        .eq("is_complete", true) // Only check for completed responses
        .limit(1);

      if (error) {
        throw error;
      }

      return { success: true, data: data && data.length > 0 };
    } catch (error) {
      console.error("Error checking if user answered survey:", error);
      return { success: false, error };
    }
  }

  /**
   * Get all survey IDs that a user has answered (completed responses only)
   */
  static async getUserAnsweredSurveyIds(
    respondentId: string
  ): Promise<ServiceResponse<string[]>> {
    const supabase = getVeyoyeeClient();

    try {
      const { data, error } = await supabase
        .schema("veyoyee")
        .from("individual_responses")
        .select("survey_id")
        .eq("respondent_id", respondentId)
        .eq("is_complete", true); // Only get completed responses

      if (error) {
        throw error;
      }

      const surveyIds = data?.map((response) => response.survey_id) || [];
      return { success: true, data: surveyIds };
    } catch (error) {
      console.error("Error getting user answered survey IDs:", error);
      return { success: false, error };
    }
  }

  /**
   * Get all survey IDs that a user has answered (server version with supabase client)
   */
  static async getUserAnsweredSurveyIdsServer(
    supabase: any,
    respondentId: string
  ): Promise<ServiceResponse<string[]>> {
    try {
      const { data, error } = await supabase
        .schema("veyoyee")
        .from("individual_responses")
        .select("survey_id")
        .eq("respondent_id", respondentId)
        .eq("is_complete", true); // Only get completed responses

      if (error) {
        throw error;
      }

      const surveyIds = data?.map((response: any) => response.survey_id) || [];
      return { success: true, data: surveyIds };
    } catch (error) {
      console.error("Error getting user answered survey IDs (server):", error);
      return { success: false, error };
    }
  }

  /**
   * Accept a survey response
   */
  static async acceptResponse(
    responseId: string,
    supabaseClient?: any
  ): Promise<ServiceResponse<void>> {
    const supabase = supabaseClient || getVeyoyeeClient();

    try {
      const { error } = await supabase
        .schema("veyoyee")
        .from("individual_responses")
        .update({ status: "accepted" })
        .eq("id", responseId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Error accepting response:", error);
      return { success: false, error };
    }
  }

  /**
   * Reject a survey response
   */
  static async rejectResponse(
    responseId: string,
    supabaseClient?: any
  ): Promise<ServiceResponse<void>> {
    const supabase = supabaseClient || getVeyoyeeClient();

    try {
      const { error } = await supabase
        .schema("veyoyee")
        .from("individual_responses")
        .update({ status: "rejected" })
        .eq("id", responseId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Error rejecting response:", error);
      return { success: false, error };
    }
  }

  /**
   * Delete a survey response
   */
  static async deleteResponse(
    responseId: string,
    supabaseClient?: any
  ): Promise<ServiceResponse<void>> {
    const supabase = supabaseClient || getVeyoyeeClient();

    try {
      const { error } = await supabase
        .schema("veyoyee")
        .from("individual_responses")
        .delete()
        .eq("id", responseId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting response:", error);
      return { success: false, error };
    }
  }
}

// Import at the bottom to avoid circular dependency
import { getVeyoyeeClient } from "../../supabase/veyoyee-client";

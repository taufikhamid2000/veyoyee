/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DbResponseAnswer,
  DbSurveyResponse,
  ResponseMetrics,
  ServiceResponse,
} from "./survey-types";

export class SurveyResponseService {
  /**      // Simple direct query - include all responses (including deleted) for admin review
      const { data: responses, error } = await supabase
        .schema("veyoyee")
        .from("individual_responses")
        .select("*")
        .eq("survey_id", surveyId)
        .eq("is_complete", true)
        // Removed: .neq("status", "deleted") - now including deleted responses for frontend filtering
        .order("completed_at", { ascending: false }); response metrics for multiple surveys
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
        .neq("status", "deleted") // Exclude deleted responses
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
      // Simple direct query - include all responses for frontend filtering
      const { data: responses, error } = await supabase
        .schema("veyoyee")
        .from("individual_responses")
        .select("*")
        .eq("survey_id", surveyId)
        .eq("is_complete", true)
        // No status filtering here - let frontend handle showing/hiding deleted responses
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

      // Get user reputation data for respondents
      const respondentIds = [
        ...new Set(responses.map((r: any) => r.respondent_id)),
      ];
      const { data: userData, error: userError } = await supabase
        .schema("veyoyee")
        .from("users")
        .select("id, username, display_name, total_reputation")
        .in("id", respondentIds);

      if (userError) {
        console.warn("Error fetching user data:", userError);
      }

      // Create user lookup map
      const userLookup = (userData || []).reduce(
        (acc: Record<string, any>, user: any) => {
          acc[user.id] = user;
          return acc;
        },
        {}
      );

      // Format responses
      const formattedResponses = responses.map((response: any) => {
        const user = userLookup[response.respondent_id];
        return {
          id: response.id,
          surveyId: response.survey_id,
          respondent:
            user?.display_name ||
            user?.username ||
            `User ${response.respondent_id.slice(-8)}`,
          submittedAt: response.completed_at,
          status: response.status || "pending",
          reputationScore: response.reputation_awarded || 0,
          totalUserReputation: user?.total_reputation || 0,
          answers: answersByResponse[response.id] || {},
        };
      });

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
        .neq("status", "deleted") // Exclude deleted responses
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
        .eq("is_complete", true) // Only get completed responses
        .neq("status", "deleted"); // Exclude deleted responses

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
        .eq("is_complete", true) // Only get completed responses
        .neq("status", "deleted"); // Exclude deleted responses

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

  /**
   * Soft delete a survey response (keeps reputation history)
   */
  static async softDeleteResponse(
    responseId: string,
    supabaseClient?: any
  ): Promise<ServiceResponse<void>> {
    const supabase = supabaseClient || getVeyoyeeClient();

    try {
      const { error } = await supabase
        .schema("veyoyee")
        .from("individual_responses")
        .update({ status: "deleted" })
        .eq("id", responseId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Error soft deleting response:", error);
      return { success: false, error };
    }
  }

  /**
   * Restore a soft deleted survey response
   */
  static async restoreResponse(
    responseId: string,
    supabaseClient?: any
  ): Promise<ServiceResponse<void>> {
    const supabase = supabaseClient || getVeyoyeeClient();

    try {
      const { error } = await supabase
        .schema("veyoyee")
        .from("individual_responses")
        .update({ status: "pending" })
        .eq("id", responseId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Error restoring response:", error);
      return { success: false, error };
    }
  }

  /**
   * Get user profile with reputation data
   */
  static async getUserProfile(
    userId: string,
    supabaseClient?: any
  ): Promise<ServiceResponse<any>> {
    const supabase = supabaseClient || getVeyoyeeClient();

    try {
      const { data, error } = await supabase
        .schema("veyoyee")
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error getting user profile:", error);
      return { success: false, error };
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    userId: string,
    profileData: {
      username?: string;
      display_name?: string;
      bio?: string;
      avatar_url?: string;
      location?: string;
      website_url?: string;
    },
    supabaseClient?: any
  ): Promise<ServiceResponse<void>> {
    const supabase = supabaseClient || getVeyoyeeClient();

    try {
      const { error } = await supabase
        .schema("veyoyee")
        .from("users")
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating user profile:", error);
      return { success: false, error };
    }
  }

  /**
   * Get leaderboard of users by reputation
   */
  static async getReputationLeaderboard(
    limit: number = 10,
    supabaseClient?: any
  ): Promise<ServiceResponse<any[]>> {
    const supabase = supabaseClient || getVeyoyeeClient();

    try {
      const { data, error } = await supabase
        .schema("veyoyee")
        .from("users")
        .select(
          "id, username, display_name, total_reputation, responses_accepted, surveys_completed, surveys_created"
        )
        .order("total_reputation", { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error getting reputation leaderboard:", error);
      return { success: false, error };
    }
  }

  /**
   * Get user's reputation statistics
   */
  static async getUserReputationStats(
    userId: string,
    supabaseClient?: any
  ): Promise<
    ServiceResponse<{
      totalReputation: number;
      rank: number;
      responsesAccepted: number;
      responsesRejected: number;
      surveysCompleted: number;
      surveysCreated: number;
    }>
  > {
    const supabase = supabaseClient || getVeyoyeeClient();

    try {
      // Get user's current stats
      const { data: userStats, error: userError } = await supabase
        .schema("veyoyee")
        .from("users")
        .select(
          "total_reputation, responses_accepted, responses_rejected, surveys_completed, surveys_created"
        )
        .eq("id", userId)
        .single();

      if (userError) {
        throw userError;
      }

      // Get user's rank by counting users with higher reputation
      const { count: rank, error: rankError } = await supabase
        .schema("veyoyee")
        .from("users")
        .select("*", { count: "exact", head: true })
        .gt("total_reputation", userStats.total_reputation);

      if (rankError) {
        throw rankError;
      }

      return {
        success: true,
        data: {
          totalReputation: userStats.total_reputation,
          rank: (rank || 0) + 1, // Add 1 because rank is 0-indexed
          responsesAccepted: userStats.responses_accepted,
          responsesRejected: userStats.responses_rejected,
          surveysCompleted: userStats.surveys_completed,
          surveysCreated: userStats.surveys_created,
        },
      };
    } catch (error) {
      console.error("Error getting user reputation stats:", error);
      return { success: false, error };
    }
  }

  /**
   * Manually award reputation to a user (admin function)
   */
  static async awardReputation(
    userId: string,
    points: number,
    reason?: string,
    supabaseClient?: any
  ): Promise<ServiceResponse<void>> {
    const supabase = supabaseClient || getVeyoyeeClient();

    try {
      const { error } = await supabase
        .schema("veyoyee")
        .from("users")
        .update({
          total_reputation: supabase.raw(`total_reputation + ${points}`),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        throw error;
      }

      // Optionally log the reputation award
      console.log(
        `Awarded ${points} reputation to user ${userId}${
          reason ? ` for: ${reason}` : ""
        }`
      );

      return { success: true };
    } catch (error) {
      console.error("Error awarding reputation:", error);
      return { success: false, error };
    }
  }

  /**
   * Format reputation for display
   * Shows "100+" for reputation >= 100, otherwise shows exact number (including negatives)
   */
  static formatReputationForDisplay(reputation: number): string {
    if (reputation >= 100) {
      return "100+";
    }
    return reputation.toString();
  }

  /**
   * Get reputation tier/badge based on reputation score
   */
  static getReputationTier(reputation: number): {
    tier: string;
    color: string;
    minReputation: number;
  } {
    if (reputation >= 100) {
      return { tier: "Expert", color: "text-purple-600", minReputation: 100 };
    } else if (reputation >= 50) {
      return { tier: "Advanced", color: "text-blue-600", minReputation: 50 };
    } else if (reputation >= 20) {
      return {
        tier: "Intermediate",
        color: "text-green-600",
        minReputation: 20,
      };
    } else if (reputation >= 5) {
      return { tier: "Beginner", color: "text-yellow-600", minReputation: 5 };
    } else if (reputation >= 0) {
      return { tier: "Novice", color: "text-gray-600", minReputation: 0 };
    } else {
      return {
        tier: "Probation",
        color: "text-red-600",
        minReputation: -Infinity,
      };
    }
  }

  /**
   * Bulk accept multiple survey responses
   */
  static async bulkAcceptResponses(
    responseIds: string[],
    supabaseClient?: any
  ): Promise<ServiceResponse<void>> {
    const supabase = supabaseClient || getVeyoyeeClient();

    try {
      const { error } = await supabase
        .schema("veyoyee")
        .from("individual_responses")
        .update({ status: "accepted" })
        .in("id", responseIds);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Error bulk accepting responses:", error);
      return { success: false, error };
    }
  }

  /**
   * Bulk reject multiple survey responses
   */
  static async bulkRejectResponses(
    responseIds: string[],
    supabaseClient?: any
  ): Promise<ServiceResponse<void>> {
    const supabase = supabaseClient || getVeyoyeeClient();

    try {
      console.log("Bulk rejecting responses:", responseIds);

      const { data, error } = await supabase
        .schema("veyoyee")
        .from("individual_responses")
        .update({ status: "rejected" })
        .in("id", responseIds)
        .select();

      console.log("Bulk reject result:", { data, error });

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Error bulk rejecting responses:", error);
      return { success: false, error };
    }
  }

  /**
   * Bulk soft delete multiple survey responses
   */
  static async bulkSoftDeleteResponses(
    responseIds: string[],
    supabaseClient?: any
  ): Promise<ServiceResponse<void>> {
    const supabase = supabaseClient || getVeyoyeeClient();

    try {
      const { error } = await supabase
        .schema("veyoyee")
        .from("individual_responses")
        .update({ status: "deleted" })
        .in("id", responseIds);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Error bulk soft deleting responses:", error);
      return { success: false, error };
    }
  }

  /**
   * Get predefined rejection reasons
   */
  static async getRejectionReasons(
    supabaseClient?: any
  ): Promise<
    ServiceResponse<
      Array<{ id: string; reason_text: string; is_default?: boolean }>
    >
  > {
    const supabase = supabaseClient || getVeyoyeeClient();

    try {
      const { data, error } = await supabase
        .schema("veyoyee")
        .from("rejection_reasons")
        .select("id, reason_text")
        .eq("is_active", true)
        .order("reason_text");

      if (error) {
        throw error;
      }

      // Add is_default flag to the first reason (most common)
      const processedData = (data || []).map((reason: any, index: number) => ({
        ...reason,
        is_default: index === 0, // Mark first reason as default
      }));

      return { success: true, data: processedData };
    } catch (error) {
      console.error("Error fetching rejection reasons:", error);
      return { success: false, error };
    }
  }

  /**
   * Bulk reject multiple survey responses with reason
   */
  static async bulkRejectResponsesWithReason(
    responseIds: string[],
    reason: string,
    reviewerId: string,
    supabaseClient?: any
  ): Promise<ServiceResponse<void>> {
    const supabase = supabaseClient || getVeyoyeeClient();

    if (!reason.trim()) {
      return { success: false, error: "Rejection reason is required" };
    }

    try {
      const { error } = await supabase
        .schema("veyoyee")
        .from("individual_responses")
        .update({
          status: "rejected",
          rejection_reason: reason.trim(),
          reviewed_by: reviewerId,
          reviewed_at: new Date().toISOString(),
        })
        .in("id", responseIds);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Error bulk rejecting responses with reason:", error);
      return { success: false, error };
    }
  }

  /**
   * Bulk restore multiple deleted survey responses (sets status back to pending)
   */
  static async bulkRestoreResponses(
    responseIds: string[],
    supabaseClient?: any
  ): Promise<ServiceResponse<void>> {
    const supabase = supabaseClient || getVeyoyeeClient();

    try {
      const { error } = await supabase
        .schema("veyoyee")
        .from("individual_responses")
        .update({ status: "pending" })
        .in("id", responseIds);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Error bulk restoring responses:", error);
      return { success: false, error };
    }
  }
}

// Import at the bottom to avoid circular dependency
import { getVeyoyeeClient } from "../../supabase/veyoyee-client";

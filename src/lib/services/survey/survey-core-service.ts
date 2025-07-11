/* eslint-disable @typescript-eslint/no-explicit-any */
import { getVeyoyeeClient } from "../../supabase/veyoyee-client";
import {
  ServiceResponse,
  SurveyData,
  FormattedSurvey,
  SurveyListItem,
} from "./survey-types";
import { formatSurveyForClient, formatSurveyForList } from "./survey-formatter";
import { SurveyQuestionService } from "./survey-question-service";
import { SurveyResponseService } from "./survey-response-service";

export class SurveyCoreService {
  /**
   * Create a new survey (published or draft)
   */
  static async createSurvey(
    surveyData: SurveyData,
    status: "draft" | "active" = "draft"
  ): Promise<ServiceResponse<{ surveyId: string }>> {
    const supabase = getVeyoyeeClient();

    try {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // Start a transaction by using RPC (requires a stored procedure in Supabase)
      // For now, we'll use multiple queries and handle any errors

      // 1. Create the survey record
      console.log("Inserting survey with:", {
        title: surveyData.title,
        type: surveyData.type,
        status: status,
        schema: "veyoyee",
      });

      const { data: survey, error: surveyError } = await supabase
        .schema("veyoyee") // Explicitly set schema for this operation
        .from("surveys")
        .insert({
          title: surveyData.title,
          type: surveyData.type,
          status: status,
          min_respondents: surveyData.minRespondents || null,
          max_respondents: surveyData.maxRespondents || null,
          start_date: surveyData.startDate || null,
          end_date: surveyData.endDate || null,
          reward_amount: surveyData.rewardAmount
            ? parseFloat(surveyData.rewardAmount)
            : null,
          created_by: user.id,
          owned_by: user.id, // <-- Added this line
        })
        .select("id")
        .single();

      if (surveyError) {
        console.error("Survey insert error details:", surveyError);
        throw surveyError;
      }

      // 2. Create questions and options
      await SurveyQuestionService.createQuestionsForSurvey(
        supabase,
        survey.id,
        surveyData.questions
      );

      return {
        success: true,
        data: { surveyId: survey.id },
      };
    } catch (error) {
      console.error("Error creating survey:", error);
      // Log detailed error information
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      } else {
        console.error(
          "Non-Error object thrown:",
          JSON.stringify(error, null, 2)
        );
      }
      return { success: false, error };
    }
  }

  /**
   * Get a survey by ID
   */
  static async getSurveyById(
    surveyId: string,
    supabaseClient?: any
  ): Promise<ServiceResponse<FormattedSurvey>> {
    const supabase = supabaseClient || getVeyoyeeClient();

    try {
      // Get the survey
      const { data: survey, error: surveyError } = await supabase
        .schema("veyoyee") // Set schema for this operation
        .from("surveys")
        .select("*")
        .eq("id", surveyId)
        .single();

      if (surveyError) {
        throw surveyError;
      }

      // Get the questions
      const { success: questionsSuccess, data: formattedQuestions } =
        await SurveyQuestionService.getQuestionsForSurvey(supabase, surveyId);

      if (!questionsSuccess || !formattedQuestions) {
        throw new Error("Failed to fetch questions");
      }

      // Format the survey for client
      const formattedSurvey = formatSurveyForClient(survey, formattedQuestions);

      // Get response metrics if available
      const responseMetrics =
        await SurveyResponseService.getSurveyResponseMetrics(supabase, [
          surveyId,
        ]);

      if (responseMetrics && responseMetrics.has(surveyId)) {
        const metrics = responseMetrics.get(surveyId);
        if (metrics) {
          formattedSurvey.responseCount = metrics.responses;
          formattedSurvey.completionRate = metrics.completionRate;
        }
      }

      return { success: true, data: formattedSurvey };
    } catch (error) {
      console.error("Error getting survey:", error);
      return { success: false, error };
    }
  }

  /**
   * Update an existing survey
   */
  static async updateSurvey(
    surveyId: string,
    surveyData: SurveyData,
    status?: "draft" | "active" | "closed"
  ): Promise<ServiceResponse<void>> {
    const supabase = getVeyoyeeClient();

    try {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // 1. Update the survey record
      const surveyUpdate: any = {
        title: surveyData.title,
        type: surveyData.type,
        min_respondents: surveyData.minRespondents || null,
        max_respondents: surveyData.maxRespondents || null,
        start_date: surveyData.startDate || null,
        end_date: surveyData.endDate || null,
        reward_amount: surveyData.rewardAmount
          ? parseFloat(surveyData.rewardAmount)
          : null,
        owned_by: user.id, // <-- Added this line
      };

      // Update status if provided
      if (status) {
        surveyUpdate.status = status;
      }

      const { error: surveyError } = await supabase
        .schema("veyoyee")
        .from("surveys")
        .update(surveyUpdate)
        .eq("id", surveyId);

      if (surveyError) {
        throw surveyError;
      }

      // 2. Update questions and options
      await SurveyQuestionService.updateQuestionsForSurvey(
        supabase,
        surveyId,
        surveyData.questions
      );

      return { success: true };
    } catch (error) {
      console.error("Error updating survey:", error);
      return { success: false, error };
    }
  }

  /**
   * Delete a survey
   */
  static async deleteSurvey(surveyId: string): Promise<ServiceResponse<void>> {
    const supabase = getVeyoyeeClient();

    try {
      // Delete the survey (cascade will handle related records)
      const { error } = await supabase
        .schema("veyoyee")
        .from("surveys")
        .delete()
        .eq("id", surveyId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting survey:", error);
      return { success: false, error };
    }
  }

  /**
   * Get surveys by user
   */
  static async getUserSurveys(
    userId?: string
  ): Promise<ServiceResponse<SurveyListItem[]>> {
    const supabase = getVeyoyeeClient();
    let userIdToQuery = userId;

    try {
      // If no userId is provided, try to get it from the auth session
      if (!userIdToQuery) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error("User not authenticated");
        }
        userIdToQuery = user.id;
      }

      // Get all surveys by the current user
      const { data: surveys, error: surveysError } = await supabase
        .schema("veyoyee") // Use the veyoyee schema
        .from("surveys")
        .select("*")
        .eq("created_by", userIdToQuery)
        .order("created_at", { ascending: false });

      if (surveysError) {
        throw surveysError;
      }

      // Extract survey IDs for bulk operations
      const surveyIds = surveys.map((survey: any) => survey.id);

      // Get question counts for all surveys
      const questionCountsMap =
        await SurveyQuestionService.getQuestionCountsForSurveys(
          supabase,
          surveyIds
        );

      // Get response metrics for all surveys
      const responseMetricsMap =
        await SurveyResponseService.getSurveyResponseMetrics(
          supabase,
          surveyIds
        );

      // Format the surveys for client
      const formattedSurveys = surveys.map((survey: any) => {
        // Get response metrics for this survey if available
        const metrics = responseMetricsMap.get(survey.id) || {
          responses: 0,
          completionRate: 0,
        };

        return formatSurveyForList(
          survey,
          questionCountsMap.get(survey.id) || 0,
          metrics.responses || 0,
          metrics.completionRate || 0
        );
      });

      return { success: true, data: formattedSurveys };
    } catch (error) {
      console.error("Error getting user surveys:", error);
      return { success: false, error };
    }
  }

  /**
   * Get user surveys (server-side)
   */
  static async getUserSurveysServer(
    supabase: any,
    userId: string
  ): Promise<ServiceResponse<SurveyListItem[]>> {
    try {
      // Get all surveys by the specified user
      const { data: surveys, error: surveysError } = await supabase
        .schema("veyoyee") // Use the veyoyee schema
        .from("surveys")
        .select("*")
        .eq("created_by", userId)
        .order("created_at", { ascending: false });

      if (surveysError) {
        throw surveysError;
      }

      // Extract survey IDs for bulk operations
      const surveyIds = surveys.map((survey: any) => survey.id);

      // Get question counts for all surveys
      const questionCountsMap =
        await SurveyQuestionService.getQuestionCountsForSurveys(
          supabase,
          surveyIds
        );

      // Get response metrics for all surveys
      const responseMetricsMap =
        await SurveyResponseService.getSurveyResponseMetrics(
          supabase,
          surveyIds
        );

      // Format the surveys for client
      const formattedSurveys = surveys.map((survey: any) => {
        // Get response metrics for this survey if available
        const metrics = responseMetricsMap.get(survey.id) || {
          responses: 0,
          completionRate: 0,
        };

        return formatSurveyForList(
          survey,
          questionCountsMap.get(survey.id) || 0,
          metrics.responses || 0,
          metrics.completionRate || 0
        );
      });

      return { success: true, data: formattedSurveys };
    } catch (error) {
      console.error("Error getting user surveys:", error);
      return { success: false, error };
    }
  }

  /**
   * Get public surveys (for explore page)
   */
  static async getPublicSurveysServer(
    supabase: any,
    excludeUserId?: string,
    includeAnsweredSurveys?: boolean
  ): Promise<ServiceResponse<SurveyListItem[]>> {
    try {
      // Get all active surveys
      let query = supabase
        .schema("veyoyee") // Use the veyoyee schema
        .from("surveys")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      // Exclude the current user's surveys if a userId is provided
      if (excludeUserId) {
        query = query.neq("created_by", excludeUserId);
      }

      const { data: surveys, error: surveysError } = await query;

      if (surveysError) {
        throw surveysError;
      }

      // If user is logged in, also exclude surveys they have already answered (unless includeAnsweredSurveys is true)
      let surveyData = surveys;
      if (excludeUserId && !includeAnsweredSurveys) {
        // Get surveys the user has already responded to (only completed responses)
        const { data: userResponses, error: responsesError } = await supabase
          .schema("veyoyee")
          .from("individual_responses")
          .select("survey_id")
          .eq("respondent_id", excludeUserId)
          .eq("is_complete", true); // Only exclude surveys with completed responses

        if (!responsesError && userResponses) {
          const answeredSurveyIds = userResponses.map((r: any) => r.survey_id);
          // Filter out surveys the user has already answered
          surveyData = surveys.filter(
            (survey: any) => !answeredSurveyIds.includes(survey.id)
          );
        }
      }

      // Extract survey IDs for bulk operations
      const surveyIds = surveyData.map((survey: any) => survey.id);

      // Get question counts for all surveys
      const questionCountsMap =
        await SurveyQuestionService.getQuestionCountsForSurveys(
          supabase,
          surveyIds
        );

      // Get response metrics for all surveys
      const responseMetricsMap =
        await SurveyResponseService.getSurveyResponseMetrics(
          supabase,
          surveyIds
        );

      // Format the surveys for client
      const formattedSurveys = surveys.map((survey: any) => {
        // Get response metrics for this survey if available
        const metrics = responseMetricsMap.get(survey.id) || {
          responses: 0,
          completionRate: 0,
        };

        return formatSurveyForList(
          survey,
          questionCountsMap.get(survey.id) || 0,
          metrics.responses || 0,
          metrics.completionRate || 0
        );
      });

      return { success: true, data: formattedSurveys };
    } catch (error) {
      console.error("Error getting public surveys:", error);
      return { success: false, error };
    }
  }

  /**
   * Get public surveys (client-side)
   */
  static async getPublicSurveys(
    excludeUserId?: string
  ): Promise<ServiceResponse<SurveyListItem[]>> {
    const supabase = getVeyoyeeClient();
    return this.getPublicSurveysServer(supabase, excludeUserId);
  }

  /**
   * End a survey early - close the survey and mark all pending responses as deleted
   */
  static async endSurveyEarly(
    surveyId: string,
    supabaseClient?: any
  ): Promise<ServiceResponse<void>> {
    const supabase = supabaseClient || getVeyoyeeClient();

    try {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // 1. Verify the user owns this survey
      const { data: survey, error: surveyError } = await supabase
        .schema("veyoyee")
        .from("surveys")
        .select("id, created_by, status")
        .eq("id", surveyId)
        .eq("created_by", user.id)
        .single();

      if (surveyError || !survey) {
        throw new Error("Survey not found or access denied");
      }

      if (survey.status === "closed") {
        throw new Error("Survey is already closed");
      }

      // 2. Start a transaction-like operation
      // First, mark all pending responses as deleted
      const { error: responsesError } = await supabase
        .schema("veyoyee")
        .from("individual_responses")
        .update({ status: "deleted" })
        .eq("survey_id", surveyId)
        .eq("status", "pending");

      if (responsesError) {
        throw responsesError;
      }

      // 3. Close the survey
      const { error: updateError } = await supabase
        .schema("veyoyee")
        .from("surveys")
        .update({
          status: "closed",
        })
        .eq("id", surveyId);

      if (updateError) {
        throw updateError;
      }

      return { success: true };
    } catch (error) {
      console.error("Error ending survey early:", error);
      return { success: false, error };
    }
  }

  /**
   * Reopen a closed survey (set status back to active)
   */
  static async reopenSurvey(
    surveyId: string,
    supabaseClient?: any
  ): Promise<ServiceResponse<void>> {
    const supabase = supabaseClient || getVeyoyeeClient();
    try {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User not authenticated");
      }
      // 1. Verify the user owns this survey
      const { data: survey, error: surveyError } = await supabase
        .schema("veyoyee")
        .from("surveys")
        .select("id, created_by, status")
        .eq("id", surveyId)
        .eq("created_by", user.id)
        .single();
      if (surveyError || !survey) {
        throw new Error("Survey not found or access denied");
      }
      if (survey.status !== "closed") {
        throw new Error("Survey is not closed");
      }
      // 2. Set status back to active
      const { error: updateError } = await supabase
        .schema("veyoyee")
        .from("surveys")
        .update({ status: "active" })
        .eq("id", surveyId);
      if (updateError) {
        throw updateError;
      }
      return { success: true };
    } catch (error) {
      console.error("Error reopening survey:", error);
      return { success: false, error };
    }
  }
}

import { getVeyoyeeClient } from "../../supabase/veyoyee-client";
import { ServiceResponse } from "./survey-types";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Response metrics for a survey
 */
export interface SurveyMetrics {
  responses: number;
  completionRate: number;
  lastResponseDate?: string;
}

interface MetricsResult {
  survey_id: string;
  responses: number;
  completion_rate: number;
  last_response_date: string | null;
}

/**
 * Service for handling survey response metrics
 */
export class SurveyMetricsService {
  /**
   * Get metrics for multiple surveys
   */
  static async getSurveyResponseMetrics(
    supabase: SupabaseClient,
    surveyIds: string[]
  ): Promise<Map<string, SurveyMetrics>> {
    try {
      if (!surveyIds.length) {
        return new Map();
      }

      // Use the database function to get metrics with proper grouping
      const { data, error } = await supabase.rpc("get_survey_metrics", {
        survey_ids: surveyIds,
      });

      if (error) {
        console.error("Error fetching survey metrics:", error);
        throw error;
      }

      // Convert to a Map for easier lookup
      const metricsMap = new Map<string, SurveyMetrics>();
      data?.forEach((item: MetricsResult) => {
        metricsMap.set(item.survey_id, {
          responses: Number(item.responses) || 0,
          completionRate: Number(item.completion_rate) || 0,
          lastResponseDate: item.last_response_date || undefined,
        });
      });

      return metricsMap;
    } catch (error) {
      console.error("Error getting survey metrics:", error);
      // Return an empty map on error
      return new Map();
    }
  }

  /**
   * Get metrics for a single survey
   */
  static async getSurveyMetrics(
    surveyId: string
  ): Promise<ServiceResponse<SurveyMetrics>> {
    const supabase = getVeyoyeeClient();

    try {
      const metricsMap = await this.getSurveyResponseMetrics(supabase, [
        surveyId,
      ]);

      const metrics = metricsMap.get(surveyId) || {
        responses: 0,
        completionRate: 0,
      };

      return { success: true, data: metrics };
    } catch (error) {
      console.error("Error getting survey metrics:", error);
      return { success: false, error };
    }
  }

  /**
   * Store a survey response and update metrics
   */
  static async recordSurveyResponse(
    surveyId: string,
    questionId: string,
    responseType: "option" | "rating" | "text",
    value: string | number,
    optionId?: string
  ): Promise<ServiceResponse<void>> {
    const supabase = getVeyoyeeClient();

    try {
      if (responseType === "option" && optionId) {
        // For multiple choice responses
        await supabase.rpc("aggregate_survey_response", {
          _survey_id: surveyId,
          _question_id: questionId,
          _response_option_id: optionId,
        });
      } else if (responseType === "rating" && typeof value === "number") {
        // For rating scale responses
        await supabase.rpc("aggregate_survey_response", {
          _survey_id: surveyId,
          _question_id: questionId,
          _rating_value: value,
        });
      } else if (responseType === "text" && typeof value === "string") {
        // For text responses
        await supabase.rpc("aggregate_survey_response", {
          _survey_id: surveyId,
          _question_id: questionId,
          _text_response: value,
        });
      } else {
        throw new Error("Invalid response type or value");
      }

      return { success: true };
    } catch (error) {
      console.error("Error recording survey response:", error);
      return { success: false, error };
    }
  }
}

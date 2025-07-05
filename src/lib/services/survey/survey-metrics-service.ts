import { getVeyoyeeClient } from "../../supabase/veyoyee-client";
import { ServiceResponse } from "./survey-types";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Response metrics for a survey
 */
export interface SurveyMetrics {
  responses: number;
  totalQuestions?: number;
  totalResponses?: number;
  responseDays?: number;
  completionRate: number;
  lastResponseDate?: string;
}

interface SurveyResponseData {
  survey_id: string;
  response_count: number;
  response_date: string;
}

interface SurveyMetricsAgg {
  totalResponses: number;
  responseDates: Set<string>;
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

      // Query the survey_responses table directly instead of using functions
      const { data: responseData, error } = await supabase
        .schema("veyoyee")
        .from("survey_responses")
        .select("survey_id, response_count, response_date")
        .in("survey_id", surveyIds);

      if (error) {
        console.error("Error fetching survey metrics:", error);
        throw error;
      }

      // Convert to a Map for easier lookup and calculate metrics in JS
      const metricsMap = new Map<string, SurveyMetrics>();

      // Initialize all surveys with zero metrics
      surveyIds.forEach((id) => {
        metricsMap.set(id, {
          responses: 0,
          totalQuestions: 0,
          totalResponses: 0,
          responseDays: 0,
          completionRate: 0,
          lastResponseDate: undefined,
        });
      });

      // Aggregate the data
      if (responseData) {
        const surveyMetrics: Record<string, SurveyMetricsAgg> = {};

        responseData.forEach((item: SurveyResponseData) => {
          const surveyId = item.survey_id;
          if (!surveyMetrics[surveyId]) {
            surveyMetrics[surveyId] = {
              totalResponses: 0,
              responseDates: new Set<string>(),
            };
          }

          surveyMetrics[surveyId].totalResponses += item.response_count || 0;
          if (item.response_date) {
            surveyMetrics[surveyId].responseDates.add(item.response_date);
          }
        });

        // Update the metrics map
        Object.entries(surveyMetrics).forEach(
          ([surveyId, metrics]: [string, SurveyMetricsAgg]) => {
            const sortedDates = Array.from(metrics.responseDates).sort();
            metricsMap.set(surveyId, {
              responses: metrics.totalResponses,
              totalResponses: metrics.totalResponses,
              responseDays: metrics.responseDates.size,
              completionRate: 0, // We'll calculate this properly later if needed
              lastResponseDate: sortedDates[sortedDates.length - 1],
            });
          }
        );
      }

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
        await supabase.schema("veyoyee").rpc("aggregate_survey_response", {
          input_survey_id: surveyId,
          input_question_id: questionId,
          input_response_option_id: optionId,
        });
      } else if (responseType === "rating" && typeof value === "number") {
        // For rating scale responses
        await supabase.schema("veyoyee").rpc("aggregate_survey_response", {
          input_survey_id: surveyId,
          input_question_id: questionId,
          input_rating_value: value,
        });
      } else if (responseType === "text" && typeof value === "string") {
        // For text responses
        await supabase.schema("veyoyee").rpc("aggregate_survey_response", {
          input_survey_id: surveyId,
          input_question_id: questionId,
          input_text_response: value,
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

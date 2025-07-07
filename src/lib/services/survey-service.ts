/* eslint-disable @typescript-eslint/no-explicit-any */
// This file is now just a barrel file re-exporting from the modular services
// For better organization, the implementation has been split into separate files
import { SurveyCoreService } from "./survey/survey-core-service";
import { SurveyResponseService } from "./survey/survey-response-service";
import { SurveyMetricsService } from "./survey/survey-metrics-service";
import { formatQuestionsForClient } from "./survey/survey-formatter";

// Re-export types
export type {
  SurveyData,
  DbSurvey,
  DbQuestion,
  DbQuestionOption,
  DbSurveyResponse,
  DbResponseAnswer,
  ResponseMetrics,
  FormattedSurvey,
  SurveyListItem,
  ServiceResponse,
} from "./survey/survey-types";

// Re-export metrics types
export type { SurveyMetrics } from "./survey/survey-metrics-service";

// Re-export the service classes
export class SurveyService {
  // Re-export core survey methods
  static async createSurvey(
    ...args: Parameters<typeof SurveyCoreService.createSurvey>
  ) {
    return SurveyCoreService.createSurvey(...args);
  }

  static async getSurveyById(
    ...args: Parameters<typeof SurveyCoreService.getSurveyById>
  ) {
    return SurveyCoreService.getSurveyById(...args);
  }

  static async updateSurvey(
    ...args: Parameters<typeof SurveyCoreService.updateSurvey>
  ) {
    return SurveyCoreService.updateSurvey(...args);
  }

  static async deleteSurvey(
    ...args: Parameters<typeof SurveyCoreService.deleteSurvey>
  ) {
    return SurveyCoreService.deleteSurvey(...args);
  }

  static async getUserSurveys(
    ...args: Parameters<typeof SurveyCoreService.getUserSurveys>
  ) {
    return SurveyCoreService.getUserSurveys(...args);
  }

  static async getUserSurveysServer(
    ...args: Parameters<typeof SurveyCoreService.getUserSurveysServer>
  ) {
    return SurveyCoreService.getUserSurveysServer(...args);
  }

  static async getPublicSurveys(
    ...args: Parameters<typeof SurveyCoreService.getPublicSurveys>
  ) {
    return SurveyCoreService.getPublicSurveys(...args);
  }

  static async getPublicSurveysServer(
    ...args: Parameters<typeof SurveyCoreService.getPublicSurveysServer>
  ) {
    return SurveyCoreService.getPublicSurveysServer(...args);
  }

  // Helper method for response metrics - keep this for backward compatibility
  static async getResponseMetrics(supabase: any, surveyIds: string[]) {
    // Try to use the new metrics service first, if that fails fall back to the old method
    try {
      return SurveyMetricsService.getSurveyResponseMetrics(supabase, surveyIds);
    } catch (error) {
      console.error(
        "Error using metrics service, falling back to old method:",
        error
      );
      return SurveyResponseService.getSurveyResponseMetrics(
        supabase,
        surveyIds
      );
    }
  }

  // New methods for survey metrics
  static async getSurveyMetrics(surveyId: string) {
    return SurveyMetricsService.getSurveyMetrics(surveyId);
  }

  static async recordSurveyResponse(
    surveyId: string,
    questionId: string,
    responseType: "option" | "rating" | "text",
    value: string | number,
    optionId?: string
  ) {
    return SurveyMetricsService.recordSurveyResponse(
      surveyId,
      questionId,
      responseType,
      value,
      optionId
    );
  }

  // Re-export response methods
  static async hasUserAnsweredSurvey(
    ...args: Parameters<typeof SurveyResponseService.hasUserAnsweredSurvey>
  ) {
    return SurveyResponseService.hasUserAnsweredSurvey(...args);
  }

  static async getUserAnsweredSurveyIds(
    ...args: Parameters<typeof SurveyResponseService.getUserAnsweredSurveyIds>
  ) {
    return SurveyResponseService.getUserAnsweredSurveyIds(...args);
  }

  static async getUserAnsweredSurveyIdsServer(
    ...args: Parameters<
      typeof SurveyResponseService.getUserAnsweredSurveyIdsServer
    >
  ) {
    return SurveyResponseService.getUserAnsweredSurveyIdsServer(...args);
  }

  static async getSurveyResponses(
    ...args: Parameters<typeof SurveyResponseService.getSurveyResponses>
  ) {
    return SurveyResponseService.getSurveyResponses(...args);
  }

  static async getSurveyResponsesWithAnswers(
    ...args: Parameters<
      typeof SurveyResponseService.getSurveyResponsesWithAnswers
    >
  ) {
    return SurveyResponseService.getSurveyResponsesWithAnswers(...args);
  }

  static async getResponseAnswers(
    ...args: Parameters<typeof SurveyResponseService.getResponseAnswers>
  ) {
    return SurveyResponseService.getResponseAnswers(...args);
  }

  // Response management methods
  static async acceptResponse(
    ...args: Parameters<typeof SurveyResponseService.acceptResponse>
  ) {
    return SurveyResponseService.acceptResponse(...args);
  }

  static async rejectResponse(
    ...args: Parameters<typeof SurveyResponseService.rejectResponse>
  ) {
    return SurveyResponseService.rejectResponse(...args);
  }

  static async deleteResponse(
    ...args: Parameters<typeof SurveyResponseService.deleteResponse>
  ) {
    return SurveyResponseService.deleteResponse(...args);
  }

  static async endSurveyEarly(
    ...args: Parameters<typeof SurveyCoreService.endSurveyEarly>
  ) {
    return SurveyCoreService.endSurveyEarly(...args);
  }

  static async reopenSurvey(
    ...args: Parameters<typeof SurveyCoreService.reopenSurvey>
  ) {
    return SurveyCoreService.reopenSurvey(...args);
  }
}

// Also export the formatting functions for backward compatibility
export { formatQuestionsForClient };

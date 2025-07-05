/* eslint-disable @typescript-eslint/no-explicit-any */
// This file is now just a barrel file re-exporting from the modular services
// For better organization, the implementation has been split into separate files
import { SurveyCoreService } from "./survey/survey-core-service";
import { SurveyResponseService } from "./survey/survey-response-service";
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
    return SurveyResponseService.getSurveyResponseMetrics(supabase, surveyIds);
  }
}

// Also export the formatting functions for backward compatibility
export { formatQuestionsForClient };

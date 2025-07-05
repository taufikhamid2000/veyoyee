"use client";

import { useCallback, useState } from "react";
import {
  SurveyData,
  SurveyListItem,
  FormattedSurvey,
} from "../lib/services/survey-service";

// Custom hook for survey operations
export function useSurveyActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create survey
  const createSurvey = useCallback(
    async (surveyData: SurveyData, status: "draft" | "active" = "draft") => {
      setIsLoading(true);
      setError(null);

      try {
        // Import dynamically
        const { SurveyService } = await import(
          "../lib/services/survey-service"
        );
        const result = await SurveyService.createSurvey(surveyData, status);

        if (!result.success) {
          throw new Error(
            result.error instanceof Error
              ? result.error.message
              : "Failed to create survey"
          );
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(new Error(errorMessage));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Update survey
  const updateSurvey = useCallback(
    async (
      surveyId: string,
      surveyData: SurveyData,
      status?: "draft" | "active" | "closed"
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const { SurveyService } = await import(
          "../lib/services/survey-service"
        );
        const result = await SurveyService.updateSurvey(
          surveyId,
          surveyData,
          status
        );

        if (!result.success) {
          throw new Error(
            result.error instanceof Error
              ? result.error.message
              : "Failed to update survey"
          );
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(new Error(errorMessage));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get survey
  const getSurvey = useCallback(
    async (surveyId: string): Promise<FormattedSurvey> => {
      setIsLoading(true);
      setError(null);

      try {
        const { SurveyService } = await import(
          "../lib/services/survey-service"
        );
        const result = await SurveyService.getSurveyById(surveyId);

        if (!result.success) {
          throw new Error(
            result.error instanceof Error
              ? result.error.message
              : "Failed to get survey"
          );
        }

        if (!result.data) {
          throw new Error("Survey data is missing");
        }

        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(new Error(errorMessage));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Delete survey
  const deleteSurvey = useCallback(async (surveyId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { SurveyService } = await import("../lib/services/survey-service");
      const result = await SurveyService.deleteSurvey(surveyId);

      if (!result.success) {
        throw new Error(
          result.error instanceof Error
            ? result.error.message
            : "Failed to delete survey"
        );
      }

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(new Error(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get user's surveys
  const getUserSurveys = useCallback(
    async (userId?: string): Promise<SurveyListItem[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const { SurveyService } = await import(
          "../lib/services/survey-service"
        );
        const result = await SurveyService.getUserSurveys(userId);

        if (!result.success) {
          throw new Error(
            result.error instanceof Error
              ? result.error.message
              : "Failed to get user surveys"
          );
        }

        if (!result.data) {
          return []; // Return empty array if no data
        }

        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(new Error(errorMessage));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get public surveys
  const getPublicSurveys = useCallback(
    async (excludeUserId?: string): Promise<SurveyListItem[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const { SurveyService } = await import(
          "../lib/services/survey-service"
        );
        const result = await SurveyService.getPublicSurveys(excludeUserId);

        if (!result.success) {
          throw new Error(
            result.error instanceof Error
              ? result.error.message
              : "Failed to get public surveys"
          );
        }

        if (!result.data) {
          return []; // Return empty array if no data
        }

        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(new Error(errorMessage));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    createSurvey,
    updateSurvey,
    getSurvey,
    deleteSurvey,
    getUserSurveys,
    getPublicSurveys,
    isLoading,
    error,
  };
}

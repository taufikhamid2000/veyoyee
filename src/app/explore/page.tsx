import { createServerClient } from "@/lib/supabase/server";
import { mockSurveys, Survey } from "@/data/dashboard-data";
import ExploreClient from "./ExploreClient";
import { Metadata } from "next";
import InfoTooltip from "@/components/ui/InfoTooltip";
import { SurveyService, SurveyListItem } from "@/lib/services/survey-service";

export const metadata: Metadata = {
  title: "Explore Surveys - Veyoyee",
  description: "Browse and participate in public surveys on Veyoyee.",
};

export default async function ExploreSurveysPage() {
  // Get current user
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getUser();
  const userId = data?.user?.id;

  // Fetch public surveys from Supabase, excluding the current user's surveys
  let publicSurveys: Survey[] = [];
  let answeredSurveyIds: string[] = [];

  try {
    const result = await SurveyService.getPublicSurveysServer(supabase, userId);
    if (result.success && Array.isArray(result.data)) {
      publicSurveys = result.data.map(
        (survey: SurveyListItem): Survey => ({
          id: survey.id,
          title: survey.title,
          type: survey.type,
          status: survey.status,
          minRespondents: survey.minRespondents || undefined,
          maxRespondents: survey.maxRespondents || undefined,
          startDate: survey.startDate || undefined,
          endDate: survey.endDate || undefined,
          rewardAmount: survey.rewardAmount || undefined,
          createdBy: survey.createdBy,
          responses: survey.responses,
          completionRate: survey.completionRate,
          lastUpdated: survey.lastUpdated,
          questions: survey.questions,
          createdAt: survey.createdAt,
          updatedAt: survey.updatedAt,
        })
      );
    } else {
      console.error("Error fetching public surveys:", result.error);
      // Fallback to mock data if there's an error
      publicSurveys = mockSurveys.filter(
        (survey) => survey.createdBy && survey.createdBy !== userId
      );
    }
  } catch (error) {
    console.error("Failed to fetch public surveys:", error);
    // Fallback to mock data if there's an error
    publicSurveys = mockSurveys.filter(
      (survey) => survey.createdBy && survey.createdBy !== userId
    );
  }

  // Fetch answered survey IDs if user is logged in
  if (userId) {
    try {
      const answeredResult = await SurveyService.getUserAnsweredSurveyIdsServer(
        supabase,
        userId
      );
      if (answeredResult.success && answeredResult.data) {
        answeredSurveyIds = answeredResult.data;
      } else {
        console.error(
          "Error fetching answered survey IDs:",
          answeredResult.error
        );
      }
    } catch (error) {
      console.error("Failed to fetch answered survey IDs:", error);
    }
  }

  return (
    <div className="min-w-0 w-screen max-w-none bg-inherit">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
          Explore Surveys
        </h1>
        <p className="mb-8 text-gray-900 dark:text-gray-400 max-w-2xl">
          Browse public surveys and participate to share your insights. Use the
          filters to find surveys that interest you.
        </p>
        {/* User survey stats */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="bg-blue-900 dark:bg-blue-900/30 rounded-lg px-5 py-3 flex-1 flex items-center gap-3">
            <span className="font-semibold text-blue-900 dark:text-white">
              Academia Surveys Answered:
            </span>
            <span className="text-lg font-bold text-blue-900 dark:text-white">
              72
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              / 100 for SCP
              <InfoTooltip
                tooltip={
                  <>
                    <strong>Survey Creation Pass (SCP):</strong> <br />
                    Answer 100 Academia surveys to unlock the ability to create
                    your own surveys on Veyoyee!
                  </>
                }
              >
                <span className="inline-block w-4 h-4 align-middle"></span>
              </InfoTooltip>
            </span>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg px-5 py-3 flex-1 flex items-center gap-3">
            <span className="font-semibold text-green-900 dark:text-white">
              Commerce Surveys Answered:
            </span>
            <span className="text-lg font-bold text-green-900 dark:text-white">
              RM 8.20
            </span>
          </div>
        </div>
        <div className="w-full px-0 md:px-0">
          <ExploreClient
            surveys={publicSurveys}
            answeredSurveyIds={answeredSurveyIds}
          />
        </div>
      </div>
    </div>
  );
}

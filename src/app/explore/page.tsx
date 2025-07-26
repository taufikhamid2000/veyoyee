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
    <div className="relative min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 py-8 px-2 sm:px-4 md:px-6">
      <div className="max-w-5xl mx-auto rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-6 md:p-10 mb-10 border border-blue-900">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent mb-2">
          Explore Surveys
        </h1>
        <p className="mb-8 text-blue-100 max-w-2xl text-lg">
          Browse public surveys and participate to share your insights. Use the
          filters to find surveys that interest you.
        </p>
        {/* User survey stats */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="bg-blue-900/80 rounded-xl px-5 py-4 flex-1 flex items-center gap-3 shadow-lg border border-blue-800">
            <span className="font-semibold text-blue-100">
              Academia Surveys Answered:
            </span>
            <span className="text-2xl font-bold text-blue-100">72</span>
            <span className="text-xs text-blue-300 flex items-center gap-1">
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
          <div className="bg-green-900/80 rounded-xl px-5 py-4 flex-1 flex items-center gap-3 shadow-lg border border-green-800">
            <span className="font-semibold text-green-100">
              Commerce Surveys Answered:
            </span>
            <span className="text-2xl font-bold text-green-100">RM 8.20</span>
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

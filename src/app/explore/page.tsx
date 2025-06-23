import { createServerClient } from "@/utils/supabase/server";
import { mockSurveys } from "@/app/dashboard/data";
import ExploreClient from "./ExploreClient";
import { Metadata } from "next";
import InfoTooltip from "@/components/ui/InfoTooltip";

export const metadata: Metadata = {
  title: "Explore Surveys - Veyoyee",
  description: "Browse and participate in public surveys on Veyoyee.",
};

export default async function ExploreSurveysPage() {
  // Get current user
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getUser();
  const userId = data?.user?.id;

  // Only show surveys not created by the current user
  const publicSurveys = mockSurveys.filter(
    (survey) => survey.createdBy && survey.createdBy !== userId
  );

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Explore Surveys
      </h1>
      <p className="mb-8 text-gray-500 dark:text-gray-400 max-w-2xl">
        Browse public surveys and participate to share your insights. Use the
        filters to find surveys that interest you.
      </p>
      {/* User survey stats */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 md:gap-8">
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg px-5 py-3 flex-1 flex items-center gap-3">
          <span className="font-semibold text-blue-700 dark:text-blue-300">
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
          <span className="font-semibold text-green-700 dark:text-green-300">
            Commerce Surveys Answered:
          </span>
          <span className="text-lg font-bold text-green-900 dark:text-white">
            RM 8.20
          </span>
          <span className="text-xs text-gray-500">(RM 0.10 per survey)</span>
        </div>
      </div>
      <ExploreClient surveys={publicSurveys} />
    </div>
  );
}

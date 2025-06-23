import { createServerClient } from "@/utils/supabase/server";
import { mockSurveys } from "@/app/dashboard/data";
import SurveyCard from "@/components/dashboard/SurveyCard";
import { Metadata } from "next";

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
      {/* Survey Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicSurveys.map((survey) => (
          <SurveyCard key={survey.id} {...survey} />
        ))}
      </div>
      {/* TODO: Add search/filter controls and pagination if needed */}
    </div>
  );
}

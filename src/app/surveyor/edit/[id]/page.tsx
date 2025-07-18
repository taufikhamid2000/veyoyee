"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { SurveyCoreService } from "@/lib/services/survey";
import { getVeyoyeeClient } from "@/lib/supabase/veyoyee-client";
import SurveyForm from "../../SurveyForm";
import type { SurveyEdit } from "@/data/surveyor-data";

interface PageParams {
  id: string;
}

export default function EditSurveyPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [survey, setSurvey] = useState<SurveyEdit | null>(null);

  useEffect(() => {
    async function fetchSurvey() {
      try {
        // Get the Supabase client for client-side operations
        const supabase = getVeyoyeeClient();

        // Get the current user first
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setError("You must be logged in to edit surveys.");
          setLoading(false);
          return;
        }

        // First, let's check if the survey exists at all
        const { data: surveyCheck, error: surveyCheckError } = await supabase
          .schema("veyoyee")
          .from("surveys")
          .select("id, title, status, created_by")
          .eq("id", id)
          .single();

        if (surveyCheckError) {
          setError("Survey not found.");
          setLoading(false);
          return;
        }

        // Check if the current user can edit this survey
        if (surveyCheck.created_by !== user.id) {
          setError(
            "You don't have permission to edit this survey. Only the survey creator can edit it."
          );
          setLoading(false);
          return;
        }

        // Fetch the survey using the core service
        const { success, data: surveyData } =
          await SurveyCoreService.getSurveyById(id, supabase);

        if (!success || !surveyData) {
          // If the survey exists but the service failed, try to create a minimal survey object
          if (surveyCheck) {
            const fallbackSurvey: SurveyEdit = {
              id: surveyCheck.id,
              title: surveyCheck.title,
              type: "academia", // Default type
              status: surveyCheck.status,
              lastUpdated: new Date().toISOString(),
              createdBy: surveyCheck.created_by,
              minRespondents: 0,
              maxRespondents: 0,
              startDate: "",
              endDate: "",
              rewardAmount: "",
              questions: [], // Empty questions array
            };

            setSurvey(fallbackSurvey);
            setLoading(false);
            return;
          }

          setError("Failed to load survey data.");
          setLoading(false);
          return;
        }

        // Transform the survey data to match SurveyForm's expected format
        const initialSurvey: SurveyEdit = {
          id: surveyData.id,
          title: surveyData.title,
          type: surveyData.type,
          status: surveyData.status,
          lastUpdated: surveyData.updatedAt,
          createdBy: surveyData.createdBy,
          minRespondents: surveyData.minRespondents ?? 0,
          maxRespondents: surveyData.maxRespondents ?? 0,
          startDate: surveyData.startDate ?? "",
          endDate: surveyData.endDate ?? "",
          rewardAmount: surveyData.rewardAmount ?? "",
          questions: surveyData.questions,
        };

        setSurvey(initialSurvey);
        setLoading(false);
      } catch {
        setError("An error occurred while loading the survey.");
        setLoading(false);
      }
    }

    fetchSurvey();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading survey...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/surveyor")}
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to My Surveys
          </button>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">
            Survey Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The survey you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/surveyor")}
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to My Surveys
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6">Edit Survey</h1>
      {survey.questions.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800">
            <strong>Note:</strong> This survey appears to have no questions. You
            can add questions below.
          </p>
        </div>
      )}
      <SurveyForm initialSurvey={survey} />
    </div>
  );
}

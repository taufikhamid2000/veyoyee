import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { SurveyService } from "@/lib/services/survey-service";
import SurveyResultsClient from "./SurveyResultsClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SurveyResultsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Get server supabase client
  const supabase = await createServerClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return notFound();
  }

  try {
    // Fetch survey data using server client for proper authentication
    const surveyResult = await SurveyService.getSurveyById(id, supabase);
    if (!surveyResult.success || !surveyResult.data) {
      return notFound();
    }

    const survey = surveyResult.data;

    // Check if user owns this survey
    if (survey.createdBy !== user.id) {
      return notFound();
    }

    // Don't show results for draft surveys (but allow active and closed surveys)
    if (survey.status === "draft") {
      return notFound();
    }

    // Fetch survey responses using server client for proper authentication
    const responsesResult = await SurveyService.getSurveyResponsesWithAnswers(
      id,
      supabase
    );
    const responses = responsesResult.success ? responsesResult.data || [] : [];

    return (
      <SurveyResultsClient
        survey={survey}
        responses={responses}
        surveyId={id}
      />
    );
  } catch (error) {
    console.error("Error fetching survey results:", error);
    return notFound();
  }
}

import { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { mockActivities, getDashboardStats, Survey } from "../../data";
import DashboardClient from "@/app/dashboard/DashboardClient";
import { SurveyService, SurveyListItem } from "@/lib/services/survey-service";

export const metadata: Metadata = {
  title: "Dashboard - Veyoyee",
  description: "Your Veyoyee Dashboard",
};

// Ensure page is always rendered fresh on request
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  // Server-side auth check
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.getUser();

  // Redirect to login if no user is found
  if (!data?.user || error) {
    redirect("/auth/signin");
  }

  // Get user profile if user exists
  let userProfile = null;
  const userMetadata = data.user.user_metadata;

  try {
    // Try to get profile from the profiles table
    const profileResponse = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileResponse.data) {
      userProfile = profileResponse.data;
    } else {
      // Create a profile-like object from user metadata
      userProfile = {
        id: data.user.id,
        first_name: userMetadata?.first_name || "User",
        last_name: userMetadata?.last_name || "",
        role: userMetadata?.role || "user",
        email: data.user.email,
      };
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
    // Fallback profile if fetch fails
    userProfile = {
      id: data.user.id,
      first_name: userMetadata?.first_name || "User",
      last_name: userMetadata?.last_name || "",
      role: userMetadata?.role || "user",
      email: data.user.email,
    };
  }

  // Fetch real surveys for the current user from Supabase
  let userSurveys: Survey[] = [];
  try {
    // Use the server version of getUserSurveys with the existing supabase server client
    const surveyResult = await SurveyService.getUserSurveysServer(
      supabase,
      data.user.id
    );
    if (surveyResult.success && Array.isArray(surveyResult.data)) {
      // The API returns SurveyListItem type, we need to convert to Survey type
      userSurveys = surveyResult.data.map(
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
      console.error("Error fetching user surveys:", surveyResult.error);
    }
  } catch (error) {
    console.error("Failed to fetch user surveys:", error);
  }

  // Get dashboard statistics based on the user's surveys
  const stats = getDashboardStats(userSurveys);

  return (
    <DashboardClient
      userProfile={userProfile}
      stats={stats}
      surveys={userSurveys}
      activities={mockActivities}
      debugSession={process.env.NODE_ENV === "development" ? data : undefined}
    />
  );
}

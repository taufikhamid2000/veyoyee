import { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { mockSurveys, mockActivities, getDashboardStats } from "../../data";
import DashboardClient from "@/app/dashboard/DashboardClient";

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
    console.log("Dashboard auth check failed:", error?.message);
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

  // Only show surveys owned by the current user
  const userSurveys = mockSurveys.filter(
    (survey) => survey.createdBy === data.user.id
  );

  // Get dashboard statistics (optionally, you may want to compute stats only for userSurveys)
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

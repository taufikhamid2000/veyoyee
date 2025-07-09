import { createServerClient } from "@/lib/supabase/server";
import ListSurveyPage from "./ListSurveyClient";
import { redirect } from "next/navigation";

export default async function ListSurveyPageWrapper() {
  // Server-side auth check
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (!data?.user || error) {
    redirect("/auth/signin");
  }

  // Fetch closed surveys for the current user
  const { data: surveys, error: surveyError } = await supabase
    .schema("veyoyee")
    .from("surveys")
    .select("id, title, description, price, status, created_by")
    .eq("created_by", data.user.id)
    .eq("status", "closed");

  if (surveyError) {
    console.error("Error fetching closed surveys:", surveyError.message);
    return (
      <div className="text-red-600 text-center mt-8">
        Failed to load your closed surveys. Please try again later.
      </div>
    );
  }

  const closedSurveys = Array.isArray(surveys)
    ? surveys.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        price: s.price ?? 0,
      }))
    : [];

  return <ListSurveyPage closedSurveys={closedSurveys} />;
}

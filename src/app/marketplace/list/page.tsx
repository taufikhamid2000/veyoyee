import { createServerClient } from "@/lib/supabase/server";
import ListSurveyPage from "./ListSurveyClient";
import { redirect } from "next/navigation";

// Define a type for the survey row
interface SurveyRow {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  start_date: string | null;
  end_date: string | null;
  reward_amount: number | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  owned_by: string;
}

export default async function ListSurveyPageWrapper() {
  // Server-side auth check
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (!data?.user || error) {
    redirect("/auth/signin");
  }

  // 1. Fetch all listed survey_ids from marketplace
  const { data: listings, error: listingsError } = await supabase
    .schema("veyoyee")
    .from("marketplace")
    .select("survey_id");

  if (listingsError) {
    console.error(
      "Error fetching marketplace listings:",
      listingsError.message
    );
    return (
      <div className="text-red-600 text-center mt-8">
        Failed to load marketplace listings. Please try again later.
      </div>
    );
  }

  const listedIds = (listings ?? []).map((l) => l.survey_id).filter(Boolean);

  // 2. Fetch closed surveys for the current user, excluding already listed ones
  let surveyQuery = supabase
    .schema("veyoyee")
    .from("surveys")
    .select(
      [
        "id",
        "title",
        "description",
        "price",
        "type",
        "start_date",
        "end_date",
        "reward_amount",
        "created_at",
        "updated_at",
        "created_by",
        "owned_by",
      ].join(", ")
    )
    .eq("created_by", data.user.id)
    .eq("status", "closed");

  if (listedIds.length > 0) {
    surveyQuery = surveyQuery.not("id", "in", `(${listedIds.join(",")})`);
  }

  const { data: surveys, error: surveyError } = await surveyQuery;

  if (surveyError) {
    console.error("Error fetching closed surveys:", surveyError.message);
    return (
      <div className="text-red-600 text-center mt-8">
        Failed to load your closed surveys. Please try again later.
      </div>
    );
  }

  const closedSurveys = Array.isArray(surveys)
    ? surveys
        .filter(
          (s) =>
            s &&
            typeof s === "object" &&
            !("error" in s) &&
            "id" in s &&
            "title" in s
        )
        .map((s) => {
          const row = s as SurveyRow;
          return {
            id: row.id,
            title: row.title,
            description: row.description,
            price: row.price ?? 0,
            type: row.type,
            start_date: row.start_date,
            end_date: row.end_date,
            reward_amount: row.reward_amount,
            created_at: row.created_at,
            updated_at: row.updated_at,
            created_by: row.created_by,
            owned_by: row.owned_by,
          };
        })
    : [];

  return <ListSurveyPage closedSurveys={closedSurveys} />;
}

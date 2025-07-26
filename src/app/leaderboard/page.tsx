"use client";
import { useEffect, useState } from "react";
import { getVeyoyeeClient } from "@/lib/supabase/veyoyee-client";
import { RespondentRankingData } from "@/components/leaderboard/types";
import LeaderboardHeader from "@/components/leaderboard/LeaderboardHeader";
import QualityNotice from "@/components/leaderboard/QualityNotice";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import LeaderboardCards from "@/components/leaderboard/LeaderboardCards";
import LeaderboardFooter from "@/components/leaderboard/LeaderboardFooter";
import LoadingState from "@/components/leaderboard/LoadingState";
import ErrorState from "@/components/leaderboard/ErrorState";

export default function RespondentRankingPage() {
  const [respondents, setRespondents] = useState<RespondentRankingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRespondents();
  }, []);

  const loadRespondents = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = getVeyoyeeClient();

      const { data, error: fetchError } = await supabase
        .schema("veyoyee")
        .from("users")
        .select(
          `
          id,
          username,
          display_name,
          total_reputation,
          responses_accepted,
          responses_rejected,
          surveys_created,
          created_at,
          updated_at
        `
        )
        .order("total_reputation", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setRespondents(data || []);
    } catch (err) {
      console.error("Error loading respondents:", err);
      setError("Failed to load respondent data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadRespondents} />;
  }

  const totalResponses = respondents.reduce(
    (sum, r) => sum + r.responses_accepted,
    0
  );
  const totalReputation = respondents.reduce(
    (sum, r) => sum + r.total_reputation,
    0
  );
  const totalSurveys = respondents.reduce(
    (sum, r) => sum + r.surveys_created,
    0
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 py-8 px-2 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-6 md:p-10 mb-10 border border-blue-900">
        <LeaderboardHeader
          totalMembers={respondents.length}
          totalResponses={totalResponses}
          totalReputation={totalReputation}
          totalSurveys={totalSurveys}
        />

        <QualityNotice />

        <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden mt-8">
          <LeaderboardTable respondents={respondents} />
          <LeaderboardCards respondents={respondents} />
        </div>

        <LeaderboardFooter />
      </div>
    </div>
  );
}

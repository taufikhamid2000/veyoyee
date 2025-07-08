export interface RespondentRankingData {
  id: string;
  username?: string;
  display_name?: string;
  total_reputation: number;
  responses_accepted: number;
  responses_rejected: number;
  surveys_created: number;
  created_at: string;
  updated_at: string;
}

export interface PerformanceTier {
  label: string;
  color: string;
  bg: string;
}

export const getAcceptanceRate = (
  accepted: number,
  rejected: number
): number => {
  const total = accepted + rejected;
  if (total === 0) return 0;
  return Math.round((accepted / total) * 100);
};

export const getPerformanceTier = (rate: number): PerformanceTier => {
  if (rate >= 95)
    return {
      label: "Elite",
      color: "text-purple-600",
      bg: "bg-purple-50 border-purple-200",
    };
  if (rate >= 85)
    return {
      label: "Expert",
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
    };
  if (rate >= 75)
    return {
      label: "Proficient",
      color: "text-green-600",
      bg: "bg-green-50 border-green-200",
    };
  if (rate >= 60)
    return {
      label: "Developing",
      color: "text-yellow-600",
      bg: "bg-yellow-50 border-yellow-200",
    };
  return {
    label: "Novice",
    color: "text-gray-600",
    bg: "bg-gray-50 border-gray-200",
  };
};

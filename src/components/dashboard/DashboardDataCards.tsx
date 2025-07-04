"use client";

import { useState } from "react";
import { useSupabaseFetch } from "@/hooks/useSupabaseFetch";
import { LoadingCard } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { SkeletonStats } from "@/components/ui/skeleton";

interface DashboardStats {
  activeSurveys: number;
  totalResponses: number;
  conversionRate: string;
}

interface DashboardClientProps {
  initialData?: {
    stats: DashboardStats;
    [key: string]: unknown;
  };
}

export function DashboardDataCards({ initialData }: DashboardClientProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  // Example of using our hook with Supabase
  const { data, isLoading, error, isRefetching, refetch } = useSupabaseFetch<{
    stats: DashboardStats;
    [key: string]: unknown;
  }>(
    async (supabase) => {
      try {
        // Simulate a delay to show loading state
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // This is a mock fetch - in a real app you would fetch from Supabase
        const { data: surveyData, error: surveyError } = await supabase
          .from("surveys")
          .select("*")
          .limit(5);

        // If no data in Supabase yet, return mock data
        if (!surveyError && (!surveyData || surveyData.length === 0)) {
          return {
            data: initialData || {
              stats: {
                activeSurveys: 3,
                totalResponses: 124,
                conversionRate: "68%",
              },
            },
            error: null,
          };
        }

        // Process survey data to create stats
        const statsData = {
          stats: {
            activeSurveys: surveyData?.length || 0,
            totalResponses:
              surveyData?.reduce(
                (acc, survey) => acc + (survey.responses_count || 0),
                0
              ) || 0,
            conversionRate: calculateConversionRate(surveyData),
          },
        };

        return { data: statsData, error: null };
      } catch (err) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
        };
      }
    },
    [refreshKey]
  );

  interface SurveyData {
    id: string;
    views?: number;
    completions?: number;
    responses_count?: number;
    [key: string]: unknown;
  }

  // Helper function to calculate conversion rate from survey data
  const calculateConversionRate = (surveyData: SurveyData[] | null): string => {
    if (!surveyData || surveyData.length === 0) return "0%";

    let views = 0;
    let completions = 0;

    surveyData.forEach((survey) => {
      views += survey.views || 0;
      completions += survey.completions || 0;
    });

    if (views === 0) return "0%";
    return `${Math.round((completions / views) * 100)}%`;
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Dashboard Data</h3>
        <Button
          onClick={handleRefresh}
          loading={isRefetching}
          loadingText="Refreshing..."
          size="sm"
          variant="outline"
        >
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LoadingCard
          isLoading={isLoading}
          fallback={<SkeletonStats />}
          className="p-6"
        >
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Active Surveys</span>
            <span className="text-2xl font-bold">
              {data?.stats?.activeSurveys || 0}
            </span>
          </div>
        </LoadingCard>

        <LoadingCard
          isLoading={isLoading}
          fallback={<SkeletonStats />}
          className="p-6"
        >
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total Responses</span>
            <span className="text-2xl font-bold">
              {data?.stats?.totalResponses || 0}
            </span>
          </div>
        </LoadingCard>

        <LoadingCard
          isLoading={isLoading}
          fallback={<SkeletonStats />}
          className="p-6"
        >
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Conversion Rate</span>
            <span className="text-2xl font-bold">
              {data?.stats?.conversionRate || "0%"}
            </span>
          </div>
        </LoadingCard>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          Error loading data: {error.message}
        </div>
      )}
    </div>
  );
}

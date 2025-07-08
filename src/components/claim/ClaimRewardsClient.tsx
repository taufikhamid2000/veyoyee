"use client";

import React, { useEffect, useState } from "react";
import InfoTooltip from "@/components/ui/InfoTooltip";
import {
  UserRewardsService,
  UserRewardsData,
} from "@/lib/services/user-rewards-service";

export default function ClaimRewardsClient() {
  const [rewardsData, setRewardsData] = useState<UserRewardsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [claimingType, setClaimingType] = useState<"scp" | "commerce" | null>(
    null
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadRewardsData();
  }, []);

  const loadRewardsData = async () => {
    setLoading(true);
    try {
      const data = await UserRewardsService.getUserRewards();
      setRewardsData(data);
    } catch (error) {
      console.error("Error loading rewards data:", error);
      setMessage({ type: "error", text: "Failed to load rewards data" });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSCP = async () => {
    if (!rewardsData || !rewardsData.canClaimSCP) return;

    setClaimingType("scp");
    try {
      const result = await UserRewardsService.claimSCP();
      if (result.success) {
        setMessage({
          type: "success",
          text: "Successfully exchanged 100 responses for 1 Survey Creation Pass!",
        });
        await loadRewardsData(); // Refresh data
      } else {
        setMessage({
          type: "error",
          text: "Failed to claim SCP. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error claiming SCP:", error);
      setMessage({
        type: "error",
        text: "An error occurred while claiming SCP",
      });
    } finally {
      setClaimingType(null);
    }
  };

  const handleClaimCommerceRewards = async () => {
    if (!rewardsData || rewardsData.availableCommerceRewards <= 0) return;

    setClaimingType("commerce");
    try {
      const result = await UserRewardsService.claimCommerceRewards();
      if (result.success && result.amount) {
        setMessage({
          type: "success",
          text: `Successfully claimed RM ${result.amount.toFixed(
            2
          )} in commerce rewards!`,
        });
        await loadRewardsData(); // Refresh data
      } else {
        setMessage({
          type: "error",
          text: "Failed to claim commerce rewards. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error claiming commerce rewards:", error);
      setMessage({
        type: "error",
        text: "An error occurred while claiming commerce rewards",
      });
    } finally {
      setClaimingType(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 max-w-xl">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Loading rewards data...
          </span>
        </div>
      </div>
    );
  }

  if (!rewardsData) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 max-w-xl">
        <div className="bg-red-100 dark:bg-red-900 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">
            Failed to load rewards data. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 max-w-xl">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Claim Rewards
      </h1>

      {/* Success/Error Messages */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-8 flex flex-col gap-6">
        {/* SCP Claim */}
        <div className="bg-blue-100 dark:bg-blue-900 rounded-lg px-6 py-5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-900 dark:text-white">
              Survey Creation Pass (SCP)
            </span>
            <InfoTooltip
              tooltip={
                <>
                  <strong>Survey Creation Pass (SCP):</strong> <br />
                  Exchange 100 accepted responses for 1 SCP to unlock the
                  ability to create your own surveys on Veyoyee! This will
                  deduct 100 from your response count.
                </>
              }
            >
              <span className="inline-block w-4 h-4 align-middle"></span>
            </InfoTooltip>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-900 dark:text-white">
              {rewardsData.academiaAnswered}
            </span>
            <span className="text-xs text-gray-500">
              quality responses available
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
            <span>SCPs owned: {rewardsData.scpOwned}</span>
          </div>
          <button
            onClick={handleClaimSCP}
            disabled={!rewardsData.canClaimSCP || claimingType === "scp"}
            className={`mt-2 px-5 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {claimingType === "scp" ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Exchanging...
              </div>
            ) : rewardsData.canClaimSCP ? (
              "Exchange 100 Responses for 1 SCP"
            ) : (
              "Need 100 responses to exchange"
            )}
          </button>
        </div>

        {/* Commerce Reward Claim */}
        <div className="bg-green-100 dark:bg-green-950 rounded-lg px-6 py-5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-green-900 dark:text-white">
              Commerce Rewards
            </span>
            <InfoTooltip
              tooltip={
                <>
                  <strong>Commerce Rewards:</strong> <br />
                  Different Commerce surveys may offer different amounts of
                  money! Rewards are distributed when the survey closes.
                </>
              }
            >
              <span className="inline-block w-4 h-4 align-middle"></span>
            </InfoTooltip>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-900 dark:text-white">
              RM {rewardsData.availableCommerceRewards.toFixed(2)}
            </span>
            <span className="text-xs text-gray-900 dark:text-white">
              ({rewardsData.commerceAnswered} answered)
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
            <span>
              Total earned: RM {rewardsData.commerceRewardsEarned.toFixed(2)}
            </span>
            <span>•</span>
            <span>
              Total claimed: RM {rewardsData.commerceRewardsClaimed.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleClaimCommerceRewards}
            disabled={
              rewardsData.availableCommerceRewards <= 0 ||
              claimingType === "commerce"
            }
            className={`mt-2 px-5 py-2 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {claimingType === "commerce" ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Claiming...
              </div>
            ) : rewardsData.availableCommerceRewards > 0 ? (
              `Claim RM ${rewardsData.availableCommerceRewards.toFixed(2)}`
            ) : (
              "No rewards to claim yet"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

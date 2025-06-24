/* eslint-disable react/no-children-prop */
import type { Metadata } from "next";
import InfoTooltip from "@/components/ui/InfoTooltip";

export const metadata: Metadata = {
  title: "Claim Rewards - Veyoyee",
  description: "Claim your Survey Creation Pass (SCP) and Commerce rewards.",
};

export default function ClaimRewardsPage() {
  // Placeholder values; in a real app, fetch these from user data
  const academiaAnswered = 72;
  const commerceAnswered = 82;
  const commerceReward = (commerceAnswered * 0.1).toFixed(2);
  const canClaimSCP = academiaAnswered >= 100;
  const canClaimCommerce = commerceAnswered > 0;

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 max-w-xl">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Claim Rewards
      </h1>
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
                  Answer 100 Academia surveys to unlock the ability to create
                  your own surveys on Veyoyee!
                </>
              }
            >
              <span className="inline-block w-4 h-4 align-middle"></span>
            </InfoTooltip>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-900 dark:text-white">
              {academiaAnswered}
            </span>
            <span className="text-xs text-gray-500">/ 100 answered</span>
          </div>
          <button
            className={`mt-2 px-5 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50`}
            disabled={!canClaimSCP}
          >
            {canClaimSCP
              ? "Claim SCP"
              : "Complete 100 Academia surveys to claim"}
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
                  Different Survey may offer different amount of money!
                </>
              }
              children={undefined}
            ></InfoTooltip>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-900 dark:text-white">
              RM {commerceReward}
            </span>
            <span className="text-xs text-gray-900 dark:text-white">
              ({commerceAnswered} answered)
            </span>
          </div>
          <button
            className={`mt-2 px-5 py-2 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition disabled:opacity-50`}
            disabled={!canClaimCommerce}
          >
            {canClaimCommerce
              ? "Claim RM " + commerceReward
              : "No rewards to claim yet"}
          </button>
        </div>
      </div>
    </div>
  );
}

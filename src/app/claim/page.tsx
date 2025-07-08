import type { Metadata } from "next";
import ClaimRewardsClient from "@/components/claim/ClaimRewardsClient";

export const metadata: Metadata = {
  title: "Claim Rewards - Veyoyee",
  description: "Claim your Survey Creation Pass (SCP) and Commerce rewards.",
};

export default function ClaimRewardsPage() {
  return <ClaimRewardsClient />;
}

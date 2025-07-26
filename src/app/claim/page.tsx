import type { Metadata } from "next";
import ClaimRewardsClient from "@/components/claim/ClaimRewardsClient";

export const metadata: Metadata = {
  title: "Claim Rewards - Veyoyee",
  description: "Claim your Survey Creation Pass (SCP) and Commerce rewards.",
};

export default function ClaimRewardsPage() {
  return (
    <main className="min-h-screen bg-blue-950/95 py-10 px-2 md:px-6">
      <section className="max-w-5xl mx-auto">
        <div className="rounded-2xl bg-blue-950/80 border border-blue-900 shadow-xl p-0 md:p-8">
          <ClaimRewardsClient />
        </div>
      </section>
    </main>
  );
}

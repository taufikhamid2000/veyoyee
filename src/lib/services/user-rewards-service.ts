import { getVeyoyeeClient } from "../supabase/veyoyee-client";

export interface UserRewardsData {
  academiaAnswered: number; // Total accepted responses (all survey types)
  commerceAnswered: number; // Commerce survey responses only
  commerceRewardsEarned: number;
  commerceRewardsClaimed: number;
  scpOwned: number;
  canClaimSCP: boolean; // Can exchange 100 responses for 1 SCP
  availableCommerceRewards: number;
}

export class UserRewardsService {
  /**
   * Get user's reward data for the claim page
   */
  static async getUserRewards(): Promise<UserRewardsData | null> {
    const supabase = getVeyoyeeClient();

    try {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // Get user's basic reward data including responses_accepted
      const { data: userData, error: rewardsError } = await supabase
        .schema("veyoyee")
        .from("users")
        .select(
          `
          commerce_rewards_earned,
          commerce_rewards_claimed,
          scp_owned,
          responses_accepted
        `
        )
        .eq("id", user.id)
        .single();

      if (rewardsError || !userData) {
        console.error("Error fetching user rewards:", rewardsError);
        return null;
      }

      // Count commerce surveys (accepted responses) - still needed for commerce rewards display
      const { count: commerceCount, error: commerceError } = await supabase
        .schema("veyoyee")
        .from("individual_responses")
        .select("survey_id, surveys!inner(type)", {
          count: "exact",
          head: true,
        })
        .eq("respondent_id", user.id)
        .eq("status", "accepted")
        .eq("surveys.type", "commerce");

      if (commerceError) {
        console.error("Error counting commerce surveys:", commerceError);
      }

      const totalAcceptedAnswered = userData.responses_accepted; // Use the column maintained by triggers
      const commerceAnswered = commerceCount || 0;
      const availableCommerceRewards =
        userData.commerce_rewards_earned - userData.commerce_rewards_claimed;
      const canClaimSCP = totalAcceptedAnswered >= 100; // Can exchange 100 responses for 1 SCP

      return {
        academiaAnswered: totalAcceptedAnswered, // Now represents ALL accepted responses
        commerceAnswered,
        commerceRewardsEarned: userData.commerce_rewards_earned,
        commerceRewardsClaimed: userData.commerce_rewards_claimed,
        scpOwned: userData.scp_owned,
        canClaimSCP,
        availableCommerceRewards,
      };
    } catch (error) {
      console.error("Error in getUserRewards:", error);
      return null;
    }
  }

  /**
   * Exchange 100 responses for 1 SCP (Survey Creation Pass)
   */
  static async claimSCP(): Promise<{ success: boolean; error?: unknown }> {
    const supabase = getVeyoyeeClient();

    try {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // Get current user data including responses_accepted
      const { data: userData, error: fetchError } = await supabase
        .schema("veyoyee")
        .from("users")
        .select("scp_owned, responses_accepted")
        .eq("id", user.id)
        .single();

      if (fetchError || !userData) {
        throw new Error("Failed to fetch user data");
      }

      if (userData.responses_accepted < 100) {
        throw new Error(
          "Need at least 100 accepted responses to exchange for SCP"
        );
      }

      // Exchange 100 responses for 1 SCP
      const { error: updateError } = await supabase
        .schema("veyoyee")
        .from("users")
        .update({
          responses_accepted: userData.responses_accepted - 100,
          scp_owned: userData.scp_owned + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      return { success: true };
    } catch (error) {
      console.error("Error claiming SCP:", error);
      return { success: false, error };
    }
  }

  /**
   * Claim commerce rewards
   */
  static async claimCommerceRewards(): Promise<{
    success: boolean;
    error?: unknown;
    amount?: number;
  }> {
    const supabase = getVeyoyeeClient();

    try {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // Get current user data
      const { data: userData, error: fetchError } = await supabase
        .schema("veyoyee")
        .from("users")
        .select("commerce_rewards_earned, commerce_rewards_claimed")
        .eq("id", user.id)
        .single();

      if (fetchError || !userData) {
        throw new Error("Failed to fetch user data");
      }

      const availableRewards =
        userData.commerce_rewards_earned - userData.commerce_rewards_claimed;

      if (availableRewards <= 0) {
        throw new Error("No commerce rewards available to claim");
      }

      // Update claimed amount
      const { error: updateError } = await supabase
        .schema("veyoyee")
        .from("users")
        .update({
          commerce_rewards_claimed: userData.commerce_rewards_earned,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      return { success: true, amount: availableRewards };
    } catch (error) {
      console.error("Error claiming commerce rewards:", error);
      return { success: false, error };
    }
  }
}

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  username?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  website_url?: string;
  total_reputation?: number;
  surveys_created?: number;
  responses_accepted?: number;
  responses_rejected?: number;
  scp_owned?: number;
  commerce_rewards_earned?: number;
  commerce_rewards_claimed?: number;
  marketplace_sales_count?: number;
  marketplace_sales_revenue?: number;
  marketplace_purchases_count?: number;
  marketplace_purchases_spent?: number;
  email?: string;
  created_at?: string;
  updated_at?: string;
  role?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/auth/signin";
          return;
        }

        setUser(user);

        // Fetch from veyoyee.users table
        const { data: userData } = await supabase
          .schema("veyoyee")
          .from("users")
          .select(
            `
            id, username, display_name, email, total_reputation, surveys_created, responses_accepted, responses_rejected, created_at, updated_at, bio, avatar_url, location, website_url, scp_owned, commerce_rewards_earned, commerce_rewards_claimed, marketplace_sales_count, marketplace_sales_revenue, marketplace_purchases_count, marketplace_purchases_spent
          `
          )
          .eq("id", user.id)
          .single();

        const mergedProfile: UserProfile = {
          id: user.id,
          email: user.email,
          ...userData,
        };
        setProfile(mergedProfile);
        setEditDisplayName(mergedProfile.display_name || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSaveDisplayName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setEditLoading(true);
    setEditMessage(null);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .schema("veyoyee")
        .from("users")
        .update({ display_name: editDisplayName })
        .eq("id", user.id);
      if (error) {
        setEditMessage("Failed to update display name. Please try again.");
      } else {
        setProfile((prev: UserProfile | null) =>
          prev ? { ...prev, display_name: editDisplayName } : prev
        );
        setEditMessage("Display name updated successfully.");
      }
    } catch {
      setEditMessage("An error occurred. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-12 bg-blue-900/40 rounded w-1/4"></div>
          <div className="h-40 bg-blue-900/40 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <main className="min-h-screen bg-blue-950/95 py-10 px-2 md:px-6">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">Your Profile</h1>

        <div className="rounded-2xl bg-blue-950/80 border border-blue-900 shadow-xl p-0 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:gap-8 mb-6">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Avatar"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-900 shadow"
                priority
                unoptimized={false}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-900 flex items-center justify-center text-3xl text-blue-200 font-bold border-4 border-blue-900 shadow">
                {(profile?.display_name || editDisplayName)?.[0] || "U"}
              </div>
            )}
            <div className="mt-4 md:mt-0">
              <form
                className="flex flex-col gap-2"
                onSubmit={(e) => handleSaveDisplayName(e)}
                autoComplete="off"
              >
                <label
                  className="text-xs text-blue-200 font-medium"
                  htmlFor="displayNameInput"
                >
                  Display Name
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    id="displayNameInput"
                    type="text"
                    className="rounded-lg bg-blue-900/40 border border-blue-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold"
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    disabled={editLoading}
                    maxLength={100}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={editLoading || !editDisplayName.trim()}
                  >
                    {editLoading ? "Saving..." : "Save"}
                  </button>
                </div>
                {editMessage && (
                  <span
                    className={`text-xs ${
                      editMessage.includes("success")
                        ? "text-green-300"
                        : "text-red-300"
                    }`}
                  >
                    {editMessage}
                  </span>
                )}
              </form>
              {profile?.username && (
                <div className="text-blue-200 text-sm mb-1">
                  @{profile.username}
                </div>
              )}
              {profile?.location && (
                <div className="text-blue-300 text-xs mb-1">
                  {profile.location}
                </div>
              )}
              {profile?.website_url && (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-xs underline"
                >
                  {profile.website_url}
                </a>
              )}
            </div>
          </div>
          <div className="mb-6">
            <div className="text-blue-100 text-sm mb-2">Email</div>
            <div className="text-lg text-white mb-2">
              {profile?.email || user.email}
            </div>
            {profile?.bio && (
              <div className="text-blue-200 text-sm mb-2 whitespace-pre-line">
                {profile.bio}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-blue-200 text-xs mb-1">Reputation</div>
              <div className="text-lg text-white font-bold">
                {profile?.total_reputation?.toLocaleString() ?? 0}
              </div>
            </div>
            <div>
              <div className="text-blue-200 text-xs mb-1">Surveys Created</div>
              <div className="text-lg text-white font-bold">
                {profile?.surveys_created ?? 0}
              </div>
            </div>
            <div>
              <div className="text-blue-200 text-xs mb-1">
                Responses Accepted
              </div>
              <div className="text-lg text-white font-bold">
                {profile?.responses_accepted ?? 0}
              </div>
            </div>
            <div>
              <div className="text-blue-200 text-xs mb-1">
                Responses Rejected
              </div>
              <div className="text-lg text-white font-bold">
                {profile?.responses_rejected ?? 0}
              </div>
            </div>
            <div>
              <div className="text-blue-200 text-xs mb-1">SCP Owned</div>
              <div className="text-lg text-white font-bold">
                {profile?.scp_owned ?? 0}
              </div>
            </div>
            <div>
              <div className="text-blue-200 text-xs mb-1">
                Commerce Rewards Earned
              </div>
              <div className="text-lg text-white font-bold">
                RM {profile?.commerce_rewards_earned?.toFixed(2) ?? "0.00"}
              </div>
            </div>
            <div>
              <div className="text-blue-200 text-xs mb-1">
                Commerce Rewards Claimed
              </div>
              <div className="text-lg text-white font-bold">
                RM {profile?.commerce_rewards_claimed?.toFixed(2) ?? "0.00"}
              </div>
            </div>
            <div>
              <div className="text-blue-200 text-xs mb-1">
                Marketplace Sales
              </div>
              <div className="text-lg text-white font-bold">
                {profile?.marketplace_sales_count ?? 0} (RM{" "}
                {profile?.marketplace_sales_revenue?.toFixed(2) ?? "0.00"})
              </div>
            </div>
            <div>
              <div className="text-blue-200 text-xs mb-1">
                Marketplace Purchases
              </div>
              <div className="text-lg text-white font-bold">
                {profile?.marketplace_purchases_count ?? 0} (RM{" "}
                {profile?.marketplace_purchases_spent?.toFixed(2) ?? "0.00"})
              </div>
            </div>
          </div>
        </div>

        {/* UserPreferences removed as requested */}
      </section>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import UserPreferences from "@/components/dashboard/user-preferences";

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  theme_preference?: "light" | "dark" | "system";
  email_notifications?: boolean;
  created_at?: string;
  updated_at?: string;
  role?: string;
  email?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
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

        // Try to fetch profile data
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        } else {
          // If no profile exists, use user metadata as fallback
          setProfile({
            id: user.id,
            first_name: user.user_metadata?.first_name || "User",
            last_name: user.user_metadata?.last_name || "",
            theme_preference: "system",
            email_notifications: true,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Account Information
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Email
            </label>
            <div className="mt-1 text-lg text-gray-900 dark:text-white">
              {user.email}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                First Name
              </label>
              <div className="mt-1 text-lg text-gray-900 dark:text-white">
                {profile?.first_name || "Not set"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Last Name
              </label>
              <div className="mt-1 text-lg text-gray-900 dark:text-white">
                {profile?.last_name || "Not set"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
        {user && (
          <UserPreferences
            userId={user.id}
            initialSettings={{
              theme: profile?.theme_preference || "system",
              emailNotifications: profile?.email_notifications || true,
            }}
          />
        )}
      </div>
    </div>
  );
}

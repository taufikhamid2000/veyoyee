"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

export function useSupabaseAuth() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check the current auth status using getUser() instead of getSession()
    const checkUser = async () => {
      setLoading(true);
      try {
        // Use getUser() directly which reads from cookies properly
        const { data, error } = await supabase.auth.getUser();
        if (data?.user && !error) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error getting user:", err);
        setUser(null);
      }
      setLoading(false);
    };

    checkUser();

    // Set up the auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Refresh the user state and UI when auth state changes
      if (session?.user) {
        setUser(session.user);
        router.refresh(); // Update any server components

        // Only handle navigation on initial sign-in to avoid loops
        if (event === "SIGNED_IN") {
          router.replace("/dashboard");
        }
      } else {
        setUser(null);
        router.refresh(); // Update any server components

        if (event === "SIGNED_OUT") {
          router.replace("/auth/signin");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  return { user, loading };
}

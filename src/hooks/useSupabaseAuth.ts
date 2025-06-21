"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

export function useSupabaseAuth() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check the current auth status
    const checkUser = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          setUser(data.session.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error getting session:", err);
        setUser(null);
      }
      setLoading(false);
    };

    checkUser();

    // Set up the auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);

        // For sign-in, navigate to dashboard without using router.refresh()
        if (event === "SIGNED_IN") {
          router.replace("/dashboard");
        }
      } else {
        setUser(null);

        // If signed out, go back to login
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

"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SessionRedirect() {
  useEffect(() => {
    // Disabled automatic redirection to prevent loops
    const checkSession = async () => {
      const supabase = createClient();
      // Just check the session but don't redirect
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        console.log("Client-side session detected, but not auto-redirecting");
      }
    };

    checkSession();
  }, []);

  return null; // This component doesn't render anything
}

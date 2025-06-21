"use client";

import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function DashboardAuthCheck() {
  const { user, loading } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user, redirect to sign in
    if (!loading && !user) {
      router.replace("/auth/signin");
    }
  }, [user, loading, router]);

  // Return null as this is just a utility component
  return null;
}

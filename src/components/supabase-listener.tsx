"use client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

export function SupabaseListener({ children }: { children: React.ReactNode }) {
  // This hook handles all auth state changes and navigation
  useSupabaseAuth();

  return <>{children}</>;
}

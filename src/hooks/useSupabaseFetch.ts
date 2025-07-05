"use client";

import { useState, useEffect } from "react";
import type { DependencyList } from "react";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface SupabaseFetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isRefetching: boolean;
}

type SupabaseFetchFn<T> = (
  supabase: SupabaseClient
) => Promise<{ data: T | null; error: Error | null }>;

/**
 * Custom hook for Supabase data fetching with loading state management
 * @param fetchFn - Function that takes a Supabase client and returns a promise with data and error
 * @param dependencies - Optional dependencies array to trigger refetch
 */
export function useSupabaseFetch<T>(
  fetchFn: SupabaseFetchFn<T>,
  dependencies: DependencyList = []
): SupabaseFetchState<T> & {
  refetch: () => Promise<{ data: T | null; error: Error | null }>;
} {
  const [state, setState] = useState<SupabaseFetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
    isRefetching: false,
  });

  const fetchData = async (isRefetching = false) => {
    if (!isRefetching) {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
    } else {
      setState((prev) => ({ ...prev, isRefetching: true, error: null }));
    }

    try {
      const supabase = createClient();
      const { data, error } = await fetchFn(supabase);

      if (error) {
        setState({
          data: null,
          isLoading: false,
          error: error as Error,
          isRefetching: false,
        });
      } else {
        setState({
          data,
          isLoading: false,
          error: null,
          isRefetching: false,
        });
      }
      return { data, error };
    } catch (error) {
      console.error("Supabase fetch error:", error);
      setState({
        data: null,
        isLoading: false,
        error: error as Error,
        isRefetching: false,
      });
      return { data: null, error: error as Error };
    }
  };

  useEffect(() => {
    fetchData().catch((error) =>
      console.error("Initial Supabase fetch failed:", error)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = async () => {
    return fetchData(true);
  };

  return { ...state, refetch };
}

/**
 * Custom hook for authentication state
 * Returns the current user and loading state
 */
export function useAuth() {
  const [state, setState] = useState<{
    user: User | null;
    isLoading: boolean;
    error: Error | null;
  }>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          setState({
            user: null,
            isLoading: false,
            error: error as Error,
          });
          return;
        }

        setState({
          user: data.user,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Auth fetch error:", error);
        setState({
          user: null,
          isLoading: false,
          error: error as Error,
        });
      }
    };

    // Get initial user
    fetchUser();

    // Set up auth state change listener
    const supabase = createClient();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState((prev) => ({ ...prev, isLoading: true }));

        if (event === "SIGNED_OUT") {
          setState({
            user: null,
            isLoading: false,
            error: null,
          });
        } else if (session?.user) {
          setState({
            user: session.user,
            isLoading: false,
            error: null,
          });
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return state;
}

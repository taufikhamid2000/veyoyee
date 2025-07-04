"use client";

import { useState, useEffect } from "react";
import type { DependencyList } from "react";

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook for data fetching with loading state management
 * @param fetchFn - Function that returns a promise with the data
 * @param initialData - Optional initial data
 * @param dependencies - Optional dependencies array to trigger refetch
 */
export function useFetch<T>(
  fetchFn: () => Promise<T>,
  initialData: T | null = null,
  dependencies: DependencyList = []
): FetchState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<FetchState<T>>({
    data: initialData,
    isLoading: true,
    error: null,
  });

  const fetchData = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await fetchFn();
      setState({ data, isLoading: false, error: null });
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      setState({ data: null, isLoading: false, error: error as Error });
      throw error;
    }
  };

  useEffect(() => {
    fetchData().catch((error) => console.error("Initial fetch failed:", error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = async () => {
    await fetchData();
  };

  return { ...state, refetch };
}

/**
 * Custom hook for delayed data loading
 * Useful for intentionally showing loading states in fast operations
 * @param fetchFn - Function that returns a promise with the data
 * @param minDelay - Minimum time in ms to show loading state
 * @param dependencies - Optional dependencies array
 */
export function useDelayedFetch<T>(
  fetchFn: () => Promise<T>,
  minDelay = 500,
  dependencies: DependencyList = []
): FetchState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchData = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    const startTime = Date.now();

    try {
      const data = await fetchFn();

      // Ensure loading state shows for at least minDelay ms
      const elapsed = Date.now() - startTime;
      if (elapsed < minDelay) {
        await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
      }

      setState({ data, isLoading: false, error: null });
      return data;
    } catch (error) {
      console.error("Fetch error:", error);

      // Also delay error state for consistent UX
      const elapsed = Date.now() - startTime;
      if (elapsed < minDelay) {
        await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
      }

      setState({ data: null, isLoading: false, error: error as Error });
      throw error;
    }
  };

  useEffect(() => {
    fetchData().catch((error) => console.error("Initial fetch failed:", error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = async () => {
    await fetchData();
  };

  return { ...state, refetch };
}

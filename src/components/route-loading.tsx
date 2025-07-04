"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

interface RouteLoadingBarProps {
  color?: string;
  height?: number;
}

/**
 * A loading bar that shows during route transitions
 */
export function RouteLoadingBar({
  color = "#3b82f6", // blue-500
  height = 3,
}: RouteLoadingBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulating loading progress
    let startTime: number;
    let animationFrame: number;
    let timer: NodeJS.Timeout;

    const startLoading = () => {
      setIsLoading(true);
      setProgress(0);
      startTime = Date.now();

      // Animate progress
      const animateProgress = () => {
        const elapsed = Date.now() - startTime;
        // Progress algorithm: fast start, slow finish
        const nextProgress = Math.min(
          elapsed < 500 ? 50 : elapsed < 1000 ? 75 : elapsed < 3000 ? 85 : 95,
          95
        );
        setProgress(nextProgress);
        animationFrame = requestAnimationFrame(animateProgress);
      };
      animationFrame = requestAnimationFrame(animateProgress);

      // Automatically stop after a timeout
      timer = setTimeout(() => {
        setIsLoading(false);
        setProgress(100);
        cancelAnimationFrame(animationFrame);
      }, 5000); // Maximum loading time
    };

    const completeLoading = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        cancelAnimationFrame(animationFrame);
        clearTimeout(timer);
      }, 200);
    };

    // Start and complete loading for route changes
    startLoading();
    completeLoading();

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(timer);
    };
  }, [pathname, searchParams]);

  if (!isLoading && progress !== 100) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      style={{ height: `${height}px` }}
    >
      <div
        className="h-full transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}`,
          opacity: isLoading ? 1 : 0,
        }}
      />
    </div>
  );
}

/**
 * A component that shows a loading indicator when route is changing
 */
export function RouteChangeIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setIsChanging(true);
    const timer = setTimeout(() => setIsChanging(false), 300);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!isChanging) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900/90 text-white py-2 px-3 rounded-lg shadow-lg flex items-center gap-2">
      <Spinner size="sm" />
      <span className="text-sm">Loading page...</span>
    </div>
  );
}

/**
 * Provider component for global route loading indicators
 */
export function RouteLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RouteLoadingBar />
      <RouteChangeIndicator />
      {children}
    </>
  );
}

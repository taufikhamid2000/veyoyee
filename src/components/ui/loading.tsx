import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./spinner";

interface LoadingWrapperProps {
  isLoading: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  overlay?: boolean;
  className?: string;
  loadingText?: string;
}

export function LoadingWrapper({
  isLoading,
  children,
  fallback,
  overlay = false,
  className,
  loadingText = "Loading...",
}: LoadingWrapperProps) {
  if (overlay) {
    return (
      <div className={cn("relative", className)}>
        {children}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            {fallback || <LoadingSpinner text={loadingText} />}
          </div>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={className}>
        {fallback || <LoadingSpinner text={loadingText} />}
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}

// Specialized loading wrappers for common use cases
export function LoadingPage({
  isLoading,
  children,
  loadingText = "Loading page...",
}: {
  isLoading: boolean;
  children: ReactNode;
  loadingText?: string;
}) {
  return (
    <LoadingWrapper
      isLoading={isLoading}
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner text={loadingText} size="lg" />
        </div>
      }
      className="w-full"
    >
      {children}
    </LoadingWrapper>
  );
}

export function LoadingCard({
  isLoading,
  children,
  fallback,
  className,
}: {
  isLoading: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}) {
  return (
    <LoadingWrapper
      isLoading={isLoading}
      fallback={fallback}
      className={cn("rounded-lg border p-4", className)}
    >
      {children}
    </LoadingWrapper>
  );
}

export function LoadingButton({
  isLoading,
  children,
  loadingText = "Loading...",
  disabled,
  className,
  ...props
}: {
  isLoading: boolean;
  children: ReactNode;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      disabled={isLoading || disabled}
      className={cn("flex items-center justify-center gap-2", className)}
      {...props}
    >
      {isLoading && <LoadingSpinner size="sm" />}
      {isLoading ? loadingText : children}
    </button>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// "Try the demo — no account needed": anonymous Supabase sign-in, shared
// between the dedicated /auth/signin page and the mid-flow AuthModal.
export function DemoButton({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: demoError } = await supabase.auth.signInAnonymously();
      if (demoError) {
        setError(demoError.message || "Couldn't start the demo. Please try again.");
        return;
      }
      router.refresh();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      const e = err as { message?: string };
      setError(e.message || "Couldn't start the demo. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="w-full cursor-pointer rounded-full border border-primary/40 bg-primary/5 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {isLoading ? "Starting demo..." : "Try the demo — no account needed"}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-center text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

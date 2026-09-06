import React from "react";
import SignInForm from "@/app/auth/signin/components/signin-form";
import { DemoButton } from "@/components/demo-button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mid-flow sign-in prompt (e.g. saving a survey draft). Restyled to reuse
// the same background/foreground/primary/border tokens and card shape as
// the dedicated /auth/signin page so it reads as the same product rather
// than a bespoke dialog.
const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-background p-8 shadow-2xl animate-page-in">
        <button
          className="absolute top-3 right-3 text-foreground/40 hover:text-foreground text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold text-foreground">Sign in required</h2>
        <p className="mb-6 text-sm text-foreground/60">
          You&apos;re not signed in, and your progress will be lost. You can save your
          progress as a JSON file before signing in to preserve your work.
        </p>

        <SignInForm onSuccess={onClose} />

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-foreground/40">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <DemoButton onSuccess={onClose} />

        <p className="mt-6 text-center text-sm text-foreground/60">
          Don&apos;t have an account?{" "}
          <a
            href="/auth/signup"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;

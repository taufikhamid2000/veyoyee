import { Metadata } from "next";
import Link from "next/link";

import { AuthBrandingPanel } from "@/components/auth-branding-panel";
import { LogoMark } from "@/components/ui/logo-mark";
import SignUpForm from "./components/signup-form";

export const metadata: Metadata = {
  title: "Sign Up - Veyoyee",
  description: "Create a new account",
};

export default async function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full md:items-stretch">
      <AuthBrandingPanel />

      <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-muted px-4 py-12">
        <Link href="/" className="flex items-center gap-2 md:hidden">
          <LogoMark size={28} />
          <span className="text-lg font-semibold text-foreground">Veyoyee</span>
        </Link>

        <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 animate-page-in">
          <h1 className="text-xl font-semibold text-foreground">Create an account</h1>
          <p className="mb-6 text-sm text-foreground/60">Create a new account</p>

          <SignUpForm />

          <p className="mt-6 text-center text-sm text-foreground/60">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

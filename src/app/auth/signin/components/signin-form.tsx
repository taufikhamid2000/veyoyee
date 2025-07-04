"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { PasswordField } from "@/components/ui/password-field";
import { createClient } from "@/utils/supabase/client";
import { useValidatedForm } from "@/hooks/useValidatedForm";
import { signInSchema, type SignInFormData } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";

export default function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    isSubmitting,
    submitError,
    getFieldError,
    clearSubmitError,
  } = useValidatedForm<SignInFormData>({
    schema: signInSchema,
    onSubmit: async (data) => {
      const supabase = createClient();

      console.log("Attempting sign in with:", data.email);

      const response = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (response.error) {
        console.error("Sign-in error:", response.error.message);

        // Provide more specific error messages
        if (response.error.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please try again.");
        } else if (response.error.message.includes("Email not confirmed")) {
          throw new Error(
            "Please check your email and click the confirmation link."
          );
        } else if (response.error.message.includes("Too many requests")) {
          throw new Error(
            "Too many sign-in attempts. Please wait before trying again."
          );
        } else {
          throw new Error(response.error.message);
        }
      }

      if (response.data?.user) {
        console.log("Sign-in successful for user:", response.data.user.email);
        toast.success("Welcome back!", "You have been signed in successfully.");
        router.push("/dashboard");
      }
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && (
        <div className="p-3 text-sm text-white bg-red-500 rounded-md flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          {submitError}
          <button
            type="button"
            onClick={clearSubmitError}
            className="ml-auto text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      <FormField
        {...register("email")}
        type="email"
        label="Email"
        placeholder="your@email.com"
        error={getFieldError("email")}
        disabled={isSubmitting}
        required
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
            <span className="text-red-500 ml-1">*</span>
          </label>
          <a
            href="/auth/forgot-password"
            className="text-xs text-blue-600 hover:underline dark:text-blue-400"
          >
            Forgot password?
          </a>
        </div>
        <PasswordField
          {...register("password")}
          placeholder="••••••••"
          error={getFieldError("password")}
          disabled={isSubmitting}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        loading={isSubmitting}
        loadingText="Signing in..."
      >
        Sign in
      </Button>
    </form>
  );
}

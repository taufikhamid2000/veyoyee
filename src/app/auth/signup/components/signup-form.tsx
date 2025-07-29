"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { PasswordField } from "@/components/ui/password-field";
import { createClient } from "@/lib/supabase/client";
import { useValidatedForm } from "@/hooks/useValidatedForm";
import { signUpSchema, type SignUpFormData } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";

export default function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    isSubmitting,
    submitError,
    getFieldError,
    clearSubmitError,
  } = useValidatedForm<SignUpFormData>({
    schema: signUpSchema,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    onSubmit: async (data) => {
      const supabase = createClient();

      const { error: signUpError, data: signUpData } =
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              first_name: data.firstName,
              last_name: data.lastName,
              role: "user",
            },
          },
        });

      if (signUpError) {
        console.error("Sign-up error:", signUpError.message);

        if (signUpError.message.includes("User already registered")) {
          throw new Error(
            "An account with this email already exists. Please sign in instead."
          );
        } else if (signUpError.message.includes("Password should be")) {
          throw new Error("Password does not meet security requirements.");
        } else if (signUpError.message.includes("Invalid email")) {
          throw new Error("Please enter a valid email address.");
        } else {
          throw new Error(signUpError.message);
        }
      }

      if (signUpData?.user) {
        if (signUpData.user.email_confirmed_at) {
          // User is immediately confirmed
          toast.success(
            "Welcome to Veyoyee!",
            "Your account has been created successfully."
          );
          router.push("/dashboard");
        } else {
          // User needs to confirm email
          toast.info(
            "Check your email",
            "Please check your email and click the confirmation link to complete your account setup."
          );
          router.push("/auth/signin");
        }
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

      <div className="grid grid-cols-2 gap-4">
        <FormField
          {...register("firstName")}
          type="text"
          label="First Name"
          placeholder="John"
          error={getFieldError("firstName")}
          disabled={isSubmitting}
          required
        />

        <FormField
          {...register("lastName")}
          type="text"
          label="Last Name"
          placeholder="Doe"
          error={getFieldError("lastName")}
          disabled={isSubmitting}
          required
        />
      </div>

      <FormField
        {...register("email")}
        type="email"
        label="Email"
        placeholder="your@email.com"
        error={getFieldError("email")}
        disabled={isSubmitting}
        required
      />

      <PasswordField
        {...register("password")}
        label="Password"
        placeholder="••••••••"
        error={getFieldError("password")}
        helperText="Password must be at least 8 characters with uppercase, lowercase, and number"
        disabled={isSubmitting}
        required
      />

      <PasswordField
        {...register("confirmPassword")}
        label="Confirm Password"
        placeholder="••••••••"
        error={getFieldError("confirmPassword")}
        disabled={isSubmitting}
        required
      />

      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            {...register("agreeToTerms")}
            type="checkbox"
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isSubmitting}
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            I agree to the
            <a
              href="/terms-of-service"
              className="text-blue-600 hover:underline dark:text-blue-400"
              target="_blank"
            >
              Terms of Service
            </a>
            and
            <a
              href="/privacy-policy"
              className="text-blue-600 hover:underline dark:text-blue-400"
              target="_blank"
            >
              Privacy Policy
            </a>
          </span>
        </label>
        {getFieldError("agreeToTerms") && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 ml-7">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {getFieldError("agreeToTerms")}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        loading={isSubmitting}
        loadingText="Creating account..."
      >
        Create account
      </Button>
    </form>
  );
}

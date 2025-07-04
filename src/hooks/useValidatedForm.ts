import { useForm, UseFormProps, FieldValues, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

interface UseValidatedFormProps<T extends FieldValues>
  extends Omit<UseFormProps<T>, "resolver"> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
}

export function useValidatedForm<T extends FieldValues>({
  schema,
  onSubmit,
  ...formProps
}: UseValidatedFormProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    ...formProps,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  const getFieldError = (name: Path<T>) => {
    const error = form.formState.errors[name];
    return error?.message as string | undefined;
  };

  const isFieldInvalid = (name: Path<T>) => {
    return !!form.formState.errors[name];
  };

  const clearSubmitError = () => setSubmitError(null);

  return {
    ...form,
    handleSubmit,
    isSubmitting,
    submitError,
    getFieldError,
    isFieldInvalid,
    clearSubmitError,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
  };
}

// Utility function to format field names for error messages
export function formatFieldName(fieldName: string): string {
  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

// Helper function to get nested error messages
export function getNestedError(
  errors: Record<string, unknown>,
  path: string
): string | undefined {
  const keys = path.split(".");
  let current: unknown = errors;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return (current as { message?: string })?.message;
}

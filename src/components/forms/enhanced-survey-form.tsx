"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { SelectField } from "@/components/ui/select-field";
import { useValidatedForm } from "@/hooks/useValidatedForm";
import { surveyBasicSchema, type SurveyBasicFormData } from "@/lib/validations";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

export default function EnhancedSurveyForm() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    isSubmitting,
    submitError,
    getFieldError,
    clearSubmitError,
  } = useValidatedForm<SurveyBasicFormData>({
    schema: surveyBasicSchema,
    defaultValues: {
      title: "",
      description: "",
      type: "academic",
      category: "academic",
    },
    onSubmit: async (data) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success
      toast.success(
        "Survey Created!",
        `"${data.title}" has been created successfully.`
      );

      // Navigate to survey builder or dashboard
      router.push("/dashboard");
    },
  });

  const surveyTypeOptions = [
    { value: "academic", label: "Academic Research" },
    { value: "commercial", label: "Commercial Survey" },
  ];

  const categoryOptions = [
    { value: "academic", label: "Academic Research" },
    { value: "market-research", label: "Market Research" },
    { value: "product-feedback", label: "Product Feedback" },
    { value: "opinion", label: "Opinion Poll" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Create New Survey
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Start by providing basic information about your survey.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {submitError && (
            <div className="p-4 text-sm text-white bg-red-500 rounded-md flex items-center gap-2">
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
            {...register("title")}
            type="text"
            label="Survey Title"
            placeholder="Enter a descriptive title for your survey"
            error={getFieldError("title")}
            disabled={isSubmitting}
            required
            helperText="Choose a clear, concise title that describes your survey's purpose"
          />

          <TextareaField
            {...register("description")}
            label="Survey Description"
            placeholder="Describe what your survey is about, its purpose, and what participants can expect..."
            error={getFieldError("description")}
            disabled={isSubmitting}
            required
            rows={4}
            helperText="Provide context and instructions for survey participants"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              {...register("type")}
              label="Survey Type"
              error={getFieldError("type")}
              disabled={isSubmitting}
              required
              options={surveyTypeOptions}
              placeholder="Select survey type"
              helperText="Academic surveys use SCP tokens, commercial surveys require payment"
            />

            <SelectField
              {...register("category")}
              label="Category"
              error={getFieldError("category")}
              disabled={isSubmitting}
              required
              options={categoryOptions}
              placeholder="Select category"
              helperText="Choose the most appropriate category"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Survey...
                </div>
              ) : (
                "Continue to Questions"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

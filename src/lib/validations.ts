import { z } from "zod";

// Common validation schemas
export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces");

// Auth schemas
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Survey schemas
export const surveyBasicSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  type: z.enum(["academic", "commercial"], {
    required_error: "Survey type is required",
  }),
  category: z.enum(
    ["academic", "market-research", "product-feedback", "opinion", "other"],
    {
      required_error: "Category is required",
    }
  ),
});

export const surveySettingsSchema = z
  .object({
    minRespondents: z
      .number()
      .min(1, "Minimum respondents must be at least 1")
      .max(10000, "Maximum limit is 10,000 respondents"),
    maxRespondents: z
      .number()
      .min(1, "Maximum respondents must be at least 1")
      .max(10000, "Maximum limit is 10,000 respondents"),
    rewardAmount: z
      .number()
      .min(0.01, "Reward must be at least $0.01")
      .max(1000, "Reward cannot exceed $1,000"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine((data) => data.maxRespondents >= data.minRespondents, {
    message: "Maximum respondents must be greater than or equal to minimum",
    path: ["maxRespondents"],
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine((data) => new Date(data.startDate) >= new Date(), {
    message: "Start date cannot be in the past",
    path: ["startDate"],
  });

export const questionSchema = z
  .object({
    id: z.string(),
    type: z.enum([
      "multiple_choice",
      "single_choice",
      "short_answer",
      "long_answer",
      "rating",
      "yes_no",
      "date",
      "number",
    ]),
    question: z
      .string()
      .min(5, "Question must be at least 5 characters")
      .max(200, "Question must be less than 200 characters"),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (["multiple_choice", "single_choice"].includes(data.type)) {
        return data.options && data.options.length >= 2;
      }
      return true;
    },
    {
      message: "Multiple choice questions must have at least 2 options",
      path: ["options"],
    }
  );

export const surveySchema = z
  .object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must be less than 100 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description must be less than 500 characters"),
    type: z.enum(["academic", "commercial"], {
      required_error: "Survey type is required",
    }),
    category: z.enum(
      ["academic", "market-research", "product-feedback", "opinion", "other"],
      {
        required_error: "Category is required",
      }
    ),
    minRespondents: z
      .number()
      .min(1, "Minimum respondents must be at least 1")
      .max(10000, "Maximum limit is 10,000 respondents"),
    maxRespondents: z
      .number()
      .min(1, "Maximum respondents must be at least 1")
      .max(10000, "Maximum limit is 10,000 respondents"),
    rewardAmount: z
      .number()
      .min(0.01, "Reward must be at least $0.01")
      .max(1000, "Reward cannot exceed $1,000"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    questions: z
      .array(questionSchema)
      .min(1, "At least one question is required")
      .max(50, "Maximum 50 questions allowed"),
  })
  .refine((data) => data.maxRespondents >= data.minRespondents, {
    message: "Maximum respondents must be greater than or equal to minimum",
    path: ["maxRespondents"],
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine((data) => new Date(data.startDate) >= new Date(), {
    message: "Start date cannot be in the past",
    path: ["startDate"],
  });

// Profile schemas
export const profileUpdateSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

// Type exports
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SurveyFormData = z.infer<typeof surveySchema>;
export type SurveyBasicFormData = z.infer<typeof surveyBasicSchema>;
export type SurveySettingsFormData = z.infer<typeof surveySettingsSchema>;
export type QuestionFormData = z.infer<typeof questionSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

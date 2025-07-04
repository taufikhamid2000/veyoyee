// This file contains mock survey data for editing/creation flows.
// Consider unifying with dashboard-data.ts for a single source of truth if possible.
// This file is now just a template. All real mock survey data is in dashboard-data.ts

export const mockSurveyEdit = {
  id: "survey1",
  title: "Graduation Readiness Survey",
  type: "academia",
  status: "active",
  lastUpdated: "2025-06-20",
  createdBy: "c5185e34-0ae1-439b-9701-704055cc8013",
  minRespondents: 50,
  maxRespondents: 100,
  startDate: "2025-07-01",
  endDate: "2025-07-31",
  rewardAmount: "100.00",
  questions: [
    {
      id: "q1",
      type: "multipleChoice",
      questionText: "How prepared do you feel for graduation?",
      options: ["Very prepared", "Somewhat prepared", "Not prepared"],
      required: true,
    },
    {
      id: "q2",
      type: "shortAnswer",
      questionText: "What is your biggest concern about graduating?",
      required: false,
    },
    // ...more questions
  ],
};

// Extended question type definition with new types
export type QuestionType =
  | "shortAnswer"
  | "paragraph"
  | "multipleChoice"
  | "checkboxList"
  | "ratingScale"
  | "dateQuestion"
  | "linkInput";

// Rating scale configuration
export interface RatingScaleConfig {
  minValue: number;
  maxValue: number;
  step: number;
  labels?: {
    min?: string;
    max?: string;
  };
}

// Base question type
interface BaseQuestion {
  id: string;
  type: QuestionType;
  questionText: string;
  required: boolean;
}

// Specialized question types
interface TextQuestion extends BaseQuestion {
  type: "shortAnswer" | "paragraph";
}

interface OptionsQuestion extends BaseQuestion {
  type: "multipleChoice" | "checkboxList";
  options: string[];
}

interface RatingQuestion extends BaseQuestion {
  type: "ratingScale";
  ratingConfig: RatingScaleConfig;
}

interface DateQuestion extends BaseQuestion {
  type: "dateQuestion";
}

interface LinkQuestion extends BaseQuestion {
  type: "linkInput";
}

// Union type of all question types
export type QuestionEdit =
  | TextQuestion
  | OptionsQuestion
  | RatingQuestion
  | DateQuestion
  | LinkQuestion;

export type SurveyEdit = typeof mockSurveyEdit;

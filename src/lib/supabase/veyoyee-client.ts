// Supabase client with veyoyee schema
import { createBrowserClient } from "@supabase/ssr";

// Define the database schema
export type VeyoyeeSchema = {
  // View for survey metrics
  survey_response_metrics: {
    survey_id: string;
    total_questions: number;
    total_responses: number;
    last_response_date: string | null;
    response_days: number;
  };
  surveys: {
    id: string;
    title: string;
    type: "academia" | "commerce";
    status: "draft" | "active" | "closed";
    min_respondents: number | null;
    max_respondents: number | null;
    start_date: string | null;
    end_date: string | null;
    reward_amount: number | null;
    created_at: string;
    updated_at: string;
    created_by: string;
  };
  questions: {
    id: string;
    survey_id: string;
    question_text: string;
    type:
      | "shortAnswer"
      | "paragraph"
      | "multipleChoice"
      | "checkboxList"
      | "ratingScale"
      | "dateQuestion"
      | "linkInput";
    required: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
    rating_min: number | null;
    rating_max: number | null;
    rating_step: number | null;
    rating_min_label: string | null;
    rating_max_label: string | null;
  };
  question_options: {
    id: string;
    question_id: string;
    option_text: string;
    display_order: number;
    created_at: string;
    updated_at: string;
  };
  survey_responses: {
    id: string;
    survey_id: string;
    question_id: string;
    response_option_id: string | null;
    response_count: number;
    avg_rating: number | null;
    response_date: string;
    text_responses: Record<string, unknown> | null;
    metadata: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
  };
  response_answers: {
    id: string;
    response_id: string;
    question_id: string;
    answer_text: string | null;
    selected_option_id: string | null;
    created_at: string;
    updated_at: string;
  };
};

export const createVeyoyeeClient = () => {
  // For browser environments
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );
};

export const getVeyoyeeClient = () => {
  return createVeyoyeeClient();
};

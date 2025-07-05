import { QuestionEdit, QuestionType } from "../../../data/surveyor-data";
import {
  DbQuestion,
  DbQuestionOption,
  DbSurvey,
  FormattedSurvey,
  SurveyListItem,
} from "./survey-types";

/**
 * Format questions from database to client format
 */
export function formatQuestionsForClient(
  questions: DbQuestion[],
  options?: DbQuestionOption[]
): QuestionEdit[] {
  return questions.map((q) => {
    // Base question structure
    const baseQuestion = {
      id: q.id,
      questionText: q.question_text,
      required: q.required,
      type: q.type as QuestionType,
    };

    // Handle different question types
    switch (q.type) {
      case "multipleChoice":
      case "checkboxList":
        const questionOptions =
          options?.filter((opt) => opt.question_id === q.id) || [];
        return {
          ...baseQuestion,
          type: q.type as "multipleChoice" | "checkboxList",
          options: questionOptions.map((opt) => opt.option_text),
        };

      case "ratingScale":
        return {
          ...baseQuestion,
          type: "ratingScale",
          ratingConfig: {
            minValue: q.rating_min || 1,
            maxValue: q.rating_max || 5,
            step: q.rating_step || 1,
            labels: {
              min: q.rating_min_label,
              max: q.rating_max_label,
            },
          },
        };

      case "dateQuestion":
        return {
          ...baseQuestion,
          type: "dateQuestion",
        };

      case "linkInput":
        return {
          ...baseQuestion,
          type: "linkInput",
        };

      default:
        return {
          ...baseQuestion,
          type: (q.type === "paragraph" ? "paragraph" : "shortAnswer") as
            | "shortAnswer"
            | "paragraph",
        };
    }
  });
}

/**
 * Format a survey and its questions for client-side use
 */
export function formatSurveyForClient(
  survey: DbSurvey,
  questions: QuestionEdit[]
): FormattedSurvey {
  return {
    id: survey.id,
    title: survey.title,
    type: survey.type,
    status: survey.status,
    minRespondents: survey.min_respondents,
    maxRespondents: survey.max_respondents,
    startDate: survey.start_date,
    endDate: survey.end_date,
    rewardAmount: survey.reward_amount?.toString() || null,
    createdBy: survey.created_by,
    createdAt: survey.created_at,
    updatedAt: survey.updated_at,
    questions: questions,
  };
}

/**
 * Format a survey for list display (dashboard, explore, etc.)
 */
export function formatSurveyForList(
  survey: DbSurvey,
  questionCount: number,
  responseCount: number = 0,
  completionRate: number = 0
): SurveyListItem {
  return {
    id: survey.id,
    title: survey.title,
    type: survey.type,
    status: survey.status,
    minRespondents: survey.min_respondents,
    maxRespondents: survey.max_respondents,
    startDate: survey.start_date,
    endDate: survey.end_date,
    rewardAmount: survey.reward_amount?.toString() || null,
    createdBy: survey.created_by,
    createdAt: survey.created_at,
    updatedAt: survey.updated_at,
    questions: questionCount,
    responses: responseCount,
    completionRate: completionRate,
    lastUpdated: survey.updated_at || survey.created_at,
  };
}

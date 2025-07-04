import {
  QuestionEdit,
  QuestionType,
  RatingScaleConfig,
} from "../../../data/surveyor-data";

// Type guards for each question type
export function isRatingQuestion(
  question: QuestionEdit
): question is Extract<QuestionEdit, { type: "ratingScale" }> {
  return question.type === "ratingScale";
}

export function isOptionsQuestion(
  question: QuestionEdit
): question is Extract<
  QuestionEdit,
  { type: "multipleChoice" | "checkboxList" }
> {
  return question.type === "multipleChoice" || question.type === "checkboxList";
}

export function isTextQuestion(
  question: QuestionEdit
): question is Extract<QuestionEdit, { type: "shortAnswer" | "paragraph" }> {
  return question.type === "shortAnswer" || question.type === "paragraph";
}

export function isDateQuestion(
  question: QuestionEdit
): question is Extract<QuestionEdit, { type: "dateQuestion" }> {
  return question.type === "dateQuestion";
}

export function isLinkQuestion(
  question: QuestionEdit
): question is Extract<QuestionEdit, { type: "linkInput" }> {
  return question.type === "linkInput";
}

export function createDefaultQuestion(
  type: QuestionType,
  id: string
): QuestionEdit {
  const baseQuestion = {
    id,
    questionText: "",
    required: false,
  };

  switch (type) {
    case "multipleChoice":
      return {
        ...baseQuestion,
        type: "multipleChoice",
        options: [""],
      };
    case "checkboxList":
      return {
        ...baseQuestion,
        type: "checkboxList",
        options: [""],
      };
    case "ratingScale":
      return {
        ...baseQuestion,
        type: "ratingScale",
        ratingConfig: {
          minValue: 1,
          maxValue: 5,
          step: 1,
          labels: {
            min: "Poor",
            max: "Excellent",
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
    case "shortAnswer":
      return {
        ...baseQuestion,
        type: "shortAnswer",
      };
    case "paragraph":
      return {
        ...baseQuestion,
        type: "paragraph",
      };
    default:
      return {
        ...baseQuestion,
        type: "shortAnswer",
      };
  }
}

// Type-safe accessor helpers
export function getRatingConfig(
  question: QuestionEdit
): RatingScaleConfig | null {
  if (isRatingQuestion(question)) {
    return question.ratingConfig;
  }
  return null;
}

export function getOptions(question: QuestionEdit): string[] | null {
  if (isOptionsQuestion(question)) {
    return question.options;
  }
  return null;
}

import { QuestionEdit } from "../surveyor-data";

// Define types for our templates
export type SurveyTemplate = {
  title: string;
  questions: QuestionEdit[];
};

export type TemplateCollection = {
  [key: string]: SurveyTemplate;
};

// Template library for common survey types
export const SURVEY_TEMPLATES: TemplateCollection = {
  "customer-feedback": {
    title: "Customer Feedback Survey",
    questions: [
      {
        id: "q1",
        type: "ratingScale",
        questionText: "How satisfied are you with our product/service?",
        required: true,
        ratingConfig: {
          minValue: 1,
          maxValue: 5,
          step: 1,
          labels: {
            min: "Very Unsatisfied",
            max: "Very Satisfied",
          },
        },
      },
      {
        id: "q2",
        type: "multipleChoice",
        questionText:
          "How likely are you to recommend our product/service to others?",
        required: true,
        options: [
          "Very likely",
          "Somewhat likely",
          "Neutral",
          "Somewhat unlikely",
          "Very unlikely",
        ],
      },
      {
        id: "q3",
        type: "shortAnswer",
        questionText: "What aspects of our product/service could be improved?",
        required: false,
      },
    ],
  },
  "event-feedback": {
    title: "Event Feedback Survey",
    questions: [
      {
        id: "q1",
        type: "ratingScale",
        questionText: "How would you rate the overall event?",
        required: true,
        ratingConfig: {
          minValue: 1,
          maxValue: 5,
          step: 1,
          labels: {
            min: "Poor",
            max: "Excellent",
          },
        },
      },
      {
        id: "q2",
        type: "multipleChoice",
        questionText: "Which aspects of the event did you enjoy most?",
        required: true,
        options: [
          "Content",
          "Speakers",
          "Venue",
          "Networking",
          "Food & Drinks",
        ],
      },
      {
        id: "q3",
        type: "shortAnswer",
        questionText: "Do you have any suggestions for future events?",
        required: false,
      },
    ],
  },
  "academic-research": {
    title: "Academic Research Survey",
    questions: [
      {
        id: "q1",
        type: "multipleChoice",
        questionText: "What is your highest level of education?",
        required: true,
        options: [
          "High School",
          "Bachelor's Degree",
          "Master's Degree",
          "Doctorate",
          "Other",
        ],
      },
      {
        id: "q2",
        type: "checkboxList",
        questionText:
          "Which research methods are you familiar with? (Select all that apply)",
        required: true,
        options: [
          "Quantitative Analysis",
          "Qualitative Research",
          "Mixed Methods",
          "Literature Review",
          "Experimental Design",
        ],
      },
      {
        id: "q3",
        type: "ratingScale",
        questionText: "How comfortable are you with statistical analysis?",
        required: true,
        ratingConfig: {
          minValue: 1,
          maxValue: 5,
          step: 1,
          labels: {
            min: "Not comfortable",
            max: "Very comfortable",
          },
        },
      },
      {
        id: "q4",
        type: "shortAnswer",
        questionText: "What is your primary area of research interest?",
        required: false,
      },
    ],
  },
};

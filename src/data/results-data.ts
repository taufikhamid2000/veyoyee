// Mock survey results for previewing survey analytics and answers

export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondent: string;
  submittedAt: string;
  answers: Record<string, string | string[]>; // questionId -> answer
}

export const mockSurveyResults: SurveyResponse[] = [
  // Results for survey1 (Active)
  {
    id: "resp1",
    surveyId: "survey1",
    respondent: "user-21-id",
    submittedAt: "2025-07-02T10:15:00Z",
    answers: {
      q1: "Very prepared",
      q2: "Balancing job search and thesis work.",
    },
  },
  {
    id: "resp2",
    surveyId: "survey1",
    respondent: "user-22-id",
    submittedAt: "2025-07-03T14:30:00Z",
    answers: {
      q1: "Somewhat prepared",
      q2: "Uncertainty about future plans.",
    },
  },
  // Results for survey3 (Closed)
  {
    id: "resp3",
    surveyId: "survey3",
    respondent: "user-23-id",
    submittedAt: "2025-06-23T09:45:00Z",
    answers: {
      q1: "I feel confident in my job search.",
      q2: "I need more interview practice.",
    },
  },
  {
    id: "resp4",
    surveyId: "survey3",
    respondent: "user-24-id",
    submittedAt: "2025-06-24T11:00:00Z",
    answers: {
      q1: "I'm not sure where to start.",
      q2: "Resume writing is my biggest challenge.",
    },
  },
];

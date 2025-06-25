// Mock survey results for previewing survey analytics and answers

export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondent: string;
  submittedAt: string;
  answers: Record<string, string | string[]>; // questionId -> answer
  status: "pending" | "accepted" | "rejected";
  reputationScore?: number; // Added for reputation score
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
    status: "pending",
    reputationScore: 80,
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
    status: "accepted",
    reputationScore: 92,
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
    status: "rejected",
    reputationScore: 60,
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
    status: "pending",
    reputationScore: 75,
  },
  // Additional responses for all statuses
  {
    id: "resp5",
    surveyId: "survey1",
    respondent: "user-25-id",
    submittedAt: "2025-07-04T09:00:00Z",
    answers: {
      q1: "Not prepared",
      q2: "Worried about job market.",
    },
    status: "rejected",
    reputationScore: 55,
  },
  {
    id: "resp6",
    surveyId: "survey3",
    respondent: "user-26-id",
    submittedAt: "2025-06-25T13:20:00Z",
    answers: {
      q1: "I feel somewhat confident.",
      q2: "Finding the right fit is hard.",
    },
    status: "accepted",
    reputationScore: 88,
  },
  {
    id: "resp7",
    surveyId: "survey1",
    respondent: "user-27-id",
    submittedAt: "2025-07-05T16:45:00Z",
    answers: {
      q1: "Very prepared",
      q2: "No major concerns.",
    },
    status: "pending",
    reputationScore: 85,
  },
];

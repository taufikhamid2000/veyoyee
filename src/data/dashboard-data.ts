export interface Survey {
  id: string;
  title: string;
  type: "commerce" | "academia" | string;
  responses: number;
  completionRate: number;
  status: "active" | "draft" | "closed";
  lastUpdated: string;
  questions: number;
  createdBy: string; // Add owner field
}

export interface ActivityItem {
  id: string;
  type: "response" | "edit" | "export" | "create";
  surveyId: string;
  surveyTitle: string;
  date: string;
  ipAddress?: string;
}

export const mockSurveys: Survey[] = [
  {
    id: "survey1",
    title: "Graduation Readiness Survey",
    type: "academia",
    responses: 102,
    completionRate: 78,
    status: "active",
    lastUpdated: "2025-06-20",
    questions: 14,
    createdBy: "c5185e34-0ae1-439b-9701-704055cc8013",
  },
  {
    id: "survey2",
    title: "Capstone Project Peer Review",
    type: "academia",
    responses: 56,
    completionRate: 65,
    status: "draft",
    lastUpdated: "2025-06-17",
    questions: 10,
    createdBy: "c5185e34-0ae1-439b-9701-704055cc8013",
  },
  {
    id: "survey3",
    title: "Job-Hunt Confidence Check",
    type: "commerce",
    responses: 88,
    completionRate: 72,
    status: "closed",
    lastUpdated: "2025-06-22",
    questions: 8,
    createdBy: "c5185e34-0ae1-439b-9701-704055cc8013",
  },
  {
    id: "survey4",
    title: "Thesis Writing Stress Tracker",
    type: "academia",
    responses: 134,
    completionRate: 60,
    status: "active",
    lastUpdated: "2025-06-19",
    questions: 12,
    createdBy: "user-13-id",
  },
  {
    id: "survey5",
    title: "Internship Experience Feedback",
    type: "commerce",
    responses: 45,
    completionRate: 80,
    status: "closed",
    lastUpdated: "2025-05-30",
    questions: 9,
    createdBy: "user-14-id",
  },
  {
    id: "survey6",
    title: "Graduate School Interest Poll",
    type: "academia",
    responses: 97,
    completionRate: 69,
    status: "active",
    lastUpdated: "2025-06-21",
    questions: 11,
    createdBy: "user-15-id",
  },
  {
    id: "survey7",
    title: "End-of-Semester Teaching Evaluation",
    type: "academia",
    responses: 210,
    completionRate: 83,
    status: "closed",
    lastUpdated: "2025-06-05",
    questions: 20,
    createdBy: "user-16-id",
  },
  {
    id: "survey8",
    title: "Startup Career Interest Snapshot",
    type: "commerce",
    responses: 64,
    completionRate: 58,
    status: "draft",
    lastUpdated: "2025-06-15",
    questions: 7,
    createdBy: "user-17-id",
  },
  {
    id: "survey9",
    title: "Financial Literacy Self-Assessment",
    type: "commerce",
    responses: 112,
    completionRate: 74,
    status: "active",
    lastUpdated: "2025-06-23",
    questions: 13,
    createdBy: "user-18-id",
  },
  {
    id: "survey10",
    title: "Post-Graduation Plans & Fears",
    type: "academia",
    responses: 150,
    completionRate: 77,
    status: "active",
    lastUpdated: "2025-06-23",
    questions: 15,
    createdBy: "user-19-id",
  },
];

export const mockActivities: ActivityItem[] = [
  {
    id: "activity1",
    type: "response",
    surveyId: "survey1",
    surveyTitle: "Customer Satisfaction Survey",
    date: "2 hours ago",
    ipAddress: "192.168.1.1",
  },
  {
    id: "activity2",
    type: "edit",
    surveyId: "survey2",
    surveyTitle: "Employee Feedback Form",
    date: "Yesterday",
  },
  {
    id: "activity3",
    type: "export",
    surveyId: "survey4",
    surveyTitle: "Product Feedback",
    date: "3 days ago",
  },
];

export const getDashboardStats = (surveys: Survey[] = mockSurveys) => {
  const activeSurveys = surveys.filter((s) => s.status === "active").length;
  const draftSurveys = surveys.filter((s) => s.status === "draft").length;
  const totalResponses = surveys.reduce(
    (sum, survey) => sum + survey.responses,
    0
  );

  // Calculate average completion rate only for surveys with responses
  const surveysWithResponses = surveys.filter((s) => s.responses > 0);
  const avgCompletionRate =
    surveysWithResponses.length > 0
      ? Math.round(
          surveysWithResponses.reduce((sum, s) => sum + s.completionRate, 0) /
            surveysWithResponses.length
        )
      : 0;

  return {
    activeSurveys,
    draftSurveys,
    totalResponses,
    avgCompletionRate,
  };
};

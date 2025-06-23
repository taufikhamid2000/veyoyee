export interface Survey {
  id: string;
  title: string;
  responses: number;
  completionRate: number;
  status: "active" | "draft" | "closed";
  lastUpdated: string;
  questions: number;
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
    title: "Customer Satisfaction Survey",
    responses: 124,
    completionRate: 68,
    status: "active",
    lastUpdated: "2025-06-10",
    questions: 12,
  },
  {
    id: "survey2",
    title: "Employee Feedback Form",
    responses: 45,
    completionRate: 92,
    status: "active",
    lastUpdated: "2025-06-15",
    questions: 8,
  },
  {
    id: "survey3",
    title: "Event Registration",
    responses: 0,
    completionRate: 0,
    status: "draft",
    lastUpdated: "2025-06-20",
    questions: 5,
  },
  {
    id: "survey4",
    title: "Product Feedback",
    responses: 89,
    completionRate: 74,
    status: "closed",
    lastUpdated: "2025-05-30",
    questions: 10,
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

export const getDashboardStats = () => {
  const activeSurveys = mockSurveys.filter((s) => s.status === "active").length;
  const draftSurveys = mockSurveys.filter((s) => s.status === "draft").length;
  const totalResponses = mockSurveys.reduce(
    (sum, survey) => sum + survey.responses,
    0
  );

  // Calculate average completion rate only for surveys with responses
  const surveysWithResponses = mockSurveys.filter((s) => s.responses > 0);
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

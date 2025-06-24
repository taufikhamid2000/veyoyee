import { notFound } from "next/navigation";
import { mockSurveys } from "@/data/dashboard-data";
import SurveyForm from "../../SurveyForm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function EditSurveyPage({ params }: any) {
  const { id } = params;
  const survey = mockSurveys.find((s) => s.id === id);

  if (!survey) {
    notFound();
  }

  // Map dashboard mock survey to SurveyForm's expected shape
  const initialSurvey = {
    id: survey.id,
    title: survey.title,
    type: survey.type === "commerce" ? "commerce" : "academia",
    status: survey.status,
    lastUpdated: survey.lastUpdated,
    createdBy: survey.createdBy,
    minRespondents: survey.minRespondents ?? 0,
    maxRespondents: survey.maxRespondents ?? 0,
    startDate: survey.startDate ?? "",
    endDate: survey.endDate ?? "",
    rewardAmount: survey.rewardAmount ?? "",
    questions: survey.questionsData ?? [],
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6">Edit Survey</h1>
      <SurveyForm initialSurvey={initialSurvey} />
    </div>
  );
}

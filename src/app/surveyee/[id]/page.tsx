import { mockSurveys } from "@/data/dashboard-data";
import { notFound } from "next/navigation";
import SurveyForm from "@/app/surveyor/SurveyForm";

interface SurveyeePageProps {
  params: { id: string };
}

export default function SurveyeePage({ params }: SurveyeePageProps) {
  // Fetch survey data by ID (mock for now)
  const survey = mockSurveys.find((s) => s.id === params.id);
  if (!survey) return notFound();

  // Ensure required fields are present for SurveyForm
  const safeSurvey = {
    ...survey,
    minRespondents: survey.minRespondents ?? 0,
    maxRespondents: survey.maxRespondents ?? 0,
    rewardAmount: survey.rewardAmount ?? "",
    questions: Array.isArray(survey.questions)
      ? survey.questions
      : survey.questionsData ?? [],
    startDate: survey.startDate ?? "",
    endDate: survey.endDate ?? "",
  };

  // Render the survey for answering (readonly, no edit)
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{survey.title}</h1>
      <SurveyForm initialSurvey={safeSurvey} mode="answer" />
    </div>
  );
}

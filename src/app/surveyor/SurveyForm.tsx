"use client";

import { useState } from "react";
import type {
  SurveyEdit,
  QuestionEdit,
  QuestionType,
} from "../../data/surveyor-data";
import { createDefaultQuestion } from "../../components/forms/survey-builder/question-helpers";
import SurveyFormHeader from "../../components/forms/survey/SurveyFormHeader";
import QuestionList from "../../components/forms/survey/QuestionList";
import SurveyResponseForm from "../../components/forms/survey/SurveyResponseForm";

interface SurveyFormProps {
  initialSurvey?: SurveyEdit;
  mode?: "edit" | "answer";
}

export default function SurveyForm({
  initialSurvey,
  mode = "edit",
}: SurveyFormProps = {}) {
  // Form state
  const [surveyTitle, setSurveyTitle] = useState(initialSurvey?.title || "");
  const [questions, setQuestions] = useState<QuestionEdit[]>(() => {
    // Convert initial questions to proper QuestionEdit types
    if (initialSurvey?.questions && initialSurvey.questions.length > 0) {
      return initialSurvey.questions.map((q) => {
        // Create proper typed questions based on the question type
        if (typeof q.type === "string" && typeof q.id === "string") {
          // Transfer any existing data from the original question
          const newQuestion = createDefaultQuestion(
            q.type as QuestionType,
            q.id
          );
          return {
            ...newQuestion,
            questionText: q.questionText || "",
            required: q.required || false,
          };
        }
        // Fallback - should not happen with properly structured data
        return createDefaultQuestion("shortAnswer", String(Math.random()));
      });
    }
    return [];
  });
  const [minRespondents, setMinRespondents] = useState<number | undefined>(
    initialSurvey?.minRespondents
  );
  const [maxRespondents, setMaxRespondents] = useState<number | undefined>(
    initialSurvey?.maxRespondents
  );
  const [startDate, setStartDate] = useState(initialSurvey?.startDate || "");
  const [endDate, setEndDate] = useState(initialSurvey?.endDate || "");
  const [surveyType, setSurveyType] = useState<"academia" | "commerce">(
    (initialSurvey?.type as "academia" | "commerce") || "academia"
  );
  const [rewardAmount, setRewardAmount] = useState<string>(
    initialSurvey?.rewardAmount || ""
  );
  const [showReward, setShowReward] = useState(
    Boolean(initialSurvey?.rewardAmount)
  );

  // Form submission handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const MIN_QUESTIONS = 3;
    if (questions.length < MIN_QUESTIONS) {
      alert(`Please add at least ${MIN_QUESTIONS} questions to the survey.`);
      return;
    }
    // TODO: Integrate with backend
    alert("Survey created! (Not yet saved)");
  };

  // Render the appropriate form based on mode
  if (mode === "answer") {
    return <SurveyResponseForm questions={questions} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mt-8"
    >
      {/* Survey metadata section */}
      <SurveyFormHeader
        surveyTitle={surveyTitle}
        setSurveyTitle={setSurveyTitle}
        surveyType={surveyType}
        setSurveyType={setSurveyType}
        minRespondents={minRespondents}
        setMinRespondents={setMinRespondents}
        maxRespondents={maxRespondents}
        setMaxRespondents={setMaxRespondents}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setQuestions={setQuestions}
        setEndDate={setEndDate}
        rewardAmount={rewardAmount}
        setRewardAmount={setRewardAmount}
        showReward={showReward}
        setShowReward={setShowReward}
      />

      {/* Questions section */}
      <QuestionList questions={questions} setQuestions={setQuestions} />

      {/* Submit button */}
      <button
        type="submit"
        className="w-full mt-6 px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
      >
        Create Survey
      </button>
    </form>
  );
}

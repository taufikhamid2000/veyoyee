import { QuestionEdit } from "../../../data/surveyor-data";
import { useState } from "react";
import { getRatingConfig } from "../survey-builder/question-helpers";
import { SurveyResponseService } from "../../../lib/services/survey/survey-response-service";
import { useSupabaseAuth } from "../../../hooks/useSupabaseAuth";

interface SurveyResponseFormProps {
  questions: QuestionEdit[];
  surveyId: string;
}

export default function SurveyResponseForm({
  questions,
  surveyId,
}: SurveyResponseFormProps) {
  type Answers = Record<string, string>;
  const [answers, setAnswers] = useState<Answers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSupabaseAuth();

  const handleAnswerChange = (qid: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmitAnswers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to submit responses");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create a survey response record
      const responseResult = await SurveyResponseService.createSurveyResponse(
        surveyId,
        user.id
      );

      if (!responseResult.success) {
        throw new Error("Failed to create survey response");
      }

      const responseId = responseResult.data!.responseId;

      // 2. Save each answer
      for (const question of questions) {
        const answer = answers[question.id];
        if (answer) {
          // Handle different question types
          let selectedOptions: string[] | undefined;
          let answerText = answer;

          if (question.type === "checkboxList") {
            selectedOptions = answer.split(",").filter((opt) => opt.trim());
            answerText = selectedOptions.join(", ");
          } else if (question.type === "multipleChoice") {
            selectedOptions = [answer];
          }

          const saveResult = await SurveyResponseService.saveResponseAnswer(
            responseId,
            question.id,
            answerText,
            selectedOptions
          );

          if (!saveResult.success) {
            console.error(`Failed to save answer for question ${question.id}`);
          }
        }
      }

      // 3. Mark response as complete
      await SurveyResponseService.completeSurveyResponse(responseId);

      alert("Survey responses submitted successfully!");
      // Redirect to explore after successful submission
      window.location.href = "/explore";
      // Optionally clear form (not needed if redirecting)
      // setAnswers({});
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Failed to submit survey responses. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmitAnswers}
      className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mt-8"
    >
      {questions.map((q, idx) => (
        <div
          key={q.id}
          className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg"
        >
          <label className="block text-lg font-medium mb-2 text-gray-900 dark:text-white">
            {idx + 1}. {q.questionText}
            {q.required && <span className="text-red-500">*</span>}
          </label>
          {q.type === "shortAnswer" || q.type === "paragraph" ? (
            <textarea
              rows={q.type === "paragraph" ? 4 : 2}
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
              required={q.required}
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              placeholder="Your answer"
            />
          ) : q.type === "multipleChoice" ? (
            <div className="flex flex-col gap-2">
              {q.options?.map((opt, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 text-gray-900 dark:text-white"
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleAnswerChange(q.id, opt)}
                    required={q.required}
                    className="accent-blue-600"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          ) : q.type === "checkboxList" ? (
            <div className="flex flex-col gap-2">
              {q.options?.map((opt, i) => {
                // For checkboxes, we need to store multiple values
                const currentAnswers = answers[q.id]
                  ? answers[q.id].split(",")
                  : [];
                const isChecked = currentAnswers.includes(opt);

                const handleCheckboxChange = () => {
                  let newAnswers = [...currentAnswers];
                  if (isChecked) {
                    // Remove if already checked
                    newAnswers = newAnswers.filter((a) => a !== opt);
                  } else {
                    // Add if not checked
                    newAnswers.push(opt);
                  }
                  handleAnswerChange(q.id, newAnswers.join(","));
                };

                return (
                  <label
                    key={i}
                    className="flex items-center gap-2 text-gray-900 dark:text-white"
                  >
                    <input
                      type="checkbox"
                      value={opt}
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      className="accent-blue-600"
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
          ) : q.type === "ratingScale" ? (
            <div className="flex flex-wrap items-center gap-2">
              {getRatingConfig(q)?.labels?.min && (
                <span className="text-sm text-gray-900 dark:text-white font-medium">
                  {getRatingConfig(q)?.labels?.min}
                </span>
              )}
              <div className="flex items-center gap-1">
                {Array.from(
                  {
                    length:
                      (getRatingConfig(q)?.maxValue || 5) -
                      (getRatingConfig(q)?.minValue || 1) +
                      1,
                  },
                  (_, i) => (getRatingConfig(q)?.minValue || 1) + i
                ).map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`px-3 py-2 border rounded-md font-medium ${
                      answers[q.id] === value.toString()
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-900 border-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500"
                    }`}
                    onClick={() => handleAnswerChange(q.id, value.toString())}
                  >
                    {value}
                  </button>
                ))}
              </div>
              {getRatingConfig(q)?.labels?.max && (
                <span className="text-sm text-gray-900 dark:text-white font-medium">
                  {getRatingConfig(q)?.labels?.max}
                </span>
              )}
            </div>
          ) : q.type === "dateQuestion" ? (
            <input
              type="date"
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
              required={q.required}
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            />
          ) : q.type === "linkInput" ? (
            <input
              type="url"
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
              required={q.required}
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              placeholder="https://"
            />
          ) : null}
        </div>
      ))}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full mt-6 px-4 py-2 rounded font-semibold transition ${
          isSubmitting
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Submit Answers"}
      </button>
    </form>
  );
}

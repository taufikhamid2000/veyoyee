import { QuestionEdit } from "../../../data/surveyor-data";
import { useState } from "react";
import { getRatingConfig } from "../survey-builder/question-helpers";

interface SurveyResponseFormProps {
  questions: QuestionEdit[];
}

export default function SurveyResponseForm({
  questions,
}: SurveyResponseFormProps) {
  type Answers = Record<string, string>;
  const [answers, setAnswers] = useState<Answers>({});

  const handleAnswerChange = (qid: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmitAnswers = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Submit answers to backend
    alert("Answers submitted! (Not yet saved)");
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
          <label className="block text-lg font-medium mb-2">
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
                <label key={i} className="flex items-center gap-2">
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
                  <label key={i} className="flex items-center gap-2">
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
                <span className="text-sm text-gray-600">
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
                    className={`px-3 py-2 border border-gray-300 rounded-md ${
                      answers[q.id] === value.toString()
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                    onClick={() => handleAnswerChange(q.id, value.toString())}
                  >
                    {value}
                  </button>
                ))}
              </div>
              {getRatingConfig(q)?.labels?.max && (
                <span className="text-sm text-gray-600">
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
        className="w-full mt-6 px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
      >
        Submit Answers
      </button>
    </form>
  );
}

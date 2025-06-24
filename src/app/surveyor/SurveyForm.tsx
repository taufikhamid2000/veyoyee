"use client";

import { useState } from "react";
import type { SurveyEdit, QuestionEdit } from "../../data/surveyor-data";

interface SurveyFormProps {
  initialSurvey?: SurveyEdit;
  mode?: "edit" | "answer";
}

export default function SurveyForm({
  initialSurvey,
  mode = "edit",
}: SurveyFormProps = {}) {
  const [surveyTitle, setSurveyTitle] = useState(initialSurvey?.title || "");
  const [questions, setQuestions] = useState<QuestionEdit[]>(
    initialSurvey?.questions || []
  );
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
  // Add answers state for answer mode
  type Answers = Record<string, string>;
  const [answers, setAnswers] = useState<Answers>({});

  const MIN_QUESTIONS = 3;
  const MAX_QUESTIONS = 10;

  const addQuestion = () => {
    if (questions.length < MAX_QUESTIONS) {
      setQuestions([
        ...questions,
        {
          id: (questions.length + 1).toString(),
          type: "shortAnswer",
          questionText: "",
          required: false,
        },
      ]);
    } else {
      alert(`You can only add up to ${MAX_QUESTIONS} questions.`);
    }
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q: QuestionEdit) => q.id !== id));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (questions.length < MIN_QUESTIONS) {
      alert(`Please add at least ${MIN_QUESTIONS} questions to the survey.`);
      return;
    }
    // TODO: Integrate with backend
    alert("Survey created! (Not yet saved)");
  };

  const handleQuestionChange = (
    index: number,
    updatedQuestion: QuestionEdit
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
  };

  // Calculate reward per respondent range
  let rewardRange = null;
  if (surveyType === "commerce" && rewardAmount && minRespondents) {
    const min = Number(minRespondents);
    const max = maxRespondents ? Number(maxRespondents) : min;
    const total = Number(rewardAmount);
    if (min > 0 && total > 0) {
      const high = (total / min).toFixed(2);
      const low = max > 0 ? (total / max).toFixed(2) : high;
      rewardRange = { low, high };
    }
  }

  if (mode === "answer") {
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
              {idx + 1}. {q.questionText}{" "}
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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mt-8"
    >
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">
          Survey Type <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="surveyType"
              value="academia"
              checked={surveyType === "academia"}
              onChange={() => {
                setSurveyType("academia");
                setShowReward(false);
              }}
              className="accent-blue-600 w-4 h-4"
            />
            <span className="text-blue-700 dark:text-blue-300 font-semibold">
              Academia
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="surveyType"
              value="commerce"
              checked={surveyType === "commerce"}
              onChange={() => {
                setSurveyType("commerce");
                setShowReward(true);
              }}
              className="accent-green-600 w-4 h-4"
            />
            <span className="text-green-700 dark:text-green-300 font-semibold">
              Commerce
            </span>
          </label>
        </div>
        {surveyType === "commerce" && (
          <div className="mt-4 animate-fade-in">
            <button
              type="button"
              className="mb-2 px-4 py-2 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setShowReward((v) => !v)}
            >
              {showReward ? "Hide Reward Amount" : "Enter Reward Amount"}
            </button>
            {showReward && (
              <div className="flex items-center gap-2 mt-2">
                <label htmlFor="rewardAmount" className="text-sm font-medium">
                  Total Reward Amount (RM):
                </label>
                <input
                  type="number"
                  id="rewardAmount"
                  min="0"
                  step="0.01"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(e.target.value)}
                  placeholder="e.g. 100.00"
                  className="w-32 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-white"
                />
              </div>
            )}
            {surveyType === "commerce" && rewardRange && (
              <div className="mt-2 text-sm text-green-700 dark:text-green-300 font-semibold">
                Respondents may be rewarded from RM {rewardRange.low} to RM{" "}
                {rewardRange.high} each
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">
          Survey Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="surveyTitle"
          value={surveyTitle}
          onChange={(e) => setSurveyTitle(e.target.value)}
          required
          placeholder="Enter survey title"
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
        />
      </div>
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label
            htmlFor="minRespondents"
            className="block text-lg font-medium mb-2"
          >
            Min. Respondents
          </label>
          <input
            type="number"
            id="minRespondents"
            value={minRespondents !== undefined ? minRespondents : ""}
            onChange={(e) =>
              setMinRespondents(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            placeholder="Enter minimum respondents"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="maxRespondents"
            className="block text-lg font-medium mb-2"
          >
            Max. Respondents
          </label>
          <input
            type="number"
            id="maxRespondents"
            value={maxRespondents !== undefined ? maxRespondents : ""}
            onChange={(e) =>
              setMaxRespondents(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            placeholder="Enter maximum respondents"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="startDate" className="block text-lg font-medium mb-2">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Select start date"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="endDate" className="block text-lg font-medium mb-2">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Select end date"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Survey Questions</h2>
        {questions.map((q: QuestionEdit, index: number) => (
          <QuestionInput
            key={q.id}
            question={q}
            index={index}
            onQuestionChange={(updatedQuestion) =>
              handleQuestionChange(index, updatedQuestion)
            }
            onDelete={() => deleteQuestion(q.id)}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={addQuestion}
        className="mb-6 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
      >
        Add Question
      </button>
      <button
        type="submit"
        className="w-full mt-6 px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
      >
        Create Survey
      </button>
    </form>
  );
}

function QuestionInput({
  question,
  index,
  onQuestionChange,
  onDelete,
}: {
  question: QuestionEdit;
  index: number;
  onQuestionChange: (updatedQuestion: QuestionEdit) => void;
  onDelete: () => void;
}) {
  const [questionText, setQuestionText] = useState(question.questionText);
  const [type, setType] = useState<QuestionEdit["type"]>(question.type);
  const [options, setOptions] = useState<string[]>(question.options || []);

  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionText(e.target.value);
    onQuestionChange({ ...question, questionText: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as QuestionEdit["type"];
    setType(newType);
    const updatedQuestion: QuestionEdit = {
      ...question,
      type: newType,
      options: newType === "multipleChoice" ? [""] : undefined,
    };
    setOptions(updatedQuestion.options || []);
    onQuestionChange(updatedQuestion);
  };

  const addOption = () => {
    const updatedOptions = [...options, ""];
    setOptions(updatedOptions);
    onQuestionChange({ ...question, options: updatedOptions });
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[optionIndex] = value;
    setOptions(updatedOptions);
    onQuestionChange({ ...question, options: updatedOptions });
  };

  const deleteOption = (optionIndex: number) => {
    const updatedOptions = options.filter((_, idx) => idx !== optionIndex);
    setOptions(updatedOptions);
    onQuestionChange({ ...question, options: updatedOptions });
  };

  return (
    <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg">
      <label
        htmlFor={`question-${index}`}
        className="block text-lg font-medium mb-2"
      >
        Question {index + 1}
      </label>
      <input
        type="text"
        id={`question-${index}`}
        value={questionText}
        onChange={handleQuestionTextChange}
        required
        placeholder="Enter your question"
        className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
      />
      <div className="mt-4">
        <label
          htmlFor={`type-${index}`}
          className="block text-lg font-medium mb-2"
        >
          Answer Type
        </label>
        <select
          id={`type-${index}`}
          value={type}
          onChange={handleTypeChange}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        >
          <option value="shortAnswer">Short Answer</option>
          <option value="paragraph">Paragraph</option>
          <option value="multipleChoice">Multiple Choice</option>
        </select>
      </div>
      {type === "multipleChoice" && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Options</h3>
          {options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) =>
                  handleOptionChange(optionIndex, e.target.value)
                }
                placeholder={`Option ${optionIndex + 1}`}
                required
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => deleteOption(optionIndex)}
                className="ml-2 px-3 py-1 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="mt-2 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Add Option
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={onDelete}
        className="mt-4 px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition"
      >
        Delete Question
      </button>
    </div>
  );
}

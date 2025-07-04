import { useState } from "react";
import { QuestionEdit, QuestionType } from "../../../data/surveyor-data";
import { isOptionsQuestion, isRatingQuestion } from "./question-helpers";
import ShortAnswerInput from "./question-types/ShortAnswerInput";
import MultipleChoiceInput from "./question-types/MultipleChoiceInput";
import CheckboxListInput from "./question-types/CheckboxListInput";
import RatingScaleInput from "./question-types/RatingScaleInput";
import DateQuestionInput from "./question-types/DateQuestionInput";
import LinkInputQuestion from "./question-types/LinkInputQuestion";

interface QuestionInputProps {
  question: QuestionEdit;
  index: number;
  onQuestionChange: (updatedQuestion: QuestionEdit) => void;
  onDelete: () => void;
}

export default function QuestionInput({
  question,
  index,
  onQuestionChange,
  onDelete,
}: QuestionInputProps) {
  const [questionText, setQuestionText] = useState(question.questionText);
  const [type, setType] = useState<QuestionType>(question.type as QuestionType);
  const [required, setRequired] = useState<boolean>(question.required || false);

  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionText(e.target.value);
    onQuestionChange({ ...question, questionText: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as QuestionType;
    setType(newType);

    // Create a new question with default settings for the selected type
    const updatedQuestion = createDefaultQuestionByType(newType, question);
    onQuestionChange(updatedQuestion);
  };

  const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequired(e.target.checked);
    onQuestionChange({ ...question, required: e.target.checked });
  };

  // Helper function to create default question configuration by type
  const createDefaultQuestionByType = (
    type: QuestionType,
    baseQuestion: QuestionEdit
  ): QuestionEdit => {
    // Use the relevant existing properties from the baseQuestion
    const { id, questionText, required } = baseQuestion;
    const baseProps = { id, questionText, required };

    // Create a type-safe question based on the type
    switch (type) {
      case "multipleChoice":
      case "checkboxList": {
        // For options-based questions
        const options = isOptionsQuestion(baseQuestion)
          ? baseQuestion.options
          : [""];

        return {
          ...baseProps,
          type,
          options,
        };
      }
      case "ratingScale": {
        // For rating scale questions
        const ratingConfig = isRatingQuestion(baseQuestion)
          ? baseQuestion.ratingConfig
          : {
              minValue: 1,
              maxValue: 5,
              step: 1,
              labels: {
                min: "Poor",
                max: "Excellent",
              },
            };

        return {
          ...baseProps,
          type: "ratingScale",
          ratingConfig,
        };
      }
      case "dateQuestion":
        // Simple date question
        return {
          ...baseProps,
          type: "dateQuestion",
        };
      case "linkInput":
        // Simple link input question
        return {
          ...baseProps,
          type: "linkInput",
        };
      case "shortAnswer":
      case "paragraph":
      default:
        // Simple text questions
        return {
          ...baseProps,
          type: type === "paragraph" ? "paragraph" : "shortAnswer",
        };
    }
  };

  // Render the appropriate question type editor
  const renderQuestionTypeEditor = () => {
    switch (type) {
      case "shortAnswer":
      case "paragraph":
        return <ShortAnswerInput type={type} />;
      case "multipleChoice":
        return (
          <MultipleChoiceInput
            question={question}
            onQuestionChange={onQuestionChange}
          />
        );
      case "checkboxList":
        return (
          <CheckboxListInput
            question={question}
            onQuestionChange={onQuestionChange}
          />
        );
      case "ratingScale":
        return (
          <RatingScaleInput
            question={question}
            onQuestionChange={onQuestionChange}
          />
        );
      case "dateQuestion":
        return <DateQuestionInput />;
      case "linkInput":
        return <LinkInputQuestion />;
      default:
        return null;
    }
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

      <div className="flex items-center mt-2">
        <input
          type="checkbox"
          id={`required-${index}`}
          checked={required}
          onChange={handleRequiredChange}
          className="mr-2 accent-blue-600"
        />
        <label htmlFor={`required-${index}`} className="text-sm font-medium">
          Required question
        </label>
      </div>

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
          <option value="multipleChoice">Multiple Choice (Radio)</option>
          <option value="checkboxList">Checkbox List (Multiple Select)</option>
          <option value="ratingScale">Rating Scale</option>
          <option value="dateQuestion">Date</option>
          <option value="linkInput">Link/URL Input</option>
        </select>
      </div>

      {/* Render question type specific editor */}
      {renderQuestionTypeEditor()}

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

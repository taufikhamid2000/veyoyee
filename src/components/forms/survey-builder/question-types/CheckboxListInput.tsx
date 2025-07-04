import { useState } from "react";
import { QuestionEdit } from "../../../../data/surveyor-data";
import { isOptionsQuestion, getOptions } from "../question-helpers";

interface CheckboxListInputProps {
  question: QuestionEdit;
  onQuestionChange: (updatedQuestion: QuestionEdit) => void;
}

export default function CheckboxListInput({
  question,
  onQuestionChange,
}: CheckboxListInputProps) {
  // Use the helper function to get options in a type-safe way
  const initialOptions = getOptions(question) || [];
  const [options, setOptions] = useState<string[]>(initialOptions);

  const addOption = () => {
    if (!isOptionsQuestion(question)) return;

    const updatedOptions = [...options, ""];
    setOptions(updatedOptions);
    onQuestionChange({ ...question, options: updatedOptions });
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    if (!isOptionsQuestion(question)) return;

    const updatedOptions = [...options];
    updatedOptions[optionIndex] = value;
    setOptions(updatedOptions);
    onQuestionChange({ ...question, options: updatedOptions });
  };

  const deleteOption = (optionIndex: number) => {
    if (!isOptionsQuestion(question)) return;

    const updatedOptions = options.filter((_, idx) => idx !== optionIndex);
    setOptions(updatedOptions);
    onQuestionChange({ ...question, options: updatedOptions });
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Options (Select Multiple)</h3>
      {options.map((option, optionIndex) => (
        <div key={optionIndex} className="flex items-center mb-2">
          <span className="mr-2">
            <input type="checkbox" disabled className="accent-blue-600" />
          </span>
          <input
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
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
  );
}

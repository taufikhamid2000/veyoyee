import { QuestionEdit } from "../../../data/surveyor-data";
import QuestionInput from "../survey-builder/QuestionInput";
import { createDefaultQuestion } from "../survey-builder/question-helpers";

interface QuestionListProps {
  questions: QuestionEdit[];
  setQuestions: (questions: QuestionEdit[]) => void;
}

export default function QuestionList({
  questions,
  setQuestions,
}: QuestionListProps) {
  const MIN_QUESTIONS = 3;
  const MAX_QUESTIONS = 10;

  const addQuestion = () => {
    if (questions.length < MAX_QUESTIONS) {
      const newId = (questions.length + 1).toString();
      const newQuestion = createDefaultQuestion("shortAnswer", newId);
      setQuestions([...questions, newQuestion]);
    } else {
      alert(`You can only add up to ${MAX_QUESTIONS} questions.`);
    }
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q: QuestionEdit) => q.id !== id));
  };

  const handleQuestionChange = (
    index: number,
    updatedQuestion: QuestionEdit
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
  };

  return (
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
      <button
        type="button"
        onClick={addQuestion}
        className="mb-6 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
      >
        Add Question
      </button>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {questions.length < MIN_QUESTIONS ? (
          <p className="text-amber-600">
            Please add at least {MIN_QUESTIONS} questions.
          </p>
        ) : null}
        <p>
          {questions.length}/{MAX_QUESTIONS} questions
        </p>
      </div>
    </div>
  );
}

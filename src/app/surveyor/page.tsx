import SurveyForm from "./SurveyForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Survey - Veyoyee",
  description: "Create a new survey as a Surveyor on Veyoyee.",
};

export default function SurveyorPage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-100 to-indigo-500 bg-clip-text text-transparent">
        Create a New Survey
      </h1>
      <p className="mb-8 text-gray-500 dark:text-gray-400">
        Welcome! Fill out the form below to launch your survey. Academia Survey:
        Use your Survey Creation Pass (SCP). Commerce Survey: Set the reward
        amount you’d like to offer participants.
      </p>
      <SurveyForm />
    </div>
  );
}

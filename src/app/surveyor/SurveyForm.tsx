"use client";

import { useState, useEffect } from "react";
import { useSurveyActions } from "../../hooks/useSurveyActions";
import type { SurveyEdit, QuestionEdit } from "../../data/surveyor-data";
import { createDefaultQuestion } from "../../components/forms/survey-builder/question-helpers";
import SurveyFormHeader from "../../components/forms/survey/SurveyFormHeader";
import QuestionList from "../../components/forms/survey/QuestionList";
import SurveyResponseForm from "../../components/forms/survey/SurveyResponseForm";
import { UserRewardsService } from "../../lib/services/user-rewards-service";
import { useSupabaseAuth } from "../../hooks/useSupabaseAuth";
import AuthModal from "../../components/ui/auth-modal";
import {
  exportSurveyToJSON,
  importSurveyFromJSON,
  saveDraftToLocalStorage,
  loadDraftFromLocalStorage,
  clearDraftFromLocalStorage,
  type SurveyDraftData,
} from "../../utils/survey-draft-utils";

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
      return initialSurvey.questions.map((q): QuestionEdit => {
        // Preserve the actual question data instead of creating defaults
        if (typeof q.type === "string" && typeof q.id === "string") {
          // Handle different question types and preserve their specific data
          switch (q.type) {
            case "multipleChoice":
              return {
                id: q.id,
                questionText: q.questionText || "",
                required: q.required || false,
                type: "multipleChoice",
                options: (q as { options?: string[] }).options || [""],
              };
            case "checkboxList":
              return {
                id: q.id,
                questionText: q.questionText || "",
                required: q.required || false,
                type: "checkboxList",
                options: (q as { options?: string[] }).options || [""],
              };
            case "ratingScale":
              return {
                id: q.id,
                questionText: q.questionText || "",
                required: q.required || false,
                type: "ratingScale",
                ratingConfig: (
                  q as {
                    ratingConfig?: {
                      minValue: number;
                      maxValue: number;
                      step: number;
                      labels: { min?: string; max?: string };
                    };
                  }
                ).ratingConfig || {
                  minValue: 1,
                  maxValue: 5,
                  step: 1,
                  labels: { min: "Poor", max: "Excellent" },
                },
              };
            case "dateQuestion":
              return {
                id: q.id,
                questionText: q.questionText || "",
                required: q.required || false,
                type: "dateQuestion",
              };
            case "linkInput":
              return {
                id: q.id,
                questionText: q.questionText || "",
                required: q.required || false,
                type: "linkInput",
              };
            case "paragraph":
              return {
                id: q.id,
                questionText: q.questionText || "",
                required: q.required || false,
                type: "paragraph",
              };
            default:
              return {
                id: q.id,
                questionText: q.questionText || "",
                required: q.required || false,
                type: "shortAnswer",
              };
          }
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

  // Initialize survey actions hook
  const { createSurvey, updateSurvey } = useSurveyActions();
  const { user } = useSupabaseAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Restore draft from localStorage for guests
  useEffect(() => {
    if (!user && !initialSurvey) {
      const savedDraft = loadDraftFromLocalStorage();
      if (savedDraft) {
        setSurveyTitle(savedDraft.surveyTitle || "");
        setQuestions(savedDraft.questions || []);
        setMinRespondents(savedDraft.minRespondents);
        setMaxRespondents(savedDraft.maxRespondents);
        setStartDate(savedDraft.startDate || "");
        setEndDate(savedDraft.endDate || "");
        setSurveyType(savedDraft.surveyType || "academia");
        setRewardAmount(savedDraft.rewardAmount || "");
        setShowReward(Boolean(savedDraft.rewardAmount));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Save draft to localStorage on change for guests
  useEffect(() => {
    if (!user) {
      const draft: SurveyDraftData = {
        surveyTitle,
        questions,
        minRespondents,
        maxRespondents,
        startDate,
        endDate,
        surveyType,
        rewardAmount,
      };
      saveDraftToLocalStorage(draft);
    }
  }, [
    surveyTitle,
    questions,
    minRespondents,
    maxRespondents,
    startDate,
    endDate,
    surveyType,
    rewardAmount,
    user,
  ]);

  // Clear draft from localStorage after successful save/submit
  const clearLocalDraft = () => {
    clearDraftFromLocalStorage();
  };

  // Export survey data as JSON file
  const exportToJSON = () => {
    const surveyData: SurveyDraftData = {
      surveyTitle,
      questions,
      minRespondents,
      maxRespondents,
      startDate,
      endDate,
      surveyType,
      rewardAmount,
    };
    exportSurveyToJSON(surveyData);
  };

  // Import survey data from JSON file
  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    importSurveyFromJSON(
      file,
      (surveyData) => {
        // Restore the data
        setSurveyTitle(surveyData.surveyTitle || "");
        setQuestions(surveyData.questions || []);
        setMinRespondents(surveyData.minRespondents);
        setMaxRespondents(surveyData.maxRespondents);
        setStartDate(surveyData.startDate || "");
        setEndDate(surveyData.endDate || "");
        setSurveyType(surveyData.surveyType || "academia");
        setRewardAmount(surveyData.rewardAmount || "");
        setShowReward(Boolean(surveyData.rewardAmount));

        alert("Survey data imported successfully!");
      },
      (errorMessage) => {
        alert(errorMessage);
      }
    );

    // Reset the input
    event.target.value = "";
  };

  // Warn the user if they try to leave the page with unsaved survey changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Show a confirmation dialog
      const confirmationMessage =
        "Are you sure? Your survey progress will be lost if you leave this page.";
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    };

    // Consider unsaved changes if there are any questions or main survey fields filled
    const hasUnsavedChanges =
      questions.length > 0 ||
      surveyTitle !== "" ||
      minRespondents !== undefined ||
      maxRespondents !== undefined ||
      rewardAmount !== "";

    if (hasUnsavedChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [questions, surveyTitle, minRespondents, maxRespondents, rewardAmount]);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Basic validation
    const MIN_QUESTIONS = 3;
    if (questions.length < MIN_QUESTIONS) {
      alert(`Please add at least ${MIN_QUESTIONS} questions to the survey.`);
      return;
    }

    // Required fields validation
    if (!surveyTitle.trim()) {
      alert("Please enter a survey title.");
      return;
    }

    if (surveyType === "commerce" && !rewardAmount) {
      alert("Please enter a reward amount for your commercial survey.");
      return;
    }

    try {
      // Check SCP before activating survey
      const rewards = await UserRewardsService.getUserRewards();
      if (!rewards || rewards.scpOwned < 1) {
        alert(
          "You don't have any SCP, answer at least 100 survey and claim your SCP"
        );
        return;
      }

      // Deduct 1 SCP
      const supabase = (
        await import("../../lib/supabase/veyoyee-client")
      ).getVeyoyeeClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        alert("User not authenticated");
        return;
      }
      const { error: updateError } = await supabase
        .schema("veyoyee")
        .from("users")
        .update({
          scp_owned: rewards.scpOwned - 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (updateError) {
        alert("Failed to deduct SCP. Please try again.");
        return;
      }

      // Show loading UI
      alert("Creating your survey...");

      // Create survey data object
      const surveyData = {
        title: surveyTitle,
        type: surveyType,
        minRespondents,
        maxRespondents,
        startDate,
        endDate,
        rewardAmount,
        questions,
      };

      let result;
      if (initialSurvey?.id) {
        // Update existing survey to active
        result = await updateSurvey(initialSurvey.id, surveyData, "active");
      } else {
        // Create new active survey
        result = await createSurvey(surveyData, "active");
      }

      if (!result || !result.success) {
        const errorMsg =
          result?.error instanceof Error
            ? result.error.message
            : "Unknown error";
        throw new Error("Failed to create survey: " + errorMsg);
      }

      // Show success message
      alert(`Survey "${surveyTitle}" created successfully!`);
      // Clear local draft after successful submit
      clearLocalDraft();
      // Redirect to dashboard or survey view
      window.location.href = `/dashboard?created=${
        result.data?.surveyId || initialSurvey?.id
      }`;
    } catch (err) {
      console.error("Error creating survey:", err);
      alert(
        `An unexpected error occurred: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  // Render the appropriate form based on mode
  if (mode === "answer") {
    const surveyId = initialSurvey?.id || "";
    return <SurveyResponseForm questions={questions} surveyId={surveyId} />;
  }

  return (
    <>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Modern Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {initialSurvey ? "Edit Survey" : "Create New Survey"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {initialSurvey
                ? "Update your survey details and questions below"
                : "Design your survey with our intuitive builder"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="group relative">
              <label className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-2 shadow-sm cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Import JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={importFromJSON}
                  className="hidden"
                />
              </label>
              <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10 border-2 border-yellow-400">
                Load a previously exported JSON file to restore your survey
                progress. Perfect for continuing work on another device.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Survey Setup Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Survey Setup
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Configure your survey&apos;s basic information and settings
              </p>
            </div>
            <div className="p-6">
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
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Survey Questions
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Add and organize your survey questions
              </p>
            </div>
            <div className="p-6">
              <QuestionList questions={questions} setQuestions={setQuestions} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 group relative">
                <button
                  type="button"
                  onClick={async () => {
                    if (!user) {
                      setShowAuthModal(true);
                      return;
                    }
                    // Save as draft logic
                    if (surveyTitle === "") {
                      alert(
                        "Please provide a survey title before saving as draft."
                      );
                      return;
                    }

                    try {
                      // Show loading
                      alert("Saving draft...");

                      // Create survey data object
                      const surveyData = {
                        title: surveyTitle,
                        type: surveyType,
                        minRespondents,
                        maxRespondents,
                        startDate,
                        endDate,
                        rewardAmount,
                        questions,
                      };

                      let result;
                      if (initialSurvey?.id) {
                        // Update existing survey
                        result = await updateSurvey(
                          initialSurvey.id,
                          surveyData,
                          "draft"
                        );
                      } else {
                        // Create new draft
                        result = await createSurvey(surveyData, "draft");
                      }

                      if (result.success) {
                        // Show success message
                        alert(
                          `Draft "${surveyTitle}" saved successfully! You can continue editing later.`
                        );
                        // Clear local draft after successful save
                        clearLocalDraft();
                        // Redirect to dashboard
                        window.location.href = `/dashboard?draft=${
                          result.data?.surveyId || initialSurvey?.id
                        }`;
                      } else {
                        // Show error message
                        console.error("Error saving draft:", result.error);
                        alert(
                          `Failed to save draft: ${
                            result.error instanceof Error
                              ? result.error.message
                              : "Unknown error"
                          }`
                        );
                      }
                    } catch (error) {
                      console.error("Error saving draft:", error);
                      alert(
                        `An unexpected error occurred: ${
                          error instanceof Error
                            ? error.message
                            : "Unknown error"
                        }`
                      );
                    }
                  }}
                  className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Save as Draft
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10 border-2 border-yellow-400">
                  Save your current progress as a draft. You can continue
                  editing later without losing your work.
                </div>
              </div>
              <div className="flex-1 group relative">
                <button
                  type="button"
                  onClick={exportToJSON}
                  className="w-full px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600 rounded-lg font-medium hover:bg-green-200 dark:hover:bg-green-800/50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Export JSON
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10 border-2 border-yellow-400">
                  Download your survey progress as a JSON file. Useful for
                  backing up your work or sharing with others.
                </div>
              </div>
              <div className="flex-1 group relative">
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm border-2 border-yellow-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Publish Survey
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10 border-2 border-yellow-400">
                  One SCP will be deducted. Make sure the questions are correct
                  because once the survey is published, there&apos;s no way to
                  edit the survey.
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

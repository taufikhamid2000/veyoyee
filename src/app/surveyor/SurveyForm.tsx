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

interface SurveyFormProps {
  initialSurvey?: SurveyEdit;
  mode?: "edit" | "answer";
}

const LOCAL_DRAFT_KEY = "veyoyee-survey-draft";

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
      const savedDraft = localStorage.getItem(LOCAL_DRAFT_KEY);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (draft) {
            setSurveyTitle(draft.surveyTitle || "");
            setQuestions(draft.questions || []);
            setMinRespondents(draft.minRespondents);
            setMaxRespondents(draft.maxRespondents);
            setStartDate(draft.startDate || "");
            setEndDate(draft.endDate || "");
            setSurveyType(draft.surveyType || "academia");
            setRewardAmount(draft.rewardAmount || "");
            setShowReward(Boolean(draft.rewardAmount));
          }
        } catch {}
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Save draft to localStorage on change for guests
  useEffect(() => {
    if (!user) {
      const draft = {
        surveyTitle,
        questions,
        minRespondents,
        maxRespondents,
        startDate,
        endDate,
        surveyType,
        rewardAmount,
      };
      localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(draft));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    localStorage.removeItem(LOCAL_DRAFT_KEY);
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

        {/* Action buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={async () => {
              if (!user) {
                setShowAuthModal(true);
                return;
              }
              // Save as draft logic
              if (surveyTitle === "") {
                alert("Please provide a survey title before saving as draft.");
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
                    error instanceof Error ? error.message : "Unknown error"
                  }`
                );
              }
            }}
            className="flex-1 px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
          <button
            type="submit"
            className="flex-1 px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
            Create Survey
          </button>
        </div>
      </form>
    </>
  );
}

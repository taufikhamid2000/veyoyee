import { QuestionEdit } from "../data/surveyor-data";

export interface SurveyDraftData {
  surveyTitle: string;
  questions: QuestionEdit[];
  minRespondents?: number;
  maxRespondents?: number;
  startDate: string;
  endDate: string;
  surveyType: "academia" | "commerce";
  rewardAmount: string;
  exportDate?: string;
}

// Export survey data as JSON file
export const exportSurveyToJSON = (surveyData: SurveyDraftData) => {
  const dataWithTimestamp = {
    ...surveyData,
    exportDate: new Date().toISOString(),
  };

  const dataStr = JSON.stringify(dataWithTimestamp, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `survey-draft-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Import survey data from JSON file
export const importSurveyFromJSON = (
  file: File,
  onSuccess: (data: SurveyDraftData) => void,
  onError: (message: string) => void
) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const surveyData = JSON.parse(
        e.target?.result as string
      ) as SurveyDraftData;

      // Validate required fields
      if (typeof surveyData.surveyTitle !== "string") {
        onError("Invalid survey data: missing or invalid survey title");
        return;
      }

      if (!Array.isArray(surveyData.questions)) {
        onError("Invalid survey data: missing or invalid questions array");
        return;
      }

      onSuccess(surveyData);
    } catch (error) {
      onError("Error parsing JSON file. Please check the file format.");
      console.error("Import error:", error);
    }
  };
  reader.readAsText(file);
};

// Local storage utilities
const LOCAL_DRAFT_KEY = "veyoyee-survey-draft";

export const saveDraftToLocalStorage = (surveyData: SurveyDraftData) => {
  localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(surveyData));
};

export const loadDraftFromLocalStorage = (): SurveyDraftData | null => {
  try {
    const savedDraft = localStorage.getItem(LOCAL_DRAFT_KEY);
    if (savedDraft) {
      return JSON.parse(savedDraft);
    }
  } catch (error) {
    console.error("Error loading draft from localStorage:", error);
  }
  return null;
};

export const clearDraftFromLocalStorage = () => {
  localStorage.removeItem(LOCAL_DRAFT_KEY);
};

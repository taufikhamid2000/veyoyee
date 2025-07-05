/* eslint-disable @typescript-eslint/no-explicit-any */
import { getVeyoyeeClient } from "../supabase/veyoyee-client";
import { QuestionEdit, QuestionType } from "../../data/surveyor-data";

// Survey data model for creating/updating surveys
export interface SurveyData {
  title: string;
  type: "academia" | "commerce";
  minRespondents?: number;
  maxRespondents?: number;
  startDate?: string;
  endDate?: string;
  rewardAmount?: string;
  questions: QuestionEdit[];
}

export class SurveyService {
  // Create a new survey (published or draft)
  static async createSurvey(
    surveyData: SurveyData,
    status: "draft" | "active" = "draft"
  ) {
    const supabase = getVeyoyeeClient();

    try {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // Start a transaction by using RPC (requires a stored procedure in Supabase)
      // For now, we'll use multiple queries and handle any errors

      // 1. Create the survey record
      console.log("Inserting survey with:", {
        title: surveyData.title,
        type: surveyData.type,
        status: status,
        schema: "veyoyee",
      });

      const { data: survey, error: surveyError } = await supabase
        .schema("veyoyee") // Explicitly set schema for this operation
        .from("surveys")
        .insert({
          title: surveyData.title,
          type: surveyData.type,
          status: status,
          min_respondents: surveyData.minRespondents || null,
          max_respondents: surveyData.maxRespondents || null,
          start_date: surveyData.startDate || null,
          end_date: surveyData.endDate || null,
          reward_amount: surveyData.rewardAmount
            ? parseFloat(surveyData.rewardAmount)
            : null,
          created_by: user.id,
        })
        .select("id")
        .single();

      if (surveyError) {
        console.error("Survey insert error details:", surveyError);
        throw surveyError;
      }

      // 2. Create question records and their options if applicable
      for (let i = 0; i < surveyData.questions.length; i++) {
        const question = surveyData.questions[i];

        // Basic question data
        const questionData: any = {
          survey_id: survey.id,
          question_text: question.questionText,
          type: question.type,
          required: question.required,
          display_order: i,
        };

        // Add rating scale configuration if applicable
        if (question.type === "ratingScale" && "ratingConfig" in question) {
          questionData.rating_min = question.ratingConfig.minValue;
          questionData.rating_max = question.ratingConfig.maxValue;
          questionData.rating_step = question.ratingConfig.step;
          questionData.rating_min_label = question.ratingConfig.labels?.min;
          questionData.rating_max_label = question.ratingConfig.labels?.max;
        }

        // Insert the question
        const { data: createdQuestion, error: questionError } = await supabase
          .schema("veyoyee") // Set schema for this operation
          .from("questions")
          .insert(questionData)
          .select("id")
          .single();

        if (questionError) {
          // In a real app, we would roll back previous operations
          console.error("Question insert error:", questionError);
          throw questionError;
        }

        // 3. Create options if it's a multiple choice or checkbox question
        if (
          (question.type === "multipleChoice" ||
            question.type === "checkboxList") &&
          "options" in question &&
          Array.isArray(question.options)
        ) {
          const optionInserts = question.options.map((optionText, index) => ({
            question_id: createdQuestion.id,
            option_text: optionText,
            display_order: index,
          }));

          const { error: optionsError } = await supabase
            .schema("veyoyee") // Set schema for this operation
            .from("question_options")
            .insert(optionInserts);

          if (optionsError) {
            // In a real app, we would roll back previous operations
            console.error("Options insert error:", optionsError);
            throw optionsError;
          }
        }
      }

      return { success: true, surveyId: survey.id };
    } catch (error) {
      console.error("Error creating survey:", error);
      // Log detailed error information
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      } else {
        console.error(
          "Non-Error object thrown:",
          JSON.stringify(error, null, 2)
        );
      }
      return { success: false, error };
    }
  }

  // Get a survey by ID
  static async getSurveyById(surveyId: string) {
    const supabase = getVeyoyeeClient();

    try {
      // Get the survey
      const { data: survey, error: surveyError } = await supabase
        .schema("veyoyee") // Set schema for this operation
        .from("surveys")
        .select("*")
        .eq("id", surveyId)
        .single();

      if (surveyError) {
        throw surveyError;
      }

      // Get the questions
      const { data: questions, error: questionsError } = await supabase
        .schema("veyoyee") // Set schema for this operation
        .from("questions")
        .select("*")
        .eq("survey_id", surveyId)
        .order("display_order", { ascending: true });

      if (questionsError) {
        throw questionsError;
      }

      // Get options for multiple choice and checkbox questions
      const multiChoiceQuestions = questions.filter(
        (q) => q.type === "multipleChoice" || q.type === "checkboxList"
      );

      const questionIds = multiChoiceQuestions.map((q) => q.id);

      // If there are no multiple choice questions, return what we have
      if (questionIds.length === 0) {
        const formattedQuestions = formatQuestionsForClient(questions);
        return { success: true, survey, questions: formattedQuestions };
      }

      // Get options for each question
      const { data: options, error: optionsError } = await supabase
        .schema("veyoyee") // Set schema for this operation
        .from("question_options")
        .select("*")
        .in("question_id", questionIds)
        .order("display_order", { ascending: true });

      if (optionsError) {
        throw optionsError;
      }

      // Format the data
      const formattedQuestions = formatQuestionsForClient(questions, options);

      // Format the survey for client
      const formattedSurvey = {
        id: survey.id,
        title: survey.title,
        type: survey.type,
        status: survey.status,
        minRespondents: survey.min_respondents,
        maxRespondents: survey.max_respondents,
        startDate: survey.start_date,
        endDate: survey.end_date,
        rewardAmount: survey.reward_amount?.toString(),
        createdBy: survey.created_by,
        createdAt: survey.created_at,
        updatedAt: survey.updated_at,
        questions: formattedQuestions,
      };

      return { success: true, survey: formattedSurvey };
    } catch (error) {
      console.error("Error getting survey:", error);
      return { success: false, error };
    }
  }

  // Update an existing survey
  static async updateSurvey(
    surveyId: string,
    surveyData: SurveyData,
    status?: "draft" | "active" | "closed"
  ) {
    const supabase = getVeyoyeeClient();

    try {
      // 1. Update the survey record
      const surveyUpdate: any = {
        title: surveyData.title,
        type: surveyData.type,
        min_respondents: surveyData.minRespondents || null,
        max_respondents: surveyData.maxRespondents || null,
        start_date: surveyData.startDate || null,
        end_date: surveyData.endDate || null,
        reward_amount: surveyData.rewardAmount
          ? parseFloat(surveyData.rewardAmount)
          : null,
      };

      // Update status if provided
      if (status) {
        surveyUpdate.status = status;
      }

      const { error: surveyError } = await supabase
        .from("surveys")
        .update(surveyUpdate)
        .eq("id", surveyId);

      if (surveyError) {
        throw surveyError;
      }

      // 2. Delete existing questions and options (this is simpler than trying to update them)
      const { error: deleteQuestionsError } = await supabase
        .from("questions")
        .delete()
        .eq("survey_id", surveyId);

      if (deleteQuestionsError) {
        throw deleteQuestionsError;
      }

      // 3. Create new questions and options
      for (let i = 0; i < surveyData.questions.length; i++) {
        const question = surveyData.questions[i];

        // Basic question data
        const questionData: any = {
          survey_id: surveyId,
          question_text: question.questionText,
          type: question.type,
          required: question.required,
          display_order: i,
        };

        // Add rating scale configuration if applicable
        if (question.type === "ratingScale" && "ratingConfig" in question) {
          questionData.rating_min = question.ratingConfig.minValue;
          questionData.rating_max = question.ratingConfig.maxValue;
          questionData.rating_step = question.ratingConfig.step;
          questionData.rating_min_label = question.ratingConfig.labels?.min;
          questionData.rating_max_label = question.ratingConfig.labels?.max;
        }

        // Insert the question
        const { data: createdQuestion, error: questionError } = await supabase
          .from("questions")
          .insert(questionData)
          .select("id")
          .single();

        if (questionError) {
          throw questionError;
        }

        // Create options if it's a multiple choice or checkbox question
        if (
          (question.type === "multipleChoice" ||
            question.type === "checkboxList") &&
          "options" in question &&
          Array.isArray(question.options)
        ) {
          const optionInserts = question.options.map((optionText, index) => ({
            question_id: createdQuestion.id,
            option_text: optionText,
            display_order: index,
          }));

          const { error: optionsError } = await supabase
            .from("question_options")
            .insert(optionInserts);

          if (optionsError) {
            throw optionsError;
          }
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating survey:", error);
      return { success: false, error };
    }
  }

  // Delete a survey
  static async deleteSurvey(surveyId: string) {
    const supabase = getVeyoyeeClient();

    try {
      // Delete the survey (cascade will handle related records)
      const { error } = await supabase
        .from("surveys")
        .delete()
        .eq("id", surveyId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting survey:", error);
      return { success: false, error };
    }
  }

  // Get surveys by user
  static async getUserSurveys(userId?: string) {
    const supabase = getVeyoyeeClient();
    let userIdToQuery = userId;

    try {
      // If no userId is provided, try to get it from the auth session
      if (!userIdToQuery) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error("User not authenticated");
        }
        userIdToQuery = user.id;
      }

      // Get all surveys by the current user
      const { data: surveys, error: surveysError } = await supabase
        .schema("veyoyee") // Use the veyoyee schema
        .from("surveys")
        .select("*")
        .eq("created_by", userIdToQuery)
        .order("created_at", { ascending: false });

      if (surveysError) {
        throw surveysError;
      }

      // Create a map to store question counts for each survey
      const questionCountsMap = new Map();

      // Get question counts for all user surveys
      if (surveys && surveys.length > 0) {
        for (const survey of surveys) {
          // For each survey, count the questions
          const { data: questionCount, error: countError } = await supabase
            .schema("veyoyee") // Use the veyoyee schema
            .from("questions")
            .select("*", { count: "exact", head: true })
            .eq("survey_id", survey.id);

          if (!countError) {
            // The count comes in the response header
            const count = questionCount?.length || 0;
            questionCountsMap.set(survey.id, count);
          }
        }
      }

      // Format the surveys for client
      const formattedSurveys = surveys.map((survey) => ({
        id: survey.id,
        title: survey.title,
        type: survey.type,
        status: survey.status,
        minRespondents: survey.min_respondents,
        maxRespondents: survey.max_respondents,
        startDate: survey.start_date,
        endDate: survey.end_date,
        rewardAmount: survey.reward_amount?.toString(),
        createdBy: survey.created_by,
        createdAt: survey.created_at,
        updatedAt: survey.updated_at,
        // Add question count if available, otherwise default to 0
        questions: questionCountsMap.get(survey.id) || 0,
        // Default values for response data - in a real app, would fetch from responses table
        responses: 0,
        completionRate: 0,
      }));

      return { success: true, surveys: formattedSurveys };
    } catch (error) {
      console.error("Error getting user surveys:", error);
      return { success: false, error };
    }
  }

  // This is the server version that can be used in server components
  static async getUserSurveysServer(supabase: any, userId: string) {
    try {
      // Get all surveys by the specified user
      const { data: surveys, error: surveysError } = await supabase
        .schema("veyoyee") // Use the veyoyee schema
        .from("surveys")
        .select("*")
        .eq("created_by", userId)
        .order("created_at", { ascending: false });

      if (surveysError) {
        throw surveysError;
      }

      // Create a map to store question counts for each survey
      const questionCountsMap = new Map();

      // Get question counts for all surveys
      if (surveys && surveys.length > 0) {
        for (const survey of surveys) {
          // For each survey, count the questions
          const { data: questionCount, error: countError } = await supabase
            .schema("veyoyee") // Use the veyoyee schema
            .from("questions")
            .select("*", { count: "exact", head: true })
            .eq("survey_id", survey.id);

          if (!countError) {
            // The count comes in the response header
            const count = questionCount?.length || 0;
            questionCountsMap.set(survey.id, count);
          }
        }
      }

      // Format the surveys for client
      const formattedSurveys = surveys.map((survey: any) => ({
        id: survey.id,
        title: survey.title,
        type: survey.type,
        status: survey.status,
        minRespondents: survey.min_respondents,
        maxRespondents: survey.max_respondents,
        startDate: survey.start_date,
        endDate: survey.end_date,
        rewardAmount: survey.reward_amount?.toString(),
        createdBy: survey.created_by,
        createdAt: survey.created_at,
        updatedAt: survey.updated_at,
        // Add question count if available, otherwise default to 0
        questions: questionCountsMap.get(survey.id) || 0,
        // Default values for response data - in a real app, would fetch from responses table
        responses: 0,
        completionRate: 0,
      }));

      return { success: true, surveys: formattedSurveys };
    } catch (error) {
      console.error("Error getting user surveys:", error);
      return { success: false, error };
    }
  }
}

// Helper function to format questions from database to client format
function formatQuestionsForClient(
  questions: any[],
  options?: any[]
): QuestionEdit[] {
  return questions.map((q) => {
    // Base question structure
    const baseQuestion = {
      id: q.id,
      questionText: q.question_text,
      required: q.required,
      type: q.type as QuestionType,
    };

    // Handle different question types
    switch (q.type) {
      case "multipleChoice":
      case "checkboxList":
        const questionOptions =
          options?.filter((opt) => opt.question_id === q.id) || [];
        return {
          ...baseQuestion,
          type: q.type as "multipleChoice" | "checkboxList",
          options: questionOptions.map((opt) => opt.option_text),
        };

      case "ratingScale":
        return {
          ...baseQuestion,
          type: "ratingScale",
          ratingConfig: {
            minValue: q.rating_min || 1,
            maxValue: q.rating_max || 5,
            step: q.rating_step || 1,
            labels: {
              min: q.rating_min_label,
              max: q.rating_max_label,
            },
          },
        };

      case "dateQuestion":
        return {
          ...baseQuestion,
          type: "dateQuestion",
        };

      case "linkInput":
        return {
          ...baseQuestion,
          type: "linkInput",
        };

      default:
        return {
          ...baseQuestion,
          type: (q.type === "paragraph" ? "paragraph" : "shortAnswer") as
            | "shortAnswer"
            | "paragraph",
        };
    }
  });
}

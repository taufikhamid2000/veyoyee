/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuestionEdit } from "../../../data/surveyor-data";
import { formatQuestionsForClient } from "./survey-formatter";
import { DbQuestion, ServiceResponse } from "./survey-types";

export class SurveyQuestionService {
  /**
   * Create questions for a survey
   */
  static async createQuestionsForSurvey(
    supabase: any,
    surveyId: string,
    questions: QuestionEdit[]
  ): Promise<ServiceResponse<void>> {
    try {
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

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
          .schema("veyoyee") // Set schema for this operation
          .from("questions")
          .insert(questionData)
          .select("id")
          .single();

        if (questionError) {
          console.error("Question insert error:", questionError);
          throw questionError;
        }

        // Create options if it's a multiple choice or checkbox question
        if (
          (question.type === "multipleChoice" ||
            question.type === "checkboxList") &&
          "options" in question &&
          Array.isArray(question.options)
        ) {
          await this.createOptionsForQuestion(
            supabase,
            createdQuestion.id,
            question.options
          );
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error creating questions:", error);
      return { success: false, error };
    }
  }

  /**
   * Create options for a question
   */
  static async createOptionsForQuestion(
    supabase: any,
    questionId: string,
    options: string[]
  ): Promise<ServiceResponse<void>> {
    try {
      const optionInserts = options.map((optionText, index) => ({
        question_id: questionId,
        option_text: optionText,
        display_order: index,
      }));

      const { error: optionsError } = await supabase
        .schema("veyoyee") // Set schema for this operation
        .from("question_options")
        .insert(optionInserts);

      if (optionsError) {
        console.error("Options insert error:", optionsError);
        throw optionsError;
      }

      return { success: true };
    } catch (error) {
      console.error("Error creating options:", error);
      return { success: false, error };
    }
  }

  /**
   * Get questions for a survey
   */
  static async getQuestionsForSurvey(
    supabase: any,
    surveyId: string
  ): Promise<ServiceResponse<QuestionEdit[]>> {
    try {
      console.log(`Getting questions for survey: ${surveyId}`);

      // Get the questions
      const { data: questions, error: questionsError } = await supabase
        .schema("veyoyee") // Set schema for this operation
        .from("questions")
        .select("*")
        .eq("survey_id", surveyId)
        .order("display_order", { ascending: true });

      if (questionsError) {
        console.error("Error fetching questions:", questionsError);
        throw questionsError;
      }

      console.log(
        `Found ${questions?.length || 0} questions for survey ${surveyId}`
      );

      // Get options for multiple choice and checkbox questions
      const multiChoiceQuestions = questions.filter(
        (q: DbQuestion) =>
          q.type === "multipleChoice" || q.type === "checkboxList"
      );

      console.log(
        `Found ${multiChoiceQuestions.length} multiple choice/checkbox questions`
      );

      const questionIds = multiChoiceQuestions.map((q: DbQuestion) => q.id);

      // If there are no multiple choice questions, return what we have
      if (questionIds.length === 0) {
        console.log(
          "No multiple choice questions found, formatting questions without options"
        );
        const formattedQuestions = formatQuestionsForClient(questions);
        return { success: true, data: formattedQuestions };
      }

      console.log(
        `Fetching options for question IDs: ${questionIds.join(", ")}`
      );

      // Get options for each question
      const { data: options, error: optionsError } = await supabase
        .schema("veyoyee") // Set schema for this operation
        .from("question_options")
        .select("*")
        .in("question_id", questionIds)
        .order("display_order", { ascending: true });

      if (optionsError) {
        console.error("Error fetching options:", optionsError);
        throw optionsError;
      }

      console.log(
        `Found ${options?.length || 0} options for survey ${surveyId}`
      );

      // Format the data
      const formattedQuestions = formatQuestionsForClient(questions, options);

      console.log(
        `Successfully formatted ${formattedQuestions.length} questions for survey ${surveyId}`
      );

      return { success: true, data: formattedQuestions };
    } catch (error) {
      console.error("Error getting questions:", error);
      return { success: false, error };
    }
  }

  /**
   * Update questions for a survey
   */
  static async updateQuestionsForSurvey(
    supabase: any,
    surveyId: string,
    questions: QuestionEdit[]
  ): Promise<ServiceResponse<void>> {
    try {
      // 1. Delete existing questions and options
      const { error: deleteQuestionsError } = await supabase
        .schema("veyoyee")
        .from("questions")
        .delete()
        .eq("survey_id", surveyId);

      if (deleteQuestionsError) {
        throw deleteQuestionsError;
      }

      // 2. Create new questions and options
      await this.createQuestionsForSurvey(supabase, surveyId, questions);

      return { success: true };
    } catch (error) {
      console.error("Error updating questions:", error);
      return { success: false, error };
    }
  }

  /**
   * Get question counts for multiple surveys
   */
  static async getQuestionCountsForSurveys(
    supabase: any,
    surveyIds: string[]
  ): Promise<Map<string, number>> {
    const questionCountsMap = new Map<string, number>();

    if (!surveyIds.length) {
      return questionCountsMap;
    }

    try {
      // Get all questions for these surveys to count them
      const { data: questions, error: questionsError } = await supabase
        .schema("veyoyee")
        .from("questions")
        .select("survey_id")
        .in("survey_id", surveyIds);

      if (questionsError) {
        throw questionsError;
      }

      if (questions && questions.length) {
        // Group questions by survey_id and count them
        const questionsBySurvey = questions.reduce(
          (acc: any, question: any) => {
            acc[question.survey_id] = (acc[question.survey_id] || 0) + 1;
            return acc;
          },
          {}
        );

        // Set counts in map
        Object.entries(questionsBySurvey).forEach(([surveyId, count]) => {
          questionCountsMap.set(surveyId, count as number);
        });
      }

      return questionCountsMap;
    } catch (error) {
      console.error("Error getting question counts:", error);
      return questionCountsMap;
    }
  }
}

-- Cleanup migration to remove unused duplicate tables
-- These tables were replaced by the new response structure

-- Drop unused tables from the original schema
-- These are now replaced by individual_responses and response_answers

DROP TABLE IF EXISTS veyoyee.answers CASCADE;
DROP TABLE IF EXISTS veyoyee.responses CASCADE;

-- Note: We keep surveys, questions, and question_options as they are still needed
-- Note: survey_responses was already dropped and recreated in the previous migration

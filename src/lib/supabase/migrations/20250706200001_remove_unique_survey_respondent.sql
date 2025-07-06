-- Migration to remove the unique constraint that prevents users from answering surveys multiple times
-- This allows users to submit multiple responses to the same survey

-- Drop the unique constraint that enforces "one response per user per survey"
ALTER TABLE veyoyee.individual_responses 
DROP CONSTRAINT IF EXISTS unique_survey_respondent;

-- Note: To re-enable the "one response per survey" restriction later, run:
-- ALTER TABLE veyoyee.individual_responses 
-- ADD CONSTRAINT unique_survey_respondent UNIQUE (survey_id, respondent_id);

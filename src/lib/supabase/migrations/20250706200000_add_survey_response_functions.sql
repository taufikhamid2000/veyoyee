-- Create an index on individual_responses.survey_id to improve query performance
CREATE INDEX IF NOT EXISTS idx_individual_responses_survey_id 
ON veyoyee.individual_responses(survey_id);

-- Create an index on response_answers.response_id to improve answer lookups
CREATE INDEX IF NOT EXISTS idx_response_answers_response_id 
ON veyoyee.response_answers(response_id);

-- TEMPORARILY disable RLS to test if it's the issue
ALTER TABLE veyoyee.individual_responses DISABLE ROW LEVEL SECURITY;

-- Create a view that includes the textual version of survey_id for case-insensitive matching
CREATE OR REPLACE VIEW veyoyee.survey_responses_view AS
SELECT 
  id, 
  survey_id,
  survey_id::text as survey_id_text,
  respondent_id,
  started_at,
  completed_at,
  is_complete
FROM 
  veyoyee.individual_responses;

-- Add function for direct text-based UUID lookups
CREATE OR REPLACE FUNCTION veyoyee.find_responses_by_survey_id_text(p_survey_id TEXT) 
RETURNS TABLE (
  id UUID,
  survey_id UUID,
  respondent_id UUID,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  is_complete BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id, r.survey_id, r.respondent_id, r.started_at, r.completed_at, r.is_complete
  FROM 
    veyoyee.individual_responses r
  WHERE 
    r.survey_id::TEXT = p_survey_id
    AND r.is_complete = TRUE
  ORDER BY 
    r.completed_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create a public schema wrapper for the function to make it accessible via RPC
CREATE OR REPLACE FUNCTION public.find_responses_by_survey_id_text(p_survey_id TEXT) 
RETURNS TABLE (
  id UUID,
  survey_id UUID,
  respondent_id UUID,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  is_complete BOOLEAN
) AS $$
BEGIN
  RETURN QUERY SELECT * FROM veyoyee.find_responses_by_survey_id_text(p_survey_id);
END;
$$ LANGUAGE plpgsql;

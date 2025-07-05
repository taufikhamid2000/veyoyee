-- Migration to create the survey_responses table for storing detailed response data

-- Create survey_responses table for storing aggregate response data per question
CREATE TABLE IF NOT EXISTS veyoyee.survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES veyoyee.surveys(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES veyoyee.questions(id) ON DELETE CASCADE,
    response_option_id UUID REFERENCES veyoyee.question_options(id) ON DELETE SET NULL,
    response_count INTEGER NOT NULL DEFAULT 0,
    avg_rating DECIMAL(5, 2),
    response_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_complete BOOLEAN NOT NULL DEFAULT FALSE,
    respondent_id UUID,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Ensure unique combination of survey, question, and option
    CONSTRAINT unique_survey_question_option UNIQUE (survey_id, question_id, response_option_id, response_date),
    
    -- For tracking text responses
    text_responses JSONB,
    
    -- Additional metadata
    metadata JSONB
);

-- Create indexes for faster querying
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON veyoyee.survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_question_id ON veyoyee.survey_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_date ON veyoyee.survey_responses(response_date);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_survey_responses_updated_at ON veyoyee.survey_responses;
CREATE TRIGGER update_survey_responses_updated_at
BEFORE UPDATE ON veyoyee.survey_responses
FOR EACH ROW
EXECUTE FUNCTION veyoyee.update_updated_at_column();

-- Row level security for survey_responses
ALTER TABLE veyoyee.survey_responses ENABLE ROW LEVEL SECURITY;

-- Survey responses RLS policies
DO $$
BEGIN
    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Survey creator can see responses' 
        AND tablename = 'survey_responses'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Survey creator can see responses"
        ON veyoyee.survey_responses FOR SELECT
        TO authenticated
        USING (EXISTS (
            SELECT 1 FROM veyoyee.surveys
            WHERE surveys.id = survey_responses.survey_id
            AND surveys.created_by = auth.uid()
        ));
    END IF;

    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Survey creator can insert responses' 
        AND tablename = 'survey_responses'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Survey creator can insert responses"
        ON veyoyee.survey_responses FOR INSERT
        TO authenticated
        WITH CHECK (EXISTS (
            SELECT 1 FROM veyoyee.surveys
            WHERE surveys.id = survey_responses.survey_id
            AND surveys.created_by = auth.uid()
        ));
    END IF;
    
    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Survey creator can update responses' 
        AND tablename = 'survey_responses'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Survey creator can update responses"
        ON veyoyee.survey_responses FOR UPDATE
        TO authenticated
        USING (EXISTS (
            SELECT 1 FROM veyoyee.surveys
            WHERE surveys.id = survey_responses.survey_id
            AND surveys.created_by = auth.uid()
        ));
    END IF;
END
$$;

-- Drop and recreate the function with renamed parameters
DROP FUNCTION IF EXISTS veyoyee.aggregate_survey_response(UUID, UUID, UUID, DECIMAL, TEXT);

-- Add function to aggregate survey responses
CREATE FUNCTION veyoyee.aggregate_survey_response(
    input_survey_id UUID,
    input_question_id UUID,
    input_response_option_id UUID DEFAULT NULL,
    input_rating_value DECIMAL DEFAULT NULL,
    input_text_response TEXT DEFAULT NULL
) RETURNS void AS $$
DECLARE
    input_response_date DATE := CURRENT_DATE;
    temp_text_responses JSONB;
BEGIN
    -- Handle different response types based on the parameters provided
    
    IF input_response_option_id IS NOT NULL THEN
        -- For multiple choice/checkbox responses
        INSERT INTO veyoyee.survey_responses (
            survey_id, question_id, response_option_id, response_count, response_date
        ) VALUES (
            input_survey_id, input_question_id, input_response_option_id, 1, input_response_date
        )
        ON CONFLICT (survey_id, question_id, response_option_id, response_date) 
        DO UPDATE SET
            response_count = survey_responses.response_count + 1,
            updated_at = NOW();
            
    ELSIF input_rating_value IS NOT NULL THEN
        -- For rating scale responses
        INSERT INTO veyoyee.survey_responses (
            survey_id, question_id, response_option_id, avg_rating, response_count, response_date
        ) VALUES (
            input_survey_id, input_question_id, NULL, input_rating_value, 1, input_response_date
        )
        ON CONFLICT (survey_id, question_id, response_option_id, response_date) 
        DO UPDATE SET
            -- Update average rating
            avg_rating = (survey_responses.avg_rating * survey_responses.response_count + input_rating_value) / 
                        (survey_responses.response_count + 1),
            response_count = survey_responses.response_count + 1,
            updated_at = NOW();
            
    ELSIF input_text_response IS NOT NULL THEN
        -- For text/paragraph responses
        -- Add to JSONB array of text responses
        SELECT text_responses INTO temp_text_responses 
        FROM veyoyee.survey_responses
        WHERE survey_id = input_survey_id 
          AND question_id = input_question_id 
          AND response_option_id IS NULL
          AND response_date = input_response_date;
          
        IF temp_text_responses IS NULL THEN
            temp_text_responses := jsonb_build_array(input_text_response);
        ELSE
            temp_text_responses := temp_text_responses || jsonb_build_array(input_text_response);
        END IF;
        
        INSERT INTO veyoyee.survey_responses (
            survey_id, question_id, response_option_id, text_responses, response_count, response_date
        ) VALUES (
            input_survey_id, input_question_id, NULL, temp_text_responses, 1, input_response_date
        )
        ON CONFLICT (survey_id, question_id, response_option_id, response_date) 
        DO UPDATE SET
            text_responses = temp_text_responses,
            response_count = survey_responses.response_count + 1,
            updated_at = NOW();
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL ON TABLE veyoyee.survey_responses TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION veyoyee.aggregate_survey_response TO authenticated;

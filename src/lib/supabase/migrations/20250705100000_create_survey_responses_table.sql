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

-- Add function to aggregate survey responses
CREATE OR REPLACE FUNCTION veyoyee.aggregate_survey_response(
    _survey_id UUID,
    _question_id UUID,
    _response_option_id UUID DEFAULT NULL,
    _rating_value DECIMAL DEFAULT NULL,
    _text_response TEXT DEFAULT NULL
) RETURNS void AS $$
DECLARE
    _response_date DATE := CURRENT_DATE;
    _text_responses JSONB;
BEGIN
    -- Handle different response types based on the parameters provided
    
    IF _response_option_id IS NOT NULL THEN
        -- For multiple choice/checkbox responses
        INSERT INTO veyoyee.survey_responses (
            survey_id, question_id, response_option_id, response_count, response_date
        ) VALUES (
            _survey_id, _question_id, _response_option_id, 1, _response_date
        )
        ON CONFLICT (survey_id, question_id, response_option_id, response_date) 
        DO UPDATE SET
            response_count = survey_responses.response_count + 1,
            updated_at = NOW();
            
    ELSIF _rating_value IS NOT NULL THEN
        -- For rating scale responses
        INSERT INTO veyoyee.survey_responses (
            survey_id, question_id, response_option_id, avg_rating, response_count, response_date
        ) VALUES (
            _survey_id, _question_id, NULL, _rating_value, 1, _response_date
        )
        ON CONFLICT (survey_id, question_id, response_option_id, response_date) 
        DO UPDATE SET
            -- Update average rating
            avg_rating = (survey_responses.avg_rating * survey_responses.response_count + _rating_value) / 
                        (survey_responses.response_count + 1),
            response_count = survey_responses.response_count + 1,
            updated_at = NOW();
            
    ELSIF _text_response IS NOT NULL THEN
        -- For text/paragraph responses
        -- Add to JSONB array of text responses
        SELECT text_responses INTO _text_responses 
        FROM veyoyee.survey_responses
        WHERE survey_id = _survey_id 
          AND question_id = _question_id 
          AND response_option_id IS NULL
          AND response_date = _response_date;
          
        IF _text_responses IS NULL THEN
            _text_responses := jsonb_build_array(_text_response);
        ELSE
            _text_responses := _text_responses || jsonb_build_array(_text_response);
        END IF;
        
        INSERT INTO veyoyee.survey_responses (
            survey_id, question_id, response_option_id, text_responses, response_count, response_date
        ) VALUES (
            _survey_id, _question_id, NULL, _text_responses, 1, _response_date
        )
        ON CONFLICT (survey_id, question_id, response_option_id, response_date) 
        DO UPDATE SET
            text_responses = _text_responses,
            response_count = survey_responses.response_count + 1,
            updated_at = NOW();
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get survey response metrics by survey_id
CREATE OR REPLACE FUNCTION veyoyee.get_survey_metrics(survey_ids UUID[])
RETURNS TABLE (
    survey_id UUID,
    total_questions BIGINT,
    total_responses BIGINT,
    response_days BIGINT, 
    responses BIGINT,
    completion_rate DECIMAL(5, 2),
    last_response_date DATE
) AS $$
BEGIN
    RETURN QUERY
    WITH metrics AS (
        SELECT 
            sr.survey_id,
            COUNT(DISTINCT sr.question_id) AS total_questions,
            SUM(sr.response_count) AS total_responses,
            MAX(sr.response_date) AS last_response_date,
            COUNT(DISTINCT sr.response_date) AS response_days
        FROM veyoyee.survey_responses sr
        WHERE sr.survey_id = ANY(survey_ids)
        GROUP BY sr.survey_id
    )
    SELECT 
        s.id AS survey_id,
        COALESCE(m.total_questions, 0) AS total_questions,
        COALESCE(m.total_responses, 0) AS total_responses,
        COALESCE(m.response_days, 0) AS response_days,
        COALESCE(m.total_responses, 0) AS responses,
        CASE 
            WHEN COALESCE(q_count.question_count, 0) = 0 THEN 0
            ELSE COALESCE(m.total_responses, 0)::DECIMAL / (COALESCE(q_count.question_count, 0) * GREATEST(1, COALESCE(m.response_days, 0))) * 100
        END AS completion_rate,
        m.last_response_date
    FROM UNNEST(survey_ids) AS s(id)
    LEFT JOIN (
        SELECT survey_id, COUNT(*) AS question_count
        FROM veyoyee.questions
        WHERE survey_id = ANY(survey_ids)
        GROUP BY survey_id
    ) q_count ON s.id = q_count.survey_id
    LEFT JOIN metrics m ON s.id = m.survey_id;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL ON TABLE veyoyee.survey_responses TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION veyoyee.aggregate_survey_response TO authenticated;
GRANT EXECUTE ON FUNCTION veyoyee.get_survey_metrics TO anon, authenticated, service_role;

-- Create a function to get completed survey counts to avoid GROUP BY in JS
CREATE OR REPLACE FUNCTION veyoyee.get_completed_survey_counts(survey_ids UUID[])
RETURNS TABLE (
    survey_id UUID,
    count BIGINT,
    completion_date TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sr.survey_id,
        COUNT(*) AS count,
        MAX(sr.completed_at) AS completion_date
    FROM veyoyee.survey_responses sr
    WHERE sr.survey_id = ANY(survey_ids)
    AND sr.is_complete = true
    GROUP BY sr.survey_id;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION veyoyee.get_completed_survey_counts TO anon, authenticated, service_role;

-- Migration to fix survey response table structure
-- This creates proper separate tables for individual responses vs aggregate data

-- First, let's drop the conflicted survey_responses table and recreate it properly
DROP TABLE IF EXISTS veyoyee.survey_responses CASCADE;

-- Create individual_responses table for tracking user response sessions
CREATE TABLE veyoyee.individual_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES veyoyee.surveys(id) ON DELETE CASCADE,
    respondent_id UUID NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    is_complete BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Metadata
    metadata JSONB,
    
    -- Ensure one response per user per survey
    CONSTRAINT unique_survey_respondent UNIQUE (survey_id, respondent_id)
);

-- Create response_answers table for storing individual answers
CREATE TABLE veyoyee.response_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES veyoyee.individual_responses(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES veyoyee.questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    selected_options TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure one answer per question per response
    CONSTRAINT unique_response_question UNIQUE (response_id, question_id)
);

-- Recreate survey_responses table for aggregate data only
CREATE TABLE veyoyee.survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES veyoyee.surveys(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES veyoyee.questions(id) ON DELETE CASCADE,
    response_option_id UUID REFERENCES veyoyee.question_options(id) ON DELETE SET NULL,
    response_count INTEGER NOT NULL DEFAULT 0,
    avg_rating DECIMAL(5, 2),
    response_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure unique combination of survey, question, and option
    CONSTRAINT unique_survey_question_option UNIQUE (survey_id, question_id, response_option_id, response_date),
    
    -- For tracking text responses
    text_responses JSONB,
    
    -- Additional metadata
    metadata JSONB
);

-- Create indexes for individual_responses
CREATE INDEX idx_individual_responses_survey_id ON veyoyee.individual_responses(survey_id);
CREATE INDEX idx_individual_responses_respondent_id ON veyoyee.individual_responses(respondent_id);
CREATE INDEX idx_individual_responses_created_at ON veyoyee.individual_responses(created_at);

-- Create indexes for response_answers
CREATE INDEX idx_response_answers_response_id ON veyoyee.response_answers(response_id);
CREATE INDEX idx_response_answers_question_id ON veyoyee.response_answers(question_id);

-- Create indexes for survey_responses (aggregate data)
CREATE INDEX idx_survey_responses_survey_id ON veyoyee.survey_responses(survey_id);
CREATE INDEX idx_survey_responses_question_id ON veyoyee.survey_responses(question_id);
CREATE INDEX idx_survey_responses_date ON veyoyee.survey_responses(response_date);

-- Triggers for updated_at
CREATE TRIGGER update_individual_responses_updated_at
BEFORE UPDATE ON veyoyee.individual_responses
FOR EACH ROW
EXECUTE FUNCTION veyoyee.update_updated_at_column();

CREATE TRIGGER update_response_answers_updated_at
BEFORE UPDATE ON veyoyee.response_answers
FOR EACH ROW
EXECUTE FUNCTION veyoyee.update_updated_at_column();

CREATE TRIGGER update_survey_responses_updated_at
BEFORE UPDATE ON veyoyee.survey_responses
FOR EACH ROW
EXECUTE FUNCTION veyoyee.update_updated_at_column();

-- Row level security
ALTER TABLE veyoyee.individual_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE veyoyee.response_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE veyoyee.survey_responses ENABLE ROW LEVEL SECURITY;

-- RLS policies for individual_responses
DO $$
BEGIN
    -- Users can see their own responses
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Users can see their own responses' 
        AND tablename = 'individual_responses'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Users can see their own responses" ON veyoyee.individual_responses
            FOR SELECT USING (respondent_id = auth.uid());
    END IF;

    -- Users can create their own responses
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Users can create their own responses' 
        AND tablename = 'individual_responses'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Users can create their own responses" ON veyoyee.individual_responses
            FOR INSERT WITH CHECK (respondent_id = auth.uid());
    END IF;

    -- Users can update their own responses
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Users can update their own responses' 
        AND tablename = 'individual_responses'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Users can update their own responses" ON veyoyee.individual_responses
            FOR UPDATE USING (respondent_id = auth.uid());
    END IF;

    -- Survey creators can see responses to their surveys
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Survey creators can see responses to their surveys' 
        AND tablename = 'individual_responses'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Survey creators can see responses to their surveys" ON veyoyee.individual_responses
            FOR SELECT USING (
                survey_id IN (
                    SELECT id FROM veyoyee.surveys WHERE created_by = auth.uid()
                )
            );
    END IF;
END
$$;

-- RLS policies for response_answers
DO $$
BEGIN
    -- Users can see their own answers
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Users can see their own answers' 
        AND tablename = 'response_answers'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Users can see their own answers" ON veyoyee.response_answers
            FOR SELECT USING (
                response_id IN (
                    SELECT id FROM veyoyee.individual_responses WHERE respondent_id = auth.uid()
                )
            );
    END IF;

    -- Users can create their own answers
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Users can create their own answers' 
        AND tablename = 'response_answers'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Users can create their own answers" ON veyoyee.response_answers
            FOR INSERT WITH CHECK (
                response_id IN (
                    SELECT id FROM veyoyee.individual_responses WHERE respondent_id = auth.uid()
                )
            );
    END IF;

    -- Survey creators can see answers to their surveys
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Survey creators can see answers to their surveys' 
        AND tablename = 'response_answers'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Survey creators can see answers to their surveys" ON veyoyee.response_answers
            FOR SELECT USING (
                response_id IN (
                    SELECT ir.id FROM veyoyee.individual_responses ir
                    JOIN veyoyee.surveys s ON ir.survey_id = s.id
                    WHERE s.created_by = auth.uid()
                )
            );
    END IF;
END
$$;

-- RLS policies for survey_responses (aggregate data)
DO $$
BEGIN
    -- Anyone can see aggregate survey responses
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Anyone can see aggregate survey responses' 
        AND tablename = 'survey_responses'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Anyone can see aggregate survey responses" ON veyoyee.survey_responses
            FOR SELECT TO authenticated USING (true);
    END IF;

    -- Survey creators can manage aggregate responses
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Survey creators can manage aggregate responses' 
        AND tablename = 'survey_responses'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Survey creators can manage aggregate responses" ON veyoyee.survey_responses
            FOR ALL USING (
                survey_id IN (
                    SELECT id FROM veyoyee.surveys WHERE created_by = auth.uid()
                )
            );
    END IF;
END
$$;

GRANT ALL ON veyoyee.individual_responses TO authenticated;
GRANT ALL ON veyoyee.response_answers TO authenticated;
GRANT ALL ON veyoyee.survey_responses TO authenticated;

-- Migration file for Veyoyee Survey System
-- Creates the veyoyee schema and necessary tables for survey CRUD operations

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS veyoyee;

-- Grant permissions to the schema
GRANT USAGE ON SCHEMA veyoyee TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA veyoyee GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA veyoyee GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA veyoyee GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Create enum types for question types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_type') THEN
        CREATE TYPE veyoyee.question_type AS ENUM (
            'shortAnswer',
            'paragraph',
            'multipleChoice',
            'checkboxList',
            'ratingScale',
            'dateQuestion',
            'linkInput'
        );
    END IF;
END
$$;

-- Create enum types for survey status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'survey_status') THEN
        CREATE TYPE veyoyee.survey_status AS ENUM (
            'draft',
            'active',
            'closed'
        );
    END IF;
END
$$;

-- Create enum types for survey type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'survey_type') THEN
        CREATE TYPE veyoyee.survey_type AS ENUM (
            'academia',
            'commerce'
        );
    END IF;
END
$$;

-- Create surveys table
CREATE TABLE IF NOT EXISTS veyoyee.surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    type veyoyee.survey_type NOT NULL,
    status veyoyee.survey_status NOT NULL DEFAULT 'draft',
    min_respondents INTEGER,
    max_respondents INTEGER,
    start_date DATE,
    end_date DATE,
    reward_amount DECIMAL(10, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Validations
    CONSTRAINT min_max_check CHECK (min_respondents <= max_respondents),
    CONSTRAINT date_check CHECK (start_date <= end_date),
    CONSTRAINT min_respondents_check CHECK (min_respondents >= 1),
    CONSTRAINT max_respondents_check CHECK (max_respondents <= 10000)
);

-- Create questions table
CREATE TABLE IF NOT EXISTS veyoyee.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES veyoyee.surveys(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    type veyoyee.question_type NOT NULL,
    required BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- For rating scale questions
    rating_min INTEGER,
    rating_max INTEGER,
    rating_step DECIMAL(5, 2),
    rating_min_label VARCHAR(255),
    rating_max_label VARCHAR(255),
    
    -- Validations
    CONSTRAINT rating_min_max_check CHECK (rating_min <= rating_max)
);

-- Create question options table (for multiple choice, checkboxes)
CREATE TABLE IF NOT EXISTS veyoyee.question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES veyoyee.questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create responses table to track survey submissions
CREATE TABLE IF NOT EXISTS veyoyee.responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES veyoyee.surveys(id) ON DELETE CASCADE,
    respondent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected
    reputation_score INTEGER,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address TEXT
);

-- Create answers table for individual question responses
CREATE TABLE IF NOT EXISTS veyoyee.answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES veyoyee.responses(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES veyoyee.questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create an index for faster survey retrieval by creator
CREATE INDEX IF NOT EXISTS idx_surveys_created_by ON veyoyee.surveys(created_by);

-- Create an index for faster question retrieval by survey
CREATE INDEX IF NOT EXISTS idx_questions_survey_id ON veyoyee.questions(survey_id);

-- Create an index for faster option retrieval by question
CREATE INDEX IF NOT EXISTS idx_options_question_id ON veyoyee.question_options(question_id);

-- Create an index for faster response retrieval by survey
CREATE INDEX IF NOT EXISTS idx_responses_survey_id ON veyoyee.responses(survey_id);

-- Create an index for faster answer retrieval by response
CREATE INDEX IF NOT EXISTS idx_answers_response_id ON veyoyee.answers(response_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION veyoyee.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_surveys_updated_at ON veyoyee.surveys;
CREATE TRIGGER update_surveys_updated_at
BEFORE UPDATE ON veyoyee.surveys
FOR EACH ROW
EXECUTE FUNCTION veyoyee.update_updated_at_column();

DROP TRIGGER IF EXISTS update_questions_updated_at ON veyoyee.questions;
CREATE TRIGGER update_questions_updated_at
BEFORE UPDATE ON veyoyee.questions
FOR EACH ROW
EXECUTE FUNCTION veyoyee.update_updated_at_column();

DROP TRIGGER IF EXISTS update_question_options_updated_at ON veyoyee.question_options;
CREATE TRIGGER update_question_options_updated_at
BEFORE UPDATE ON veyoyee.question_options
FOR EACH ROW
EXECUTE FUNCTION veyoyee.update_updated_at_column();

-- Row level security policies
ALTER TABLE veyoyee.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE veyoyee.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE veyoyee.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE veyoyee.responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE veyoyee.answers ENABLE ROW LEVEL SECURITY;

-- Surveys RLS policies
DO $$
BEGIN
    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Users can create their own surveys' 
        AND tablename = 'surveys'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Users can create their own surveys"
        ON veyoyee.surveys FOR INSERT
        TO authenticated
        WITH CHECK (created_by = auth.uid());
    END IF;

    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Users can read their own surveys' 
        AND tablename = 'surveys'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Users can read their own surveys"
        ON veyoyee.surveys FOR SELECT
        TO authenticated
        USING (created_by = auth.uid());
    END IF;

    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Users can update their own surveys' 
        AND tablename = 'surveys'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Users can update their own surveys"
        ON veyoyee.surveys FOR UPDATE
        TO authenticated
        USING (created_by = auth.uid())
        WITH CHECK (created_by = auth.uid());
    END IF;

    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Users can delete their own surveys' 
        AND tablename = 'surveys'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Users can delete their own surveys"
        ON veyoyee.surveys FOR DELETE
        TO authenticated
        USING (created_by = auth.uid());
    END IF;

    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Active surveys are readable by anyone' 
        AND tablename = 'surveys'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Active surveys are readable by anyone"
        ON veyoyee.surveys FOR SELECT
        TO anon, authenticated
        USING (status = 'active');
    END IF;
END
$$;

-- Questions RLS policies
DO $$
BEGIN
    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Questions visible to survey creator' 
        AND tablename = 'questions'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Questions visible to survey creator"
        ON veyoyee.questions FOR SELECT
        TO authenticated
        USING (EXISTS (
            SELECT 1 FROM veyoyee.surveys 
            WHERE surveys.id = veyoyee.questions.survey_id 
            AND surveys.created_by = auth.uid()
        ));
    END IF;

    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Questions from active surveys visible to all' 
        AND tablename = 'questions'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Questions from active surveys visible to all"
        ON veyoyee.questions FOR SELECT
        TO anon, authenticated
        USING (EXISTS (
            SELECT 1 FROM veyoyee.surveys 
            WHERE surveys.id = veyoyee.questions.survey_id 
            AND surveys.status = 'active'
        ));
    END IF;

    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Users can insert questions for their own surveys' 
        AND tablename = 'questions'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Users can insert questions for their own surveys"
        ON veyoyee.questions FOR INSERT
        TO authenticated
        WITH CHECK (EXISTS (
            SELECT 1 FROM veyoyee.surveys 
            WHERE surveys.id = survey_id 
            AND surveys.created_by = auth.uid()
        ));
    END IF;
END
$$;

-- Options RLS policies
DO $$
BEGIN
    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Options visible to survey creator' 
        AND tablename = 'question_options'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Options visible to survey creator"
        ON veyoyee.question_options FOR SELECT
        TO authenticated
        USING (EXISTS (
            SELECT 1 FROM veyoyee.questions
            JOIN veyoyee.surveys ON questions.survey_id = surveys.id
            WHERE question_options.question_id = questions.id
            AND surveys.created_by = auth.uid()
        ));
    END IF;

    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Options from active surveys visible to all' 
        AND tablename = 'question_options'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Options from active surveys visible to all"
        ON veyoyee.question_options FOR SELECT
        TO anon, authenticated
        USING (EXISTS (
            SELECT 1 FROM veyoyee.questions
            JOIN veyoyee.surveys ON questions.survey_id = surveys.id
            WHERE question_options.question_id = questions.id
            AND surveys.status = 'active'
        ));
    END IF;

    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Users can insert options for their own questions' 
        AND tablename = 'question_options'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Users can insert options for their own questions"
        ON veyoyee.question_options FOR INSERT
        TO authenticated
        WITH CHECK (EXISTS (
            SELECT 1 FROM veyoyee.questions
            JOIN veyoyee.surveys ON questions.survey_id = surveys.id
            WHERE question_options.question_id = questions.id
            AND surveys.created_by = auth.uid()
        ));
    END IF;
END
$$;

-- Responses RLS policies
DO $$
BEGIN
    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Survey creator can see all responses' 
        AND tablename = 'responses'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Survey creator can see all responses"
        ON veyoyee.responses FOR SELECT
        TO authenticated
        USING (EXISTS (
            SELECT 1 FROM veyoyee.surveys
            WHERE surveys.id = responses.survey_id
            AND surveys.created_by = auth.uid()
        ));
    END IF;

    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Users can see their own responses' 
        AND tablename = 'responses'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Users can see their own responses"
        ON veyoyee.responses FOR SELECT
        TO authenticated
        USING (respondent_id = auth.uid());
    END IF;
END
$$;

-- Answers RLS policies
DO $$
BEGIN
    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Survey creator can see all answers' 
        AND tablename = 'answers'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Survey creator can see all answers"
        ON veyoyee.answers FOR SELECT
        TO authenticated
        USING (EXISTS (
            SELECT 1 FROM veyoyee.responses
            JOIN veyoyee.surveys ON responses.survey_id = surveys.id
            WHERE answers.response_id = responses.id
            AND surveys.created_by = auth.uid()
        ));
    END IF;

    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Users can see their own answers' 
        AND tablename = 'answers'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Users can see their own answers"
        ON veyoyee.answers FOR SELECT
        TO authenticated
        USING (EXISTS (
            SELECT 1 FROM veyoyee.responses
            WHERE answers.response_id = responses.id
            AND responses.respondent_id = auth.uid()
        ));
    END IF;
END
$$;

-- Grant permissions on all tables
GRANT ALL ON ALL TABLES IN SCHEMA veyoyee TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA veyoyee TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA veyoyee TO anon, authenticated, service_role;

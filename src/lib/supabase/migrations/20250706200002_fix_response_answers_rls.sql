-- Fix RLS policies for survey response answers
-- This ensures survey creators can properly read answers to their surveys

-- Drop existing policies for response_answers
DROP POLICY IF EXISTS "Survey creators can see answers to their surveys" ON veyoyee.response_answers;
DROP POLICY IF EXISTS "Users can see their own answers" ON veyoyee.response_answers;

-- Create a more comprehensive policy for survey creators
CREATE POLICY "Survey creators can read all survey answers" ON veyoyee.response_answers
FOR SELECT USING (
    EXISTS (
        SELECT 1 
        FROM veyoyee.individual_responses ir
        JOIN veyoyee.surveys s ON ir.survey_id = s.id
        WHERE ir.id = response_answers.response_id
        AND s.created_by = auth.uid()
    )
);

-- Allow users to read their own answers
CREATE POLICY "Users can read their own answers" ON veyoyee.response_answers
FOR SELECT USING (
    EXISTS (
        SELECT 1 
        FROM veyoyee.individual_responses ir
        WHERE ir.id = response_answers.response_id
        AND ir.respondent_id = auth.uid()
    )
);

-- Allow users to insert their own answers (this should already work)
CREATE POLICY "Users can insert their own answers" ON veyoyee.response_answers
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 
        FROM veyoyee.individual_responses ir
        WHERE ir.id = response_answers.response_id
        AND ir.respondent_id = auth.uid()
    )
);

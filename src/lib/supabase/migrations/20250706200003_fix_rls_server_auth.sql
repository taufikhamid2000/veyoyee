-- Fix RLS policies for response_answers to work with server-side authentication
-- This ensures survey creators can read answers regardless of authentication context

-- Drop all existing policies for response_answers
DROP POLICY IF EXISTS "Survey creators can read all survey answers" ON veyoyee.response_answers;
DROP POLICY IF EXISTS "Users can read their own answers" ON veyoyee.response_answers;
DROP POLICY IF EXISTS "Users can insert their own answers" ON veyoyee.response_answers;
DROP POLICY IF EXISTS "Users can create their own answers" ON veyoyee.response_answers;
DROP POLICY IF EXISTS "Survey creators can see answers to their surveys" ON veyoyee.response_answers;

-- Create a comprehensive policy that works with server-side auth
CREATE POLICY "Survey creators and service can read answers" ON veyoyee.response_answers
FOR SELECT USING (
    -- Allow service role to read everything
    auth.role() = 'service_role'
    OR
    -- Allow authenticated users to read answers to surveys they created
    (
        auth.role() = 'authenticated' 
        AND EXISTS (
            SELECT 1 
            FROM veyoyee.individual_responses ir
            JOIN veyoyee.surveys s ON ir.survey_id = s.id
            WHERE ir.id = response_answers.response_id
            AND s.created_by = auth.uid()
        )
    )
    OR
    -- Allow users to read their own answers
    (
        auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1 
            FROM veyoyee.individual_responses ir
            WHERE ir.id = response_answers.response_id
            AND ir.respondent_id = auth.uid()
        )
    )
);

-- Allow users to insert their own answers
CREATE POLICY "Users can insert answers" ON veyoyee.response_answers
FOR INSERT WITH CHECK (
    auth.role() = 'service_role'
    OR
    (
        auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1 
            FROM veyoyee.individual_responses ir
            WHERE ir.id = response_answers.response_id
            AND ir.respondent_id = auth.uid()
        )
    )
);

-- Grant permissions to ensure access
GRANT ALL ON TABLE veyoyee.response_answers TO anon, authenticated, service_role;

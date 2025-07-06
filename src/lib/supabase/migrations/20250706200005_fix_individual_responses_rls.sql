-- Fix RLS policies for individual_responses to allow survey creators to update response status
-- This ensures survey creators can accept/reject/delete responses to their surveys

-- Add policy for survey creators to update response status
DO $$
BEGIN
    -- Allow survey creators to update responses to their surveys (for status changes)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Survey creators can update response status' 
        AND tablename = 'individual_responses'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Survey creators can update response status" ON veyoyee.individual_responses
            FOR UPDATE USING (
                survey_id IN (
                    SELECT id FROM veyoyee.surveys WHERE created_by = auth.uid()
                )
            );
    END IF;

    -- Allow survey creators to delete responses to their surveys
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Survey creators can delete responses' 
        AND tablename = 'individual_responses'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Survey creators can delete responses" ON veyoyee.individual_responses
            FOR DELETE USING (
                survey_id IN (
                    SELECT id FROM veyoyee.surveys WHERE created_by = auth.uid()
                )
            );
    END IF;

    -- Allow service role to do everything
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Service role can manage all responses' 
        AND tablename = 'individual_responses'
        AND schemaname = 'veyoyee'
    ) THEN
        CREATE POLICY "Service role can manage all responses" ON veyoyee.individual_responses
            FOR ALL USING (auth.role() = 'service_role')
            WITH CHECK (auth.role() = 'service_role');
    END IF;
END
$$;

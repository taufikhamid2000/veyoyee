-- Add status column to individual_responses table
-- This allows proper tracking of response approval status

-- Add status column with default 'pending'
ALTER TABLE veyoyee.individual_responses 
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected'));

-- Create index for faster status filtering
CREATE INDEX IF NOT EXISTS idx_individual_responses_status ON veyoyee.individual_responses(status);

-- Update existing responses to have 'pending' status (they're already set by default)
-- UPDATE veyoyee.individual_responses SET status = 'pending' WHERE status IS NULL;

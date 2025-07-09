-- Add owned_by column to veyoyee.surveys for ownership transfer
ALTER TABLE veyoyee.surveys
ADD COLUMN IF NOT EXISTS owned_by UUID;

-- Set owned_by to created_by for all existing records
UPDATE veyoyee.surveys
SET owned_by = created_by
WHERE owned_by IS NULL;

-- Make owned_by NOT NULL
ALTER TABLE veyoyee.surveys
ALTER COLUMN owned_by SET NOT NULL;

-- Add foreign key constraint for owned_by
ALTER TABLE veyoyee.surveys
ADD CONSTRAINT fk_surveys_owned_by FOREIGN KEY (owned_by) REFERENCES auth.users(id) ON DELETE CASCADE;

-- (Optional) Add comment for clarity
COMMENT ON COLUMN veyoyee.surveys.owned_by IS 'Current owner of the survey (can be transferred, original creator in created_by)';

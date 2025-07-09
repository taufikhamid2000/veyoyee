-- Migration: Add survey_id column to veyoyee.marketplace and set up foreign key
ALTER TABLE veyoyee.marketplace
  ADD COLUMN survey_id TEXT;

-- Add a foreign key constraint to veyoyee.surveys(id)
ALTER TABLE veyoyee.marketplace
  ADD CONSTRAINT marketplace_survey_id_fkey
  FOREIGN KEY (survey_id)
  REFERENCES veyoyee.surveys(id)
  ON DELETE SET NULL;

-- (Optional) If you want to enforce that every listing must have a survey_id, add NOT NULL:
-- ALTER TABLE veyoyee.marketplace ALTER COLUMN survey_id SET NOT NULL;

-- (Optional) If you want to backfill survey_id for existing rows, do it here.
-- UPDATE veyoyee.marketplace SET survey_id = id WHERE survey_id IS NULL;

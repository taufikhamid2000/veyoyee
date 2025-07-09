-- Migration: Add description and price columns to veyoyee.surveys for marketplace integration

ALTER TABLE veyoyee.surveys
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) DEFAULT 0.00;

-- Optionally, add a comment for clarity
COMMENT ON COLUMN veyoyee.surveys.description IS 'Detailed description for marketplace listing';
COMMENT ON COLUMN veyoyee.surveys.price IS 'Listing price for the survey dataset (0 = free/open access)';

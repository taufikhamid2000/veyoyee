-- Marketplace table for survey data listings
-- This migration creates the veyoyee.marketplace table and sets up RLS policies for public read and owner write access

-- 1. Create the marketplace table
CREATE TABLE IF NOT EXISTS veyoyee.marketplace (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    sample_size INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    owner TEXT NOT NULL,
    is_transferable BOOLEAN NOT NULL DEFAULT FALSE,
    last_updated DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 2. Enable Row Level Security
ALTER TABLE veyoyee.marketplace ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policy: Allow anyone to read marketplace listings
CREATE POLICY marketplace_select_public ON veyoyee.marketplace
    FOR SELECT
    USING (true);

-- 4. RLS Policy: Only owner can insert/update/delete their own listings
CREATE POLICY marketplace_owner_write ON veyoyee.marketplace
    FOR ALL
    USING (auth.uid()::text = owner);

-- 5. Grant permissions
GRANT SELECT ON veyoyee.marketplace TO anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON veyoyee.marketplace TO authenticated, service_role;

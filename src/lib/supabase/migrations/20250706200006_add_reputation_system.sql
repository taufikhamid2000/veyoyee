-- Add reputation system to the veyoyee schema
-- This creates a users table for profiles and adds reputation tracking

-- Create users table in veyoyee schema for user profiles and reputation
CREATE TABLE IF NOT EXISTS veyoyee.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    display_name VARCHAR(100),
    email VARCHAR(255),
    total_reputation INTEGER NOT NULL DEFAULT 0,
    surveys_completed INTEGER NOT NULL DEFAULT 0,
    surveys_created INTEGER NOT NULL DEFAULT 0,
    responses_accepted INTEGER NOT NULL DEFAULT 0,
    responses_rejected INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Profile information
    bio TEXT,
    avatar_url TEXT,
    location VARCHAR(100),
    website_url TEXT,
    
    -- Constraints
    CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]{3,50}$'),
    -- No cap on reputation - can be negative or very high for ranking
    CONSTRAINT surveys_completed_non_negative CHECK (surveys_completed >= 0),
    CONSTRAINT surveys_created_non_negative CHECK (surveys_created >= 0),
    CONSTRAINT responses_accepted_non_negative CHECK (responses_accepted >= 0),
    CONSTRAINT responses_rejected_non_negative CHECK (responses_rejected >= 0)
);

-- Add reputation column to individual_responses table (can be negative)
ALTER TABLE veyoyee.individual_responses 
ADD COLUMN IF NOT EXISTS reputation_awarded INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_total_reputation ON veyoyee.users(total_reputation DESC);
CREATE INDEX IF NOT EXISTS idx_users_username ON veyoyee.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON veyoyee.users(email);
CREATE INDEX IF NOT EXISTS idx_individual_responses_reputation ON veyoyee.individual_responses(reputation_awarded);

-- Create function to automatically create user profile on auth.users insert
CREATE OR REPLACE FUNCTION veyoyee.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO veyoyee.users (id, email, display_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION veyoyee.handle_new_user();

-- Create function to update user reputation when response is accepted/rejected
CREATE OR REPLACE FUNCTION veyoyee.update_user_reputation()
RETURNS TRIGGER AS $$
DECLARE
    accepted_points INTEGER := 5;  -- +5 points for accepted response
    rejected_points INTEGER := -5; -- -5 points for rejected response
    user_id UUID;
BEGIN
    -- Only process when status changes to 'accepted'
    IF NEW.status = 'accepted' AND (OLD.status IS NULL OR OLD.status != 'accepted') THEN
        user_id := NEW.respondent_id;
        
        -- Update the reputation_awarded for this response
        UPDATE veyoyee.individual_responses 
        SET reputation_awarded = accepted_points 
        WHERE id = NEW.id;
        
        -- Update user's total reputation and response counts
        UPDATE veyoyee.users 
        SET 
            total_reputation = total_reputation + accepted_points,
            responses_accepted = responses_accepted + 1,
            updated_at = NOW()
        WHERE id = user_id;
        
    -- Handle rejection - deduct reputation and update count
    ELSIF NEW.status = 'rejected' AND (OLD.status IS NULL OR OLD.status != 'rejected') THEN
        user_id := NEW.respondent_id;
        
        -- Update the reputation_awarded for this response (negative)
        UPDATE veyoyee.individual_responses 
        SET reputation_awarded = rejected_points 
        WHERE id = NEW.id;
        
        -- Update user's reputation and rejection count
        UPDATE veyoyee.users 
        SET 
            total_reputation = total_reputation + rejected_points, -- Add negative points
            responses_rejected = responses_rejected + 1,
            updated_at = NOW()
        WHERE id = user_id;
        
    -- Handle status change from accepted to something else (remove reputation)
    ELSIF OLD.status = 'accepted' AND NEW.status != 'accepted' THEN
        user_id := NEW.respondent_id;
        
        -- Remove previously awarded reputation
        UPDATE veyoyee.users 
        SET 
            total_reputation = total_reputation - COALESCE(OLD.reputation_awarded, 0),
            responses_accepted = GREATEST(0, responses_accepted - 1),
            updated_at = NOW()
        WHERE id = user_id;
        
        -- Reset reputation_awarded for this response
        UPDATE veyoyee.individual_responses 
        SET reputation_awarded = 0 
        WHERE id = NEW.id;
        
    -- Handle status change from rejected to something else (remove negative reputation)
    ELSIF OLD.status = 'rejected' AND NEW.status != 'rejected' THEN
        user_id := NEW.respondent_id;
        
        -- Remove previously deducted reputation (subtract negative = add positive)
        UPDATE veyoyee.users 
        SET 
            total_reputation = total_reputation - COALESCE(OLD.reputation_awarded, 0),
            responses_rejected = GREATEST(0, responses_rejected - 1),
            updated_at = NOW()
        WHERE id = user_id;
        
        -- Reset reputation_awarded for this response
        UPDATE veyoyee.individual_responses 
        SET reputation_awarded = 0 
        WHERE id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update reputation on status changes
DROP TRIGGER IF EXISTS on_response_status_change ON veyoyee.individual_responses;
CREATE TRIGGER on_response_status_change
    AFTER UPDATE OF status ON veyoyee.individual_responses
    FOR EACH ROW EXECUTE FUNCTION veyoyee.update_user_reputation();

-- Create function to update surveys_completed when user completes a survey
CREATE OR REPLACE FUNCTION veyoyee.update_surveys_completed()
RETURNS TRIGGER AS $$
BEGIN
    -- Only process when is_complete changes from false to true
    IF NEW.is_complete = true AND (OLD.is_complete = false OR OLD.is_complete IS NULL) THEN
        UPDATE veyoyee.users 
        SET 
            surveys_completed = surveys_completed + 1,
            updated_at = NOW()
        WHERE id = NEW.respondent_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update surveys_completed count
DROP TRIGGER IF EXISTS on_survey_completed ON veyoyee.individual_responses;
CREATE TRIGGER on_survey_completed
    AFTER UPDATE OF is_complete ON veyoyee.individual_responses
    FOR EACH ROW EXECUTE FUNCTION veyoyee.update_surveys_completed();

-- Create function to update surveys_created when user creates a survey
CREATE OR REPLACE FUNCTION veyoyee.update_surveys_created()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE veyoyee.users 
    SET 
        surveys_created = surveys_created + 1,
        updated_at = NOW()
    WHERE id = NEW.created_by;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update surveys_created count
DROP TRIGGER IF EXISTS on_survey_created ON veyoyee.surveys;
CREATE TRIGGER on_survey_created
    AFTER INSERT ON veyoyee.surveys
    FOR EACH ROW EXECUTE FUNCTION veyoyee.update_surveys_created();

-- Grant permissions
GRANT ALL ON veyoyee.users TO anon, authenticated, service_role;

-- Enable RLS for users table
ALTER TABLE veyoyee.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
-- Users can view all public profiles
CREATE POLICY "Users can view public profiles" ON veyoyee.users
    FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON veyoyee.users
    FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (handled by trigger mostly)
CREATE POLICY "Users can insert own profile" ON veyoyee.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Service role can do everything (for triggers and functions)
CREATE POLICY "Service role full access" ON veyoyee.users
    FOR ALL USING (auth.role() = 'service_role');

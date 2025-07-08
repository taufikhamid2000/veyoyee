-- Add SCP and Commerce reward system
-- This migration adds support for:
-- 1. Survey Creation Pass (SCP) system - users can exchange 100 accepted responses for 1 SCP
-- 2. Commerce reward system for commerce surveys

-- Note: survey_type enum already exists with 'academia' and 'commerce' values

-- Add SCP and commerce tracking columns to users table
ALTER TABLE veyoyee.users 
ADD COLUMN IF NOT EXISTS scp_owned INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS commerce_rewards_earned DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS commerce_rewards_claimed DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- Remove unnecessary columns if they exist
DO $$
BEGIN
    -- Drop academia_surveys_completed if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'academia_surveys_completed' 
        AND table_schema = 'veyoyee'
    ) THEN
        ALTER TABLE veyoyee.users DROP COLUMN academia_surveys_completed;
    END IF;

    -- Drop commerce_surveys_completed if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'commerce_surveys_completed' 
        AND table_schema = 'veyoyee'
    ) THEN
        ALTER TABLE veyoyee.users DROP COLUMN commerce_surveys_completed;
    END IF;

    -- Drop surveys_completed if it exists (redundant with responses_accepted)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'surveys_completed' 
        AND table_schema = 'veyoyee'
    ) THEN
        ALTER TABLE veyoyee.users DROP COLUMN surveys_completed;
    END IF;
END $$;

-- Add constraints
DO $$
BEGIN
    -- Add scp_owned constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE constraint_name = 'scp_owned_non_negative' 
        AND table_name = 'users' 
        AND table_schema = 'veyoyee'
    ) THEN
        ALTER TABLE veyoyee.users 
        ADD CONSTRAINT scp_owned_non_negative CHECK (scp_owned >= 0);
    END IF;

    -- Add commerce_rewards_earned constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE constraint_name = 'commerce_rewards_earned_non_negative' 
        AND table_name = 'users' 
        AND table_schema = 'veyoyee'
    ) THEN
        ALTER TABLE veyoyee.users 
        ADD CONSTRAINT commerce_rewards_earned_non_negative CHECK (commerce_rewards_earned >= 0);
    END IF;

    -- Add commerce_rewards_claimed constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE constraint_name = 'commerce_rewards_claimed_non_negative' 
        AND table_name = 'users' 
        AND table_schema = 'veyoyee'
    ) THEN
        ALTER TABLE veyoyee.users 
        ADD CONSTRAINT commerce_rewards_claimed_non_negative CHECK (commerce_rewards_claimed >= 0);
    END IF;
END $$;

-- Add reward tracking to individual_responses table
ALTER TABLE veyoyee.individual_responses 
ADD COLUMN IF NOT EXISTS reward_earned DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS reward_paid BOOLEAN DEFAULT FALSE;

-- Add reward distribution tracking to surveys table
ALTER TABLE veyoyee.surveys 
ADD COLUMN IF NOT EXISTS reward_distributed BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reward_distributed_at TIMESTAMPTZ;

-- Create function to update user stats and reputation
CREATE OR REPLACE FUNCTION veyoyee.update_user_rewards()
RETURNS TRIGGER AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Only process when status changes to 'accepted'
    IF NEW.status = 'accepted' AND (OLD.status != 'accepted' OR OLD.status IS NULL) THEN
        user_id := NEW.respondent_id;
        
        -- Update responses_accepted count
        UPDATE veyoyee.users 
        SET 
            responses_accepted = responses_accepted + 1,
            updated_at = NOW()
        WHERE id = user_id;
        
        -- Update reputation (existing logic)
        UPDATE veyoyee.users 
        SET 
            reputation = reputation + 5,
            updated_at = NOW()
        WHERE id = user_id;
        
    -- Handle status change from 'accepted' to 'rejected' (reverse reputation)
    ELSIF OLD.status = 'accepted' AND NEW.status = 'rejected' THEN
        user_id := NEW.respondent_id;
        
        -- Reverse the responses_accepted count
        UPDATE veyoyee.users 
        SET 
            responses_accepted = GREATEST(0, responses_accepted - 1),
            updated_at = NOW()
        WHERE id = user_id;
        
        -- Reverse reputation
        UPDATE veyoyee.users 
        SET 
            reputation = reputation - 5,
            updated_at = NOW()
        WHERE id = user_id;
        
    -- Handle status change to 'rejected' (from pending)
    ELSIF NEW.status = 'rejected' AND (OLD.status != 'rejected' OR OLD.status IS NULL) THEN
        user_id := NEW.respondent_id;
        
        -- Update responses_rejected count
        UPDATE veyoyee.users 
        SET 
            responses_rejected = responses_rejected + 1,
            updated_at = NOW()
        WHERE id = user_id;
        
        -- Deduct reputation for rejected response
        UPDATE veyoyee.users 
        SET 
            reputation = reputation - 5,
            updated_at = NOW()
        WHERE id = user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the trigger to use the new function
DROP TRIGGER IF EXISTS on_response_status_change ON veyoyee.individual_responses;
CREATE TRIGGER on_response_status_change
    AFTER UPDATE OF status ON veyoyee.individual_responses
    FOR EACH ROW EXECUTE FUNCTION veyoyee.update_user_rewards();

-- Create function to distribute commerce rewards when survey closes
CREATE OR REPLACE FUNCTION veyoyee.distribute_commerce_rewards()
RETURNS TRIGGER AS $$
DECLARE
    accepted_count INTEGER;
    reward_per_response DECIMAL(10, 2);
    response_record RECORD;
BEGIN
    -- Only process when survey status changes to 'closed' and has reward_amount
    IF NEW.status = 'closed' AND OLD.status != 'closed' AND NEW.type = 'commerce' 
       AND NEW.reward_amount > 0 AND NOT NEW.reward_distributed THEN
        
        -- Count accepted responses
        SELECT COUNT(*) INTO accepted_count
        FROM veyoyee.individual_responses 
        WHERE survey_id = NEW.id AND status = 'accepted';
        
        -- Only distribute if there are accepted responses
        IF accepted_count > 0 THEN
            reward_per_response := NEW.reward_amount / accepted_count;
            
            -- Update each accepted response with their reward
            UPDATE veyoyee.individual_responses 
            SET reward_earned = reward_per_response
            WHERE survey_id = NEW.id AND status = 'accepted';
            
            -- Update user commerce rewards
            FOR response_record IN 
                SELECT respondent_id, reward_earned 
                FROM veyoyee.individual_responses 
                WHERE survey_id = NEW.id AND status = 'accepted'
            LOOP
                UPDATE veyoyee.users 
                SET 
                    commerce_rewards_earned = commerce_rewards_earned + response_record.reward_earned,
                    updated_at = NOW()
                WHERE id = response_record.respondent_id;
            END LOOP;
            
            -- Mark rewards as distributed
            UPDATE veyoyee.surveys 
            SET 
                reward_distributed = TRUE,
                reward_distributed_at = NOW()
            WHERE id = NEW.id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for commerce reward distribution
DROP TRIGGER IF EXISTS on_survey_closed ON veyoyee.surveys;
CREATE TRIGGER on_survey_closed
    AFTER UPDATE OF status ON veyoyee.surveys
    FOR EACH ROW EXECUTE FUNCTION veyoyee.distribute_commerce_rewards();

-- Migrate existing data
-- Set all existing surveys to 'academia' type if not already set
UPDATE veyoyee.surveys 
SET type = 'academia' 
WHERE type IS NULL;

-- Note: SCPs are not automatically awarded - users must exchange responses for SCPs manually

-- Grant permissions
GRANT ALL ON veyoyee.users TO anon, authenticated, service_role;
GRANT ALL ON veyoyee.surveys TO anon, authenticated, service_role;
GRANT ALL ON veyoyee.individual_responses TO anon, authenticated, service_role;

-- Replace is_deleted column with 'deleted' status
-- This simplifies the data model by using status instead of a separate boolean

-- Remove the is_deleted column that was added in the previous migration
ALTER TABLE veyoyee.individual_responses 
DROP COLUMN IF EXISTS is_deleted;

-- Drop the index that was created for is_deleted
DROP INDEX IF EXISTS veyoyee.idx_individual_responses_is_deleted;

-- Update the status column CHECK constraint to include 'deleted'
ALTER TABLE veyoyee.individual_responses 
DROP CONSTRAINT IF EXISTS individual_responses_status_check;

ALTER TABLE veyoyee.individual_responses 
ADD CONSTRAINT individual_responses_status_check 
CHECK (status IN ('pending', 'accepted', 'rejected', 'deleted'));

-- Update the reputation function to handle 'deleted' status
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
        
        -- Calculate reputation change based on previous status
        DECLARE
            reputation_change INTEGER;
        BEGIN
            IF OLD.status = 'rejected' THEN
                -- Going from rejected (-5) to accepted (+5) = net +10
                reputation_change := 10;
            ELSE
                -- Going from pending (0) to accepted (+5) = net +5
                reputation_change := 5;
            END IF;
            
            -- Update the reputation_awarded for this response
            UPDATE veyoyee.individual_responses 
            SET reputation_awarded = reputation_change 
            WHERE id = NEW.id;
            
            -- Update user's total reputation and response counts
            UPDATE veyoyee.users 
            SET 
                total_reputation = total_reputation + reputation_change,
                responses_accepted = responses_accepted + 1,
                responses_rejected = CASE 
                    WHEN OLD.status = 'rejected' THEN GREATEST(0, responses_rejected - 1)
                    ELSE responses_rejected 
                END,
                updated_at = NOW()
            WHERE id = user_id;
        END;
        
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
            responses_accepted = CASE 
                WHEN OLD.status = 'accepted' THEN GREATEST(0, responses_accepted - 1)
                ELSE responses_accepted 
            END,
            updated_at = NOW()
        WHERE id = user_id;
        
    -- Handle deletion - preserve reputation but remove counts
    ELSIF NEW.status = 'deleted' AND OLD.status != 'deleted' THEN
        user_id := NEW.respondent_id;
        
        -- Update user's response counts (remove from accepted/rejected counts)
        -- But keep the reputation impact intact
        UPDATE veyoyee.users 
        SET 
            responses_accepted = CASE 
                WHEN OLD.status = 'accepted' THEN GREATEST(0, responses_accepted - 1)
                ELSE responses_accepted 
            END,
            responses_rejected = CASE 
                WHEN OLD.status = 'rejected' THEN GREATEST(0, responses_rejected - 1)
                ELSE responses_rejected 
            END,
            updated_at = NOW()
        WHERE id = user_id;
        
        -- Note: reputation_awarded stays the same to preserve reputation history
        
    -- Handle restoration from deleted status to pending
    ELSIF OLD.status = 'deleted' AND NEW.status = 'pending' THEN
        user_id := NEW.respondent_id;
        
        -- When restoring from deleted, the response goes back to pending
        -- No reputation changes needed, just reset reputation_awarded to 0 if it wasn't already
        IF OLD.reputation_awarded != 0 THEN
            UPDATE veyoyee.individual_responses 
            SET reputation_awarded = 0 
            WHERE id = NEW.id;
        END IF;
        
    -- Handle status change from accepted to something else (remove reputation)
    ELSIF OLD.status = 'accepted' AND NEW.status != 'accepted' AND NEW.status != 'deleted' THEN
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
    ELSIF OLD.status = 'rejected' AND NEW.status != 'rejected' AND NEW.status != 'accepted' AND NEW.status != 'deleted' THEN
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

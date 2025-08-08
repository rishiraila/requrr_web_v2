-- Migration: Fix email uniqueness for FCM tokens
-- This ensures one email = one token across all platforms

-- Drop existing unique constraint on (user_id, platform)
ALTER TABLE fcm_tokens 
DROP INDEX IF EXISTS unique_user_platform;

-- Add new unique constraint on user_id only
ALTER TABLE fcm_tokens 
ADD UNIQUE KEY unique_user_email (user_id);

-- Update platform column to be more flexible
ALTER TABLE fcm_tokens 
MODIFY COLUMN platform VARCHAR(50) NOT NULL DEFAULT 'unknown';

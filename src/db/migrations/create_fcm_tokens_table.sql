-- Migration: Update fcm_tokens table for uniqueness
-- This migration ensures (user_id, platform) combination is unique

-- First, create the updated table if it doesn't exist
CREATE TABLE IF NOT EXISTS fcm_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  token TEXT NOT NULL,
  platform ENUM('android', 'iOS', 'web') NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_platform (user_id, platform),
  INDEX idx_user_id (user_id),
  INDEX idx_platform (platform)
);

-- If table exists, modify it
ALTER TABLE fcm_tokens 
ADD CONSTRAINT IF NOT EXISTS unique_user_platform 
UNIQUE KEY (user_id, platform);

-- Ensure platform column has proper enum values
ALTER TABLE fcm_tokens 
MODIFY COLUMN platform ENUM('android', 'iOS', 'web') NOT NULL DEFAULT 'unknown';

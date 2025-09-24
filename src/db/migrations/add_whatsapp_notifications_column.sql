-- Add whatsapp_notifications column to notification_preferences table
ALTER TABLE notification_preferences
ADD COLUMN whatsapp_notifications BOOLEAN DEFAULT FALSE;

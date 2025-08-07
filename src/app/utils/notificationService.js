/**
 * Notification Service for sending push notifications
 * Similar structure to mailer.js for consistency
 */

// Mock notification service - replace with actual push service (Firebase, OneSignal, etc.)
export const sendPushNotification = async ({ 
  userId, 
  title, 
  body, 
  data = {},
  type = 'push' 
}) => {
  try {
    console.log(`📱 Sending ${type} notification to user ${userId}:`, { title, body, data });
    
    // In production, integrate with actual push service
    // Example: Firebase Cloud Messaging, OneSignal, etc.
    
    // Mock implementation for now
    const notification = {
      id: Date.now().toString(),
      userId,
      title,
      body,
      data,
      type,
      status: 'sent',
      createdAt: new Date().toISOString()
    };
    
    // Store notification in database
    const { db } = require('../../../db');
    await db.execute(
      `INSERT INTO notifications (user_id, title, body, data, type, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, body, JSON.stringify(data), type, 'sent', new Date()]
    );
    
    return { success: true, notification };
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    return { success: false, error: error.message };
  }
};

// Generate notification templates similar to email templates
export const generateNotificationTemplate = ({
  userFirstName,
  clientName,
  serviceName,
  dueDate,
  isOverdue = false,
  daysLeft = null
}) => {
  const formattedDate = new Date(dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let title, body;

  if (isOverdue) {
    title = "⚠️ Overdue Payment";
    body = `Payment for ${serviceName} (${clientName}) is overdue. Please settle it immediately.`;
  } else if (daysLeft !== null) {
    title = `⏰ Payment Due in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`;
    body = `Payment for ${serviceName} (${clientName}) is due on ${formattedDate}.`;
  } else {
    title = "💳 Payment Reminder";
    body = `Payment for ${serviceName} (${clientName}) is due on ${formattedDate}.`;
  }

  return { title, body };
};

// Batch send notifications
export const sendBatchNotifications = async (notifications) => {
  const results = [];
  
  for (const notification of notifications) {
    const result = await sendPushNotification(notification);
    results.push(result);
  }
  
  return results;
};

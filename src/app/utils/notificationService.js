import admin from "firebase-admin";

// ✅ Initialize Firebase Admin with environment variables
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    }),
  });
}

// ✅ Import your DB connection
import { db } from "../../db"; // adjust path if needed

/**
 * Send push notification to one user
 */
export const sendPushNotification = async ({
  userId,
  fcmToken,
  title,
  body,
  data = {},
  type = "push",
}) => {
  try {
    console.log(`📱 Sending ${type} notification to user ${userId}:`, { title, body, data });

    // ✅ Send push via Firebase
    const message = {
      token: fcmToken,
      notification: {
        title,
        body,
      },
      data: {
        ...data,
        type,
      },
    };

    await admin.messaging().send(message);

    // ✅ Store in DB
    await db.execute(
      `INSERT INTO notifications (user_id, title, body, data, type, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, body, JSON.stringify(data), type, "sent", new Date()]
    );

    return { success: true };
  } catch (error) {
    console.error("❌ Error sending notification:", error);

    // Optional: Store failed attempts
    await db.execute(
      `INSERT INTO notifications (user_id, title, body, data, type, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, body, JSON.stringify(data), type, "failed", new Date()]
    );

    return { success: false, error: error.message };
  }
};

/**
 * Generate notification title/body based on due/overdue logic
 */
export const generateNotificationTemplate = ({
  userFirstName,
  clientName,
  serviceName,
  dueDate,
  isOverdue = false,
  daysLeft = null,
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
    title = `⏰ Payment Due in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`;
    body = `Payment for ${serviceName} (${clientName}) is due on ${formattedDate}.`;
  } else {
    title = "💳 Payment Reminder";
    body = `Payment for ${serviceName} (${clientName}) is due on ${formattedDate}.`;
  }

  return { title, body };
};

/**
 * Send push notifications in batch
 */
export const sendBatchNotifications = async (notifications) => {
  const results = [];

  for (const notification of notifications) {
    const result = await sendPushNotification(notification);
    results.push(result);
  }

  return results;
};

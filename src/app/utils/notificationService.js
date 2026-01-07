import admin from "firebase-admin";
import { db } from "../../db";
import { checkAndDeductWhatsAppCredit } from "./whatsappCredits";
import { sendWhatsApp } from "./whatsapp";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

/**
 * ✅ Send push notification to a user
 */
export const sendPushNotification = async ({
  userId,
  title,
  body,
  data = {},
  type = "push",
  fcmToken, // optional
}) => {
  try {
    // ✅ Fetch token from DB if not provided
    if (!fcmToken) {
      const [rows] = await db.execute(
        "SELECT token FROM fcm_tokens WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1",
        [userId]
      );

      if (!rows.length || !rows[0].token) {
        throw new Error("Missing FCM token");
      }

      fcmToken = rows[0].token;
    }

    console.log(`📱 Sending ${type} notification to user ${userId}:`, {
      title,
      body,
      data,
    });

    const message = {
      token: fcmToken,
      notification: { title, body },
      data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])), // all vaues must be strings
    };

    await admin.messaging().send(message);

    // ✅ Store in notifications table
    await db.execute(
      `INSERT INTO notifications (user_id, title, body, data, type, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, body, JSON.stringify(data), type, "sent", new Date()]
    );

    return { success: true };
  } catch (error) {
    console.error("❌ Error sending notification:", error.message);

    // If FCM token is invalid, remove it from DB
    if (error.message.includes("Requested entity was not found") || error.message.includes("registration-token-not-registered")) {
      console.log(`🗑️ Removing invalid FCM token for user ${userId}`);
      await db.execute("DELETE FROM fcm_tokens WHERE user_id = ? AND fcm_token = ?", [userId, fcmToken]);
    }

    // Optional: log to DB as failed if needed
    await db.execute(
      `INSERT INTO notifications (user_id, title, body, data, type, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, body, JSON.stringify(data), type, "failed", new Date()]
    );

    return { success: false, error: error.message };
  }
};

/**
 * ✅ Send WhatsApp notification to a user
 */

export const sendWhatsAppNotification = async ({
  userId,
  templateName = "payment_reminder",
  variables = [],
  data = {},
  type = "whatsapp",
}) => {
  try {
    // 1️⃣ Deduct credit FIRST
    await checkAndDeductWhatsAppCredit(userId, 1);

    // 2️⃣ Fetch phone
    const [rows] = await db.execute(
      "SELECT phone, phone_code FROM users WHERE id = ?",
      [userId]
    );

    if (!rows.length || !rows[0].phone) {
      throw new Error("Missing phone number");
    }

    const to = `${rows[0].phone_code}${rows[0].phone}`;

    // 3️⃣ Send WhatsApp
    await sendWhatsApp({
      to,
      templateName,
      variables,
    });

    // 4️⃣ Log success
    await db.execute(
      `INSERT INTO notifications (user_id, title, body, data, type, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'sent', ?)`,
      [userId, templateName, JSON.stringify(variables), JSON.stringify(data), type, new Date()]
    );

    return { success: true };

  } catch (error) {

    // ❌ Credit exhausted → SILENT FAIL (no WhatsApp)
    if (error.message === "WHATSAPP_CREDITS_EXHAUSTED") {
      console.warn(`⚠️ WhatsApp skipped for user ${userId}: credits exhausted`);
      return { success: false, reason: "NO_CREDITS" };
    }

    console.error("❌ WhatsApp error:", error.message);

    return { success: false, error: error.message };
  }
};
/**
 * ✅ Generate title and body for reminders
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
 * ✅ Send a batch of notifications
 */
export const sendBatchNotifications = async (notifications = []) => {
  const results = [];

  for (const notification of notifications) {
    let result;
    if (notification.type === "whatsapp") {
      result = await sendWhatsAppNotification(notification);
    } else {
      result = await sendPushNotification(notification);
    }
    results.push(result);
  }

  return results;
};

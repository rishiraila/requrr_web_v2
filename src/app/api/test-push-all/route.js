import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { db } from "../../../db"; // adjust path if needed

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

  // 🔥 FIX: Replace escaped newlines with actual newlines
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function GET(req) {
  const token = "ebZYhtl-Q7-UugThSDWENh:APA91bGSTO0Y5sQaVk_O-Tv2O9GWC2p5n6y2kzpNgQuHn9xx5Kaka9DnGp0I8KoE97fROySWgy5HNg2ecDXAg7FDplPUPgkFz8rxd8ON_sZEffENkKvLYmk";

  const message = {
    token,
    notification: {
      title: "🔔 Test Notification",
      body: "This is a test FCM push to user 16",
    },
    data: {
      customKey: "value",
      testType: "manual",
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ Push sent:", response);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error("❌ Push failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

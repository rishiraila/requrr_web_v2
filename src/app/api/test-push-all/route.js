import { db } from '../../../db';
import { NextResponse } from 'next/server';
import { sendPushNotification } from '../../utils/notificationService';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const [users] = await db.query(`
      SELECT np.user_id, u.first_name, fcm.fcm_token
      FROM notification_preferences np
      JOIN users u ON np.user_id = u.id
      JOIN fcm_tokens fcm ON fcm.user_id = u.id
      WHERE np.dashboard_notifications = 1
    `);

    const results = [];

    for (const user of users) {
      if (!user.fcm_token) continue;

      const title = "📢 Test Notification from Requrr";
      const body = `Hello ${user.first_name}, this is a test push notification.`;

      const result = await sendPushNotification({
        userId: user.user_id,
        title,
        body,
        data: {
          type: "test",
        },
      });

      results.push({
        userId: user.user_id,
        status: result.success ? "sent" : "failed",
      });
    }

    return NextResponse.json({
      message: "Push notifications sent to all users with dashboard_notifications = 1",
      results,
    });
  } catch (err) {
    console.error("❌ Error sending push notifications:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

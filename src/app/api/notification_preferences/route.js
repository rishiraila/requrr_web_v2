import { authenticate } from '../../../middleware/auth';

export async function POST(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const prefs = await req.json();
 
  await db.query(
    `INSERT INTO notification_preferences 
     (user_id, reminder_30, reminder_15, reminder_7, overdue, email, dashboard, payment_received, client_added)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
     reminder_30 = VALUES(reminder_30),
     reminder_15 = VALUES(reminder_15),
     reminder_7 = VALUES(reminder_7),
     overdue = VALUES(overdue),
     email = VALUES(email),
     dashboard = VALUES(dashboard),
     payment_received = VALUES(payment_received),
     client_added = VALUES(client_added)
    `,
    [
      user.id,
      prefs.reminder_30 || 0,
      prefs.reminder_15 || 0,
      prefs.reminder_7 || 0,
      prefs.overdue || 0,
      prefs.email || 0,
      prefs.dashboard || 0,
      prefs.payment_received || 0,
      prefs.client_added || 0
    ]
  );

  // ✅ Send confirmation email if email preference is ON
  if (prefs.email) {
    await sendEmail({
      to: user.email,
      subject: 'Notification Preferences Updated',
      text: `Hello ${user.name || ''}, your notification preferences have been updated successfully.`,
    });
  }

  return Response.json({ message: 'Preferences saved' });
}

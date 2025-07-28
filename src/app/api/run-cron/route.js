// app/api/run-cron/route.js
import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { sendEmail } from '../../utils/mailer';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  // Check the secret from query params
  if (secret !== process.env.CRON_SECRET) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 1. Update status logic
    await db.execute(`
      UPDATE income_records
      SET status = 'pending'
      WHERE status = 'paid' AND due_date = CURDATE();
    `);

    await db.execute(`
      UPDATE income_records
      SET status = 'overdue'
      WHERE status = 'pending' AND due_date < CURDATE();
    `);

    // 2. Notification logic
    const [users] = await db.query('SELECT * FROM users');

    for (const user of users) {
      // Skip user if no valid email
      if (!user.email || !user.email.includes('@')) {
        console.warn(`⚠️ Skipping user ${user.id}: invalid email "${user.email}"`);
        continue;
      }

      const [prefsRows] = await db.query(
        'SELECT * FROM notification_preferences WHERE user_id = ?',
        [user.id]
      );

      if (!prefsRows.length) continue;
      const prefs = prefsRows[0];
      const notifications = [];

      const intervals = [
        { days: 30, key: 'remind_30_days_before' },
        { days: 15, key: 'remind_15_days_before' },
        { days: 7, key: 'remind_7_days_before' },
      ];

      for (const { days, key } of intervals) {
        if (!prefs[key]) continue;

        const [records] = await db.query(
          `SELECT * FROM income_records
           WHERE user_id = ? AND due_date = DATE_ADD(CURDATE(), INTERVAL ? DAY) AND status = 'pending'`,
          [user.id, days]
        );

        for (const record of records) {
          notifications.push({
            to: user.email,
            subject: `Reminder: Payment due in ${days} days`,
            message: `Your payment for service ID ${record.service_id} is due on ${record.due_date}.`,
          });
        }
      }

      if (prefs.remind_overdue) {
        const [records] = await db.query(
          `SELECT * FROM income_records
           WHERE user_id = ? AND due_date < CURDATE() AND status = 'pending'`,
          [user.id]
        );

        for (const record of records) {
          notifications.push({
            to: user.email,
            subject: `Reminder: Overdue Payment`,
            message: `Your payment for service ID ${record.service_id} was due on ${record.due_date}.`,
          });
        }
      }

      if (prefs.email_notifications && notifications.length > 0) {
        for (const email of notifications) {
          try {
            if (!email.to || !email.to.includes('@')) {
              console.warn(`⚠️ Skipping invalid recipient email: ${email.to}`);
              continue;
            }

            await sendEmail(email.to, email.subject, email.message);
            console.log(`✅ Email sent to ${email.to}: ${email.subject}`);
          } catch (emailErr) {
            console.error(`❌ Email error for ${email.to}:`, emailErr);
          }
        }
      }
    }

    return NextResponse.json({
      status: '✅ Cron tasks executed: statuses updated & notifications sent.',
    });
  } catch (err) {
    console.error('❌ Cron error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

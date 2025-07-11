export const config = {
  schedule: '@daily', // Run daily – you can also use cron syntax like '0 7 * * *'
};

import { NextResponse } from 'next/server';
import { sendEmail } from '../../utils/mailer';
import { db } from '../../../db';

export async function GET() {
  try {
    const [users] = await db.query('SELECT * FROM users');
    const today = new Date();

    for (const user of users) {
      const [prefsRows] = await db.query(
        'SELECT * FROM notification_preferences WHERE user_id = ?',
        [user.id]
      );

      if (!prefsRows.length) continue;
      const prefs = prefsRows[0];

      const notifications = [];

      // 30, 15, 7 day reminders
      const intervals = [
        { days: 30, key: 'remind_30_days_before' },
        { days: 15, key: 'remind_15_days_before' },
        { days: 7, key: 'remind_7_days_before' },
      ];

      for (const { days, key } of intervals) {
        if (!prefs[key]) continue;

        const [records] = await db.query(
          `SELECT * FROM income_records
           WHERE user_id = ?
           AND due_date = DATE_ADD(CURDATE(), INTERVAL ? DAY)
           AND status = 'pending'`,
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

      // Overdue
      if (prefs.remind_overdue) {
        const [records] = await db.query(
          `SELECT * FROM income_records
           WHERE user_id = ?
           AND due_date < CURDATE()
           AND status = 'pending'`,
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

      // Send emails if user allows
      if (prefs.email_notifications && notifications.length > 0) {
        for (const email of notifications) {
          try {
            await sendEmail(email.to, email.subject, email.message);
            console.log(`Email sent to ${email.to}: ${email.subject}`);
          } catch (emailErr) {
            console.error(`Failed to send email to ${email.to}:`, emailErr);
          }
        }
      }
    }

    return NextResponse.json({ message: 'Notification cron executed successfully' });
  } catch (err) {
    console.error('Cron error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

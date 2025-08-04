// app/api/run-cron/route.js
export const config = {
  schedule: '@daily',
};

import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { sendEmail } from '../../utils/mailer';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Update statuses
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

    const [users] = await db.query('SELECT * FROM users');

    for (const user of users) {
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

      const singleDayReminders = [
        { days: 30, key: 'remind_30_days_before' },
        { days: 15, key: 'remind_15_days_before' },
      ];

      for (const { days, key } of singleDayReminders) {
        if (!prefs[key]) continue;

        const [records] = await db.query(
          `SELECT * FROM income_records
           WHERE user_id = ? AND due_date = DATE_ADD(CURDATE(), INTERVAL ? DAY) AND status != 'paid'`,
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

      // 7-day daily reminder (if due date is within next 7 days and status is not 'paid')
      if (prefs.remind_7_days_before) {
        const [records] = await db.query(
          `SELECT * FROM income_records
           WHERE user_id = ? AND status != 'paid'
           AND due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)`,
          [user.id]
        );

        for (const record of records) {
          const daysLeft = Math.ceil((new Date(record.due_date) - new Date()) / (1000 * 60 * 60 * 24));
          notifications.push({
            to: user.email,
            subject: `Reminder: Payment due in ${daysLeft} day(s)`,
            message: `Reminder: Your payment for service ID ${record.service_id} is due on ${record.due_date}.`,
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
            message: `Your payment for service ID ${record.service_id} was due on ${record.due_date}. Please take action.`,
          });
        }
      }

      if (prefs.email_notifications && notifications.length > 0) {
        for (const email of notifications) {
          try {
            if (!email.to || typeof email.to !== 'string' || !email.to.includes('@')) {
              console.warn(`⚠️ Skipping invalid recipient email:`, email.to);
              continue;
            }

            await sendEmail({ to: email.to, subject: email.subject, text: email.message });
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

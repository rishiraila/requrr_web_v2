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

    // Get users
    const [users] = await db.query('SELECT * FROM users');

    for (const user of users) {
      if (!user.email || !user.email.includes('@')) continue;

      const [prefsRows] = await db.query(
        'SELECT * FROM notification_preferences WHERE user_id = ?',
        [user.id]
      );

      if (!prefsRows.length) continue;
      const prefs = prefsRows[0];
      const notifications = [];

      const intervals = [
        { days: 30, key: 'remind_30_days_before', type: '30_days', once: true },
        { days: 15, key: 'remind_15_days_before', type: '15_days', once: true },
        { days: 7, key: 'remind_7_days_before', type: '7_days', once: false },
      ];

      for (const { days, key, type, once } of intervals) {
        if (!prefs[key]) continue;

        const [records] = await db.query(
          `SELECT * FROM income_records
           WHERE user_id = ? AND due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
             AND status = 'pending'`,
          [user.id, days]
        );

        for (const record of records) {
          // Check if reminder was already sent (if once == true)
          if (once) {
            const [sent] = await db.query(
              `SELECT * FROM notification_log
               WHERE user_id = ? AND income_record_id = ? AND reminder_type = ?`,
              [user.id, record.id, type]
            );
            if (sent.length > 0) continue;
          } else {
            // For 7-day daily reminders, send only between (due_date - 7) to (due_date)
            const diff = Math.ceil(
              (new Date(record.due_date) - new Date()) / (1000 * 60 * 60 * 24)
            );
            if (diff <= 7 && diff >= 0) {
              const [alreadySentToday] = await db.query(
                `SELECT * FROM notification_log
                 WHERE user_id = ? AND income_record_id = ? AND reminder_type = ? AND sent_date = CURDATE()`,
                [user.id, record.id, type]
              );
              if (alreadySentToday.length > 0) continue;
            } else continue;
          }

          notifications.push({
            to: user.email,
            subject: `Reminder: Payment due in ${days} days`,
            message: `Your payment for service ID ${record.service_id} is due on ${record.due_date}.`,
            income_record_id: record.id,
            reminder_type: type,
          });
        }
      }

      // Overdue notifications
      if (prefs.remind_overdue) {
        const [records] = await db.query(
          `SELECT * FROM income_records
           WHERE user_id = ? AND due_date < CURDATE() AND status = 'pending'`,
          [user.id]
        );

        for (const record of records) {
          const [sent] = await db.query(
            `SELECT * FROM notification_log
             WHERE user_id = ? AND income_record_id = ? AND reminder_type = 'overdue'`,
            [user.id, record.id]
          );
          if (sent.length > 0) continue;

          notifications.push({
            to: user.email,
            subject: `Reminder: Overdue Payment`,
            message: `Your payment for service ID ${record.service_id} was due on ${record.due_date}.`,
            income_record_id: record.id,
            reminder_type: 'overdue',
          });
        }
      }

      // Send emails and log them
      for (const email of notifications) {
        try {
          await sendEmail({
            to: email.to,
            subject: email.subject,
            text: email.message,
          });

          await db.query(
            `INSERT INTO notification_log (user_id, income_record_id, reminder_type, sent_date)
             VALUES (?, ?, ?, CURDATE())`,
            [user.id, email.income_record_id, email.reminder_type]
          );

          console.log(`✅ Email sent to ${email.to}: ${email.subject}`);
        } catch (err) {
          console.error(`❌ Failed to send email to ${email.to}`, err);
        }
      }
    }

    return NextResponse.json({ status: '✅ Cron executed successfully' });
  } catch (err) {
    console.error('❌ Cron error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

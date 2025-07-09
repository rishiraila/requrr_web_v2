/**
 * @swagger
 * /api/notification-preferences:
 *   get:
 *     summary: Get current user's notification preferences
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fetched preferences successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 remind_30_days_before:
 *                   type: boolean
 *                 remind_15_days_before:
 *                   type: boolean
 *                 remind_7_days_before:
 *                   type: boolean
 *                 remind_overdue:
 *                   type: boolean
 *                 email_notifications:
 *                   type: boolean
 *                 dashboard_notifications:
 *                   type: boolean
 *                 payment_received_notifications:
 *                   type: boolean
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Database error

 *   put:
 *     summary: Update notification preferences
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               remind_30_days_before:
 *                 type: boolean
 *               remind_15_days_before:
 *                 type: boolean
 *               remind_7_days_before:
 *                 type: boolean
 *               remind_overdue:
 *                 type: boolean
 *               email_notifications:
 *                 type: boolean
 *               dashboard_notifications:
 *                 type: boolean
 *               payment_received_notifications:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Preferences updated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to update preferences
 */


import { db } from '../../../db';
import { authenticate } from '../../../middleware/auth';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [rows] = await db.query(
    'SELECT * FROM notification_preferences WHERE user_id = ?',
    [user.id]
  );

  return NextResponse.json(rows.length ? rows[0] : {});
}

export async function PUT(req) {
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const prefs = await req.json();

  try {
    await db.query(
      `INSERT INTO notification_preferences 
        (user_id, remind_30_days_before, remind_15_days_before, remind_7_days_before, remind_overdue, email_notifications, dashboard_notifications, payment_received_notifications) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        remind_30_days_before = VALUES(remind_30_days_before),
        remind_15_days_before = VALUES(remind_15_days_before),
        remind_7_days_before = VALUES(remind_7_days_before),
        remind_overdue = VALUES(remind_overdue),
        email_notifications = VALUES(email_notifications),
        dashboard_notifications = VALUES(dashboard_notifications),
        payment_received_notifications = VALUES(payment_received_notifications)
      `,
      [
        user.id,
        prefs.remind_30_days_before,
        prefs.remind_15_days_before,
        prefs.remind_7_days_before,
        prefs.remind_overdue,
        prefs.email_notifications,
        prefs.dashboard_notifications,
        prefs.payment_received_notifications,
      ]
    );

    return NextResponse.json({ message: 'Preferences updated' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
}

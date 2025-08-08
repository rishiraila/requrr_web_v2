// app/api/run-cron/route.js
export const config = {
  schedule: "@daily",
};

import { NextResponse } from "next/server";
import { db } from "../../../db";
import { sendEmail } from "../../utils/mailer";
import {
  sendPushNotification,
  generateNotificationTemplate,
} from "../../utils/notificationService";

function generateEmailTemplate({
  userFirstName,
  clientName,
  serviceName,
  dueDate,
  isOverdue = false,
}) {
  const formattedDate = new Date(dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${isOverdue ? "Overdue Payment" : "Payment Reminder"}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <table width="100%" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); padding: 30px;">
        <tr>
          <td style="text-align: center;">
            <h2 style="color: #DC3C22;">${
              isOverdue ? "⚠️ Overdue Payment" : "⏰ Upcoming Payment Reminder"
            }</h2>
          </td>
        </tr>
        <tr>
          <td>
            <p style="font-size: 16px; color: #444;">
              Hello <strong>${userFirstName}</strong>,
            </p>
            <p style="font-size: 16px; color: #444;">
              This is a friendly reminder that your payment for the service
              <strong>${serviceName}</strong> of  <strong>${clientName}</strong>
              is ${
                isOverdue
                  ? '<span style="color: red;">OVERDUE</span>. Please settle it as soon as possible.'
                  : `due on <strong>${formattedDate}</strong>.`
              }
            </p>
            <p style="font-size: 16px; color: #444;">
              We appreciate your prompt attention to this matter.
            </p>
            <p style="font-size: 16px; color: #444;">If you've recieved the payment. Then please update the status of the renewal</p>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 20px;">
            <p style="font-size: 16px; color: #444;">Regards,</p>
            <p style="font-size: 16px; color: #444;"><strong>Team Requrr</strong></p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // 1. Update statuses
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

    // 2. Process renewals
    const [paidRecords] = await db.query(`
      SELECT * FROM income_records WHERE status = 'paid'
    `);

    for (const record of paidRecords) {
      const [serviceRows] = await db.query(
        `SELECT * FROM services WHERE id = ?`,
        [record.service_id]
      );
      const service = serviceRows[0];

      if (service && typeof service.billing_interval === "string") {
        const billingInterval = service.billing_interval.toUpperCase();
        const dueDateStr =
          record.due_date instanceof Date
            ? record.due_date.toISOString().slice(0, 10)
            : new Date(record.due_date).toISOString().slice(0, 10);

        const newDueDate = `DATE_ADD('${dueDateStr}', INTERVAL 1 ${billingInterval})`;

        await db.execute(
          `INSERT INTO income_records (user_id, client_id, service_id, amount, due_date, status)
           VALUES (?, ?, ?, ?, ${newDueDate}, 'pending')`,
          [record.user_id, record.client_id, record.service_id, record.amount]
        );
      }
    }

    // 3. Send notifications
    const [users] = await db.query("SELECT * FROM users");

    for (const user of users) {
      if (!user.email || !user.email.includes("@")) continue;

      const [prefsRows] = await db.query(
        "SELECT * FROM notification_preferences WHERE user_id = ?",
        [user.id]
      );
      if (!prefsRows.length) continue;

      const prefs = prefsRows[0];
      const notifications = [];

      // Fetch FCM token for this user
      const [fcmRows] = await db.query(
        "SELECT fcm_token FROM fcm_tokens WHERE user_id = ?",
        [user.id]
      );
      const fcmToken = fcmRows[0]?.fcm_token;

      const singleDayReminders = [
        { days: 30, key: "remind_30_days_before" },
        { days: 15, key: "remind_15_days_before" },
      ];

      for (const { days, key } of singleDayReminders) {
        if (!prefs[key]) continue;

        const [records] = await db.query(
          `SELECT ir.*, s.name AS service_name, c.name AS client_name
           FROM income_records ir
           JOIN services s ON ir.service_id = s.id
           JOIN clients c ON ir.client_id = c.id
           WHERE ir.user_id = ? AND ir.due_date = DATE_ADD(CURDATE(), INTERVAL ? DAY) AND ir.status != 'paid'`,
          [user.id, days]
        );

        for (const record of records) {
          // Email
          notifications.push({
            to: user.email,
            subject: `Reminder: Payment due in ${days} days`,
            html: generateEmailTemplate({
              userFirstName: user.first_name,
              clientName: record.client_name,
              serviceName: record.service_name,
              dueDate: record.due_date,
            }),
          });

          // Push
          if (prefs.dashboard_notifications && fcmToken) {
            const notif = generateNotificationTemplate({
              userFirstName: user.first_name,
              clientName: record.client_name,
              serviceName: record.service_name,
              dueDate: record.due_date,
              daysLeft: days,
            });

            await sendPushNotification({
              userId: user.id,
              title: notif.title,
              body: notif.body,
              data: {
                serviceName: record.service_name,
                clientName: record.client_name,
                dueDate: record.due_date,
              },
              fcmToken, // ✅ make sure this is always passed
            });
          }
        }
      }

      // 7-day rolling reminder
      if (prefs.remind_7_days_before) {
        const [records] = await db.query(
          `SELECT ir.*, s.name AS service_name, c.name AS client_name
           FROM income_records ir
           JOIN services s ON ir.service_id = s.id
           JOIN clients c ON ir.client_id = c.id
           WHERE ir.user_id = ? AND ir.status != 'paid'
           AND ir.due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)`,
          [user.id]
        );

        for (const record of records) {
          const daysLeft = Math.ceil(
            (new Date(record.due_date) - new Date()) / (1000 * 60 * 60 * 24)
          );

          // Email
          notifications.push({
            to: user.email,
            subject: `Reminder: Payment due in ${daysLeft} day(s)`,
            html: generateEmailTemplate({
              userFirstName: user.first_name,
              clientName: record.client_name,
              serviceName: record.service_name,
              dueDate: record.due_date.toDateString(),
            }),
          });

          // Push
          if (prefs.dashboard_notifications && fcmToken) {
            const notif = generateNotificationTemplate({
              userFirstName: user.first_name,
              clientName: record.client_name,
              serviceName: record.service_name,
              dueDate: record.due_date,
              daysLeft,
            });

            await sendPushNotification({
              userId: user.id,
              title: notif.title,
              body: notif.body,
              data: {
                serviceName: record.service_name,
                clientName: record.client_name,
                dueDate: record.due_date,
              },
              fcmToken, // ✅ make sure this is always passed
            });
          }
        }
      }

      // Overdue reminders
      if (prefs.remind_overdue) {
        const [records] = await db.query(
          `SELECT ir.*, s.name AS service_name, c.name AS client_name
           FROM income_records ir
           JOIN services s ON ir.service_id = s.id
           JOIN clients c ON ir.client_id = c.id
           WHERE ir.user_id = ? AND ir.due_date < CURDATE() AND ir.status = 'pending'`,
          [user.id]
        );

        for (const record of records) {
          // Email
          notifications.push({
            to: user.email,
            subject: `Reminder: Overdue Payment`,
            html: generateEmailTemplate({
              userFirstName: user.first_name,
              clientName: record.client_name,
              serviceName: record.service_name,
              dueDate: record.due_date.toDateString(),
              isOverdue: true,
            }),
          });

          // Push
          if (prefs.dashboard_notifications && fcmToken) {
            const notif = generateNotificationTemplate({
              userFirstName: user.first_name,
              clientName: record.client_name,
              serviceName: record.service_name,
              dueDate: record.due_date,
              isOverdue: true,
            });

            await sendPushNotification({
              userId: user.id,
              title: notif.title,
              body: notif.body,
              data: {
                serviceName: record.service_name,
                clientName: record.client_name,
                dueDate: record.due_date,
              },
              fcmToken, // ✅ make sure this is always passed
            });
          }
        }
      }

      // Send all emails
      if (prefs.email_notifications && notifications.length > 0) {
        for (const email of notifications) {
          try {
            await sendEmail({
              to: email.to,
              subject: email.subject,
              html: email.html,
            });
            console.log(`✅ Email sent to ${email.to}: ${email.subject}`);
          } catch (emailErr) {
            console.error(`❌ Email error for ${email.to}:`, emailErr);
          }
        }
      }
    }

    return NextResponse.json({
      status:
        "✅ Cron tasks executed: statuses updated, renewals created, emails sent, push sent.",
    });
  } catch (err) {
    console.error("❌ Cron error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

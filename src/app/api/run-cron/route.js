import { NextResponse } from "next/server";
import { db } from "../../../db";
import { sendEmail } from "../../utils/mailer";
import { sendWhatsApp } from "../../utils/whatsapp";
import { sendWhatsAppNotification } from "../../utils/notificationService";

import {
  sendPushNotification,
  generateNotificationTemplate,
} from "../../utils/notificationService";

/**
 * (Legacy) HTML generator kept for reference — not used for template-sends,
 * but left here so behavior is unchanged for devs reading the file.
 */

function generateUnifiedDailyEmail(user, upcoming, overdue) {
  const row = (r, showDays = true) => `
    <tr>
      <td>${r.client_name}</td>
      <td>${r.service_name}</td>
      <td>${new Date(r.due_date).toLocaleDateString("en-GB")}</td>
      ${showDays ? `<td>${r.daysLeft} day(s)</td>` : ""}
    </tr>`;

  return `
  <html>
  <body style="font-family:Arial;background:#f4f6f8;padding:20px">
    <table width="600" align="center" style="background:#fff;border-radius:8px;padding:20px">
      <h2 style="color:#DC3C22">📌 Your Daily Renewal Summary</h2>
      <p>Hello ${user.first_name || "User"},</p>

      ${
        upcoming.length
          ? `<h3>⏰ Upcoming</h3>
             <table width="100%" border="1" cellpadding="8">
             <tr><th>Client</th><th>Service</th><th>Due</th><th>Days</th></tr>
             ${upcoming.map((r) => row(r)).join("")}
             </table>`
          : ""
      }

      ${
        overdue.length
          ? `<h3 style="color:red">⚠️ Overdue</h3>
             <table width="100%" border="1" cellpadding="8">
             <tr><th>Client</th><th>Service</th><th>Due</th></tr>
             ${overdue.map((r) => row(r, false)).join("")}
             </table>`
          : ""
      }

      <p>Regards,<br/>Requrr Team</p>
    </table>
  </body>
  </html>`;
}
function buildTextSummary(upcoming, overdue) {
  let text = "";

  if (upcoming.length) {
    text += "Upcoming Renewals:\n";
    upcoming.forEach((r) => {
      text += `- ${r.client_name} | ${r.service_name} | ${new Date(r.due_date).toLocaleDateString("en-GB")} | ${r.daysLeft} days\n`;
    });
    text += "\n";
  }

  if (overdue.length) {
    text += "Overdue Renewals:\n";
    overdue.forEach((r) => {
      text += `- ${r.client_name} | ${r.service_name} | ${new Date(r.due_date).toLocaleDateString("en-GB")}\n`;
    });
  }

  return text;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Template slugs from env (set these in your environment)
  const TEMPLATE_REMINDER =
    process.env.MSG91_TEMPLATE_REMINDER || "renewal_reminder_v1";
  const TEMPLATE_OVERDUE =
    process.env.MSG91_TEMPLATE_OVERDUE || "renewal_overdue_v1";

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

    // 2. Process renewals (create next due for paid entries)
    const [paidRecords] = await db.query(`
      SELECT * FROM income_records WHERE status = 'paid'
    `);

    for (const record of paidRecords) {
      const [serviceRows] = await db.query(
        `SELECT * FROM services WHERE id = ?`,
        [record.service_id],
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
          [record.user_id, record.client_id, record.service_id, record.amount],
        );
      }
    }

    // 3. Send notifications
    const [users] = await db.query("SELECT * FROM users");

    for (const user of users) {
      if (!user.email || !user.email.includes("@")) continue;

      const [prefsRows] = await db.query(
        "SELECT * FROM notification_preferences WHERE user_id = ?",
        [user.id],
      );
      if (!prefsRows.length) continue;

      const prefs = prefsRows[0];
      const upcoming = [];
      const overdue = [];

      // Fetch FCM token for this user
      const [fcmRows] = await db.query(
        "SELECT fcm_token FROM fcm_tokens WHERE user_id = ?",
        [user.id],
      );
      const fcmToken = fcmRows[0]?.fcm_token;

      // Helper to format date for template variables
      const formatForTemplate = (d) =>
        new Date(d).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

      // ----------------------
      // 30-day & 15-day reminders
      // ----------------------
      const singleDayReminders = [
        { days: 30, key: "remind_30_days_before" },
        { days: 15, key: "remind_15_days_before" },
      ];

      for (const { days, key } of singleDayReminders) {
        if (!prefs[key]) continue;

        const [records] = await db.query(
          `SELECT ir.*, s.name AS service_name, c.name AS client_name, c.email AS client_email, c.phone AS client_phone, NULL AS client_phone_code
           FROM income_records ir
           JOIN services s ON ir.service_id = s.id
           JOIN clients c ON ir.client_id = c.id
           WHERE ir.user_id = ? AND ir.due_date = DATE_ADD(CURDATE(), INTERVAL ? DAY) AND ir.status != 'paid'`,
          [user.id, days],
        );

        for (const record of records) {
          const dueDateDisplay = formatForTemplate(record.due_date);

          // Email (MSG91 template)
          if (prefs.email_notifications) {
            try {
              upcoming.push({
                client_name: record.client_name,
                service_name: record.service_name,
                due_date: record.due_date,
                daysLeft: days,
              });

              console.log(`📌 Reminder (${days}d) queued for ${user.email}`);
            } catch (emailErr) {
              console.error(
                `❌ Reminder email error for ${user.email}:`,
                emailErr,
              );
            }
          }

          // WhatsApp (unchanged)
          if (prefs.whatsapp_notifications && user.phone) {
            try {
              await sendWhatsAppNotification({
                // to: `${user.phone_code}${user.phone}`,
                userId: user.id,
                templateName: "payment_reminder",
                variables: [
                  user.first_name || "User",
                  record.service_name,
                  record.client_name,
                  new Date(record.due_date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                ],
              });

              console.log(
                `✅ WhatsApp sent to ${user.phone_code}${user.phone}`,
              );
            } catch (whatsappErr) {
              console.error(
                `❌ WhatsApp error for ${user.phone_code}${user.phone}:`,
                whatsappErr,
              );
            }
          }

          // Push (unchanged)
          if (prefs.dashboard_notifications && fcmToken) {
            const notif = generateNotificationTemplate({
              userFirstName: user.first_name || "User",
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
              fcmToken,
            });
          }
        }
      }

      // ----------------------
      // 7-day rolling reminders
      // ----------------------
      if (prefs.remind_7_days_before) {
        const [records] = await db.query(
          `SELECT ir.*, s.name AS service_name, c.name AS client_name, c.email AS client_email, c.phone AS client_phone, NULL AS client_phone_code
           FROM income_records ir
           JOIN services s ON ir.service_id = s.id
           JOIN clients c ON ir.client_id = c.id
           WHERE ir.user_id = ? AND ir.status != 'paid'
           AND ir.due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)`,
          [user.id],
        );

        for (const record of records) {
          const daysLeft = Math.ceil(
            (new Date(record.due_date) - new Date()) / (1000 * 60 * 60 * 24),
          );
          const dueDateDisplay = formatForTemplate(record.due_date);

          if (prefs.email_notifications) {
            try {
              upcoming.push({
                client_name: record.client_name,
                service_name: record.service_name,
                due_date: record.due_date,
                daysLeft,
              });

              console.log(`📌 7-day reminder queued for ${user.email}`);
            } catch (err) {
              console.error(
                `❌ 7-day reminder email error for ${user.email}:`,
                err,
              );
            }
          }

          if (prefs.whatsapp_notifications && user.phone) {
            try {
              await sendWhatsAppNotification({
                // to: `${user.phone_code}${user.phone}`,
                userId: user.id,
                templateName: "payment_reminder",
                variables: [
                  user.first_name || "User",
                  record.service_name,
                  record.client_name,
                  new Date(record.due_date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                ],
              });

              console.log(
                `✅ WhatsApp sent to ${user.phone_code}${user.phone}`,
              );
            } catch (whatsappErr) {
              console.error(
                `❌ WhatsApp error for ${user.phone_code}${user.phone}:`,
                whatsappErr,
              );
            }
          }

          if (prefs.dashboard_notifications && fcmToken) {
            const notif = generateNotificationTemplate({
              userFirstName: user.first_name || "User",
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
              fcmToken,
            });
          }
        }
      }

      // ----------------------
      // Overdue reminders
      // ----------------------
      if (prefs.remind_overdue) {
        const [records] = await db.query(
          `SELECT ir.*, s.name AS service_name, c.name AS client_name, c.email AS client_email, c.phone AS client_phone, NULL AS client_phone_code
           FROM income_records ir
           JOIN services s ON ir.service_id = s.id
           JOIN clients c ON ir.client_id = c.id
           WHERE ir.user_id = ? AND ir.due_date < CURDATE() AND ir.status = 'pending'`,
          [user.id],
        );

        for (const record of records) {
          const dueDateDisplay = formatForTemplate(record.due_date);

          if (prefs.email_notifications) {
            try {
              overdue.push({
                client_name: record.client_name,
                service_name: record.service_name,
                due_date: record.due_date,
              });

              console.log(`📌 Overdue reminder queued for ${user.email}`);
            } catch (err) {
              console.error(`❌ Overdue email error for ${user.email}:`, err);
            }
          }

          if (prefs.whatsapp_notifications && user.phone) {
            try {
              await sendWhatsAppNotification({
                // to: `${user.phone_code}${user.phone}`,
                userId: user.id,
                templateName: "payment_overdue",
                variables: [
                  user.first_name || "User",
                  record.service_name,
                  record.client_name,
                  new Date(record.due_date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                ],
              });

              console.log(
                `✅ WhatsApp sent to ${user.phone_code}${user.phone}`,
              );
            } catch (whatsappErr) {
              console.error(
                `❌ WhatsApp error for ${user.phone_code}${user.phone}:`,
                whatsappErr,
              );
            }
          }

          if (prefs.dashboard_notifications && fcmToken) {
            const notif = generateNotificationTemplate({
              userFirstName: user.first_name || "User",
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
              fcmToken,
            });
          }
        }
      }
      // 📧 Send ONE daily aggregated email per user
      // ✅ MSG91 Template daily digest
      if (prefs.email_notifications && (upcoming.length || overdue.length)) {
        const summaryText = buildTextSummary(upcoming, overdue);

        await sendEmail({
          to: { email: user.email, name: user.first_name || "User" },
          templateId: "daily_renewal_digest",
          templateVariables: {
            userFirstName: user.first_name || "User",
            summary: summaryText,
          },
        });

        console.log(`📧 Daily summary sent to ${user.email}`);
      }
    }

    // 4. Send notifications to clients (only if enabled by user)
    const [allRecords] = await db.query(`
  SELECT ir.id, ir.user_id, ir.due_date, ir.status, ir.last_notified_date,
         s.name AS service_name,
         c.name AS client_name,
         c.email AS client_email,
         c.phone AS client_phone
  FROM income_records ir
  JOIN services s ON ir.service_id = s.id
  JOIN clients c ON ir.client_id = c.id
  WHERE ir.status != 'paid'
    AND (
      ir.due_date = CURDATE()
      OR ir.due_date = DATE_ADD(CURDATE(), INTERVAL 7 DAY)
      OR ir.due_date = DATE_ADD(CURDATE(), INTERVAL 15 DAY)
      OR ir.due_date = DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      OR (ir.status = 'pending' AND ir.due_date < CURDATE())
    )
`);

    console.log(`Found ${allRecords.length} client records to notify`);

    for (const record of allRecords) {
      console.log(`Processing client record ${record.id}: user_id=${record.user_id}, client_email=${record.client_email}, due_date=${record.due_date}, last_notified_date=${record.last_notified_date}`);

      const today = new Date().toISOString().slice(0, 10);

      if (
        record.last_notified_date &&
        new Date(record.last_notified_date).toISOString().slice(0, 10) === today
      ) {
        console.log(`Skipping record ${record.id}: already notified today`);
        continue; // already notified today
      }

      const [ownerPrefs] = await db.query(
        "SELECT client_email_notifications, client_whatsapp_notifications FROM notification_preferences WHERE user_id = ?",
        [record.user_id],
      );

      if (!ownerPrefs.length) {
        console.log(`Skipping record ${record.id}: no notification preferences found for user ${record.user_id}`);
        continue;
      }
      const cp = ownerPrefs[0];
      console.log(`Record ${record.id} preferences: client_email_notifications=${cp.client_email_notifications}, client_whatsapp_notifications=${cp.client_whatsapp_notifications}`);

      const dueDateDisplay = new Date(record.due_date).toLocaleDateString(
        "en-GB",
      );
      const isOverdue = new Date(record.due_date) < new Date();

      // 📧 Client Email (HTML MSG91 Template)
      if (cp.client_email_notifications && record.client_email) {
        console.log(`Attempting to send client email to ${record.client_email} for record ${record.id} with template ${isOverdue ? process.env.MSG91_TEMPLATE_OVERDUE : process.env.MSG91_TEMPLATE_REMINDER}`);
        try {
          await sendEmail({
            to: { email: record.client_email, name: record.client_name },
            templateId: isOverdue
              ? process.env.MSG91_TEMPLATE_OVERDUE
              : process.env.MSG91_TEMPLATE_REMINDER,
            templateVariables: {
              userFirstName: record.client_name,
              serviceName: record.service_name,
              clientName: record.client_name,
              dueDate: dueDateDisplay,
            },
          });

          console.log(`📧 Client email sent to ${record.client_email}`);

          await db.query(
            "UPDATE income_records SET last_notified_date = CURDATE() WHERE id = ?",
            [record.id],
          );
        } catch (err) {
          console.error("❌ Client email failed:", err.message);
        }
      } else {
        console.log(`Skipping client email for record ${record.id}: client_email_notifications=${cp.client_email_notifications}, client_email=${record.client_email}`);
      }

      // 📱 Client WhatsApp
      if (cp.client_whatsapp_notifications && record.client_phone) {
        try {
          await sendWhatsApp({
            to: record.client_phone,
            templateName: isOverdue ? "payment_overdue" : "payment_reminder",
            variables: [
              record.client_name,
              record.service_name,
              record.client_name,
              dueDateDisplay,
            ],
          });

          console.log(`📱 Client WhatsApp sent to ${record.client_phone}`);
          await db.query(
            "UPDATE income_records SET last_notified_date = CURDATE() WHERE id = ?",
            [record.id],
          );
        } catch (err) {
          console.error("❌ Client WhatsApp failed:", err);
        }
      }
    }

    return NextResponse.json({
      status:
        "✅ Cron tasks executed: statuses updated, renewals created, emails sent, WhatsApp sent, push sent.",
    });
  } catch (err) {
    console.error("❌ Cron error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

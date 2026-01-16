// =======================
// EXPENSE STATUS UPDATE
// =======================
await db.execute(`
  UPDATE expenses
  SET status = 'overdue'
  WHERE status = 'pending'
  AND due_date < CURDATE()
`);

// =======================
// RECURRING EXPENSE RUNNER
// =======================
const [recurrings] = await db.query(`
  SELECT * FROM recurring_expenses
  WHERE status = 'active'
  AND next_run_date <= CURDATE()
`);

for (const r of recurrings) {
  await db.query(
    `INSERT INTO expenses
     (user_id, title, amount, expense_date, due_date, status, is_recurring, recurrence_id, category_id, notes)
     VALUES (?, ?, ?, CURDATE(), ?, 'pending', 1, ?, ?, ?)`,
    [
      r.user_id,
      r.title,
      r.amount,
      r.next_run_date,
      r.id,
      r.category_id,
      r.notes,
    ]
  );

  const next = new Date(r.next_run_date);
  if (r.frequency === 'weekly') next.setDate(next.getDate() + 7);
  if (r.frequency === 'monthly') next.setMonth(next.getMonth() + 1);
  if (r.frequency === 'yearly') next.setFullYear(next.getFullYear() + 1);

  await db.query(
    'UPDATE recurring_expenses SET next_run_date = ? WHERE id = ?',
    [next, r.id]
  );
}
// =======================
// EXPENSE NOTIFICATIONS
// =======================

const EXPENSE_REMINDER_TEMPLATE =
  process.env.EXPENSE_REMINDER_TEMPLATE || 'expense_reminder_v1';
const EXPENSE_OVERDUE_TEMPLATE =
  process.env.EXPENSE_OVERDUE_TEMPLATE || 'expense_overdue_v1';

// Fetch all users once
const [users] = await db.query('SELECT * FROM users');

for (const user of users) {
  const [prefsRows] = await db.query(
    'SELECT * FROM notification_preferences WHERE user_id = ?',
    [user.id]
  );
  if (!prefsRows.length) continue;

  const prefs = prefsRows[0];

  const [fcmRows] = await db.query(
    'SELECT fcm_token FROM fcm_tokens WHERE user_id = ?',
    [user.id]
  );
  const fcmToken = fcmRows[0]?.fcm_token;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  // ----------------------
  // 30 & 15 day reminders
  // ----------------------
  const reminderWindows = [
    { days: 30, key: 'remind_30_days_before' },
    { days: 15, key: 'remind_15_days_before' },
  ];

  for (const { days, key } of reminderWindows) {
    if (!prefs[key]) continue;

    const [expenses] = await db.query(
      `SELECT *
       FROM expenses
       WHERE user_id = ?
       AND status != 'paid'
       AND due_date = DATE_ADD(CURDATE(), INTERVAL ? DAY)`,
      [user.id, days]
    );

    for (const e of expenses) {
      const dueDateDisplay = formatDate(e.due_date);

      // Email
      if (prefs.email_notifications && user.email) {
        await sendEmail({
          to: { email: user.email, name: user.first_name || 'User' },
          templateId: EXPENSE_REMINDER_TEMPLATE,
          templateVariables: {
            userFirstName: user.first_name || 'User',
            expenseTitle: e.title,
            amount: `₹${e.amount}`,
            dueDate: dueDateDisplay,
            daysLeft: days,
          },
        });
      }

      // WhatsApp
      if (prefs.whatsapp_notifications && user.phone) {
        await sendWhatsAppNotification({
          userId: user.id,
          templateName: 'expense_reminder',
          variables: [
            user.first_name || 'User',
            e.title,
            `₹${e.amount}`,
            dueDateDisplay,
          ],
        });
      }

      // Push
      if (prefs.dashboard_notifications && fcmToken) {
        await sendPushNotification({
          userId: user.id,
          title: '💸 Upcoming Expense',
          body: `${e.title} of ₹${e.amount} is due in ${days} days`,
          data: { expenseId: e.id },
          fcmToken,
        });
      }
    }
  }

  // ----------------------
  // 7-day rolling reminder
  // ----------------------
  if (prefs.remind_7_days_before) {
    const [expenses] = await db.query(
      `SELECT *
       FROM expenses
       WHERE user_id = ?
       AND status != 'paid'
       AND due_date BETWEEN CURDATE()
       AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)`,
      [user.id]
    );

    for (const e of expenses) {
      const daysLeft = Math.ceil(
        (new Date(e.due_date) - new Date()) / (1000 * 60 * 60 * 24)
      );

      if (prefs.email_notifications) {
        await sendEmail({
          to: { email: user.email, name: user.first_name || 'User' },
          templateId: EXPENSE_REMINDER_TEMPLATE,
          templateVariables: {
            userFirstName: user.first_name || 'User',
            expenseTitle: e.title,
            amount: `₹${e.amount}`,
            dueDate: formatDate(e.due_date),
            daysLeft,
          },
        });
      }
    }
  }

  // ----------------------
  // Overdue expenses
  // ----------------------
  if (prefs.remind_overdue) {
    const [expenses] = await db.query(
      `SELECT *
       FROM expenses
       WHERE user_id = ?
       AND status = 'pending'
       AND due_date < CURDATE()`,
      [user.id]
    );

    for (const e of expenses) {
      if (prefs.email_notifications) {
        await sendEmail({
          to: { email: user.email, name: user.first_name || 'User' },
          templateId: EXPENSE_OVERDUE_TEMPLATE,
          templateVariables: {
            userFirstName: user.first_name || 'User',
            expenseTitle: e.title,
            amount: `₹${e.amount}`,
            dueDate: formatDate(e.due_date),
            isOverdue: true,
          },
        });
      }

      if (prefs.dashboard_notifications && fcmToken) {
        await sendPushNotification({
          userId: user.id,
          title: '⚠️ Overdue Expense',
          body: `${e.title} of ₹${e.amount} is overdue`,
          data: { expenseId: e.id },
          fcmToken,
        });
      }
    }
  }
}

import { db } from '../../../db';
import { authenticate } from '../../../middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [records] = await db.query(
    'SELECT * FROM recurring_expenses WHERE user_id = ? ORDER BY payment_date DESC',
    [user.id]
  );

  return Response.json(records);
}

export async function POST(req) {
  const user = authenticate(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const {
    title,
    amount,
    payment_date,
    frequency = 'monthly',
    due_date,
    status = 'pending',
    is_recurring = true,
    recurrence_id = null,
    notes,
  } = await req.json();

  // You can also apply a subscription check like income module here if needed.

  await db.query(
    `INSERT INTO recurring_expenses 
     (user_id, title, amount, payment_date, frequency, due_date, status, is_recurring, recurrence_id, notes) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.id,
      title,
      amount,
      payment_date,
      frequency,
      due_date || null,
      status,
      is_recurring,
      recurrence_id,
      notes,
    ]
  );

  return Response.json({ message: 'Recurring expense added successfully' });
}

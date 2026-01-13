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
    frequency,
    due_date,
    status,
    is_recurring,
    recurrence_id,
    notes,
    category_id,
  } = await req.json();

  // 🔐 SECURITY: validate category ownership
  if (category_id) {
    const [[cat]] = await db.query(
      'SELECT id FROM expense_categories WHERE id = ? AND user_id = ?',
      [category_id, user.id]
    );

    if (!cat) {
      return Response.json(
        { error: 'Invalid category selected' },
        { status: 400 }
      );
    }
  }

  await db.query(
    `INSERT INTO recurring_expenses
     (user_id, title, amount, payment_date, frequency, due_date, status, is_recurring, recurrence_id, notes, category_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      category_id || null,
    ]
  );

  return Response.json({ message: 'Recurring expense added successfully' });
}


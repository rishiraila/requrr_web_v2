import { db } from '../../../db';
import { authenticate } from '../../../middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [rows] = await db.query(
    `SELECT re.*, ec.name AS category_name
     FROM recurring_expenses re
     LEFT JOIN expense_categories ec ON re.category_id = ec.id
     WHERE re.user_id = ? ORDER BY re.next_run_date`,
    [user.id]
  );

  return Response.json(rows);
}

export async function POST(req) {
  const user = authenticate(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const {
    title,
    amount,
    frequency,
    next_run_date,
    category_id,
    notes,
    is_one_time,
  } = await req.json();

  // ✅ Correct validation
  if (!title || !amount) {
    return Response.json(
      { error: 'Missing required fields: title and amount are required' },
      { status: 400 }
    );
  }

  if (!is_one_time && (!frequency || !next_run_date)) {
    return Response.json(
      { error: 'Missing required fields: frequency and next_run_date are required for recurring expenses' },
      { status: 400 }
    );
  }

  if (is_one_time && !next_run_date) {
    return Response.json(
      { error: 'Missing required fields: date is required for one-time expenses' },
      { status: 400 }
    );
  }

  await db.query(
    `INSERT INTO recurring_expenses
     (user_id, title, amount, frequency, next_run_date, category_id, status, notes)
     VALUES (?, ?, ?, ?, ?, ?, 'active', ?)`,
    [
      user.id,
      title,
      amount,
      frequency,
      next_run_date,
      category_id || null,
      notes || null,
    ]
  );

  return Response.json({ message: 'Recurring expense added successfully' });
}

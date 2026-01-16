/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Get all expenses for the authenticated user
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Create a new one-time expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 */

import { db } from '../../../db';
import { authenticate } from '../../../middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [expenses] = await db.query(
    `SELECT 
       e.*,
       ec.name AS category_name
     FROM expenses e
     LEFT JOIN expense_categories ec ON e.category_id = ec.id
     WHERE e.user_id = ?
     ORDER BY e.expense_date DESC`,
    [user.id]
  );

  return Response.json(expenses);
}


export async function POST(req) {
  const user = authenticate(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const {
    title,
    amount,
    expense_date,
    due_date,
    status = 'pending',
    category_id,
    notes,
  } = await req.json();

  if (!title || !amount || !expense_date) {
    return Response.json(
      { error: 'title, amount and expense_date are required' },
      { status: 400 }
    );
  }

  await db.query(
    `INSERT INTO expenses
     (user_id, title, amount, expense_date, due_date, status, is_recurring, category_id, notes)
     VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)`,
    [
      user.id,
      title,
      amount,
      expense_date,
      due_date || null,
      status,
      category_id || null,
      notes,
    ]
  );

  return Response.json({ message: 'Expense created successfully' });
}


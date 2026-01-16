/**
 * @swagger
 * /api/expenses/{id}:
 *   get:
 *     summary: Get expense by ID
 *   put:
 *     summary: Update expense
 *   delete:
 *     summary: Delete expense
 */

import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;

  const [[expense]] = await db.query(
    'SELECT * FROM expenses WHERE id = ? AND user_id = ?',
    [id, user.id]
  );

  return Response.json(expense || {});
}

export async function PUT(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const {
    title,
    amount,
    expense_date,
    due_date,
    status,
    category_id,
    notes,
  } = await req.json();

  // 🔐 Validate category ownership
  if (category_id) {
    const [[cat]] = await db.query(
      'SELECT id FROM expense_categories WHERE id = ? AND user_id = ?',
      [category_id, user.id]
    );
    if (!cat) {
      return Response.json({ error: 'Invalid category' }, { status: 400 });
    }
  }

  await db.query(
    `UPDATE expenses SET
      title = ?, amount = ?, expense_date = ?, due_date = ?,
      status = ?, category_id = ?, notes = ?
     WHERE id = ? AND user_id = ?`,
    [
      title,
      amount,
      expense_date,
      due_date || null,
      status,
      category_id || null,
      notes,
      id,
      user.id,
    ]
  );

  return Response.json({ message: 'Expense updated' });
}

export async function DELETE(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;

  await db.query(
    'DELETE FROM expenses WHERE id = ? AND user_id = ?',
    [id, user.id]
  );

  return Response.json({ message: 'Expense deleted' });
}

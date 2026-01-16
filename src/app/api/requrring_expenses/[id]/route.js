import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function PUT(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const {
    title,
    amount,
    frequency,
    next_run_date,
    status,
    category_id,
    notes,
  } = await req.json();

  await db.query(
    `UPDATE recurring_expenses SET
      title = ?, amount = ?, frequency = ?, next_run_date = ?,
      status = ?, category_id = ?, notes = ?
     WHERE id = ? AND user_id = ?`,
    [
      title,
      amount,
      frequency,
      next_run_date,
      status,
      category_id || null,
      notes,
      id,
      user.id,
    ]
  );

  return Response.json({ message: 'Recurring expense updated' });
}

export async function DELETE(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  await db.query(
    'DELETE FROM recurring_expenses WHERE id = ? AND user_id = ?',
    [id, user.id]
  );

  return Response.json({ message: 'Recurring expense deleted' });
}

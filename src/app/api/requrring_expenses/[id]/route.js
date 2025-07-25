import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await db.query(
    'SELECT * FROM recurring_expenses WHERE id = ? AND user_id = ?',
    [params.id, user.id]
  );

  return Response.json(rows[0] || {});
}

export async function PUT(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

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
  } = await req.json();

  await db.query(
    `UPDATE recurring_expenses SET 
      title = ?, amount = ?, payment_date = ?, frequency = ?, due_date = ?, 
      status = ?, is_recurring = ?, recurrence_id = ?, notes = ?
     WHERE id = ? AND user_id = ?`,
    [
      title,
      amount,
      payment_date,
      frequency,
      due_date || null,
      status,
      is_recurring,
      recurrence_id,
      notes,
      params.id,
      user.id,
    ]
  );

  return Response.json({ message: 'Recurring expense updated' });
}

export async function DELETE(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const recordId = params.id;

  // Check existence before deleting
  const [[record]] = await db.query(
    `SELECT id FROM recurring_expenses WHERE id = ? AND user_id = ?`,
    [recordId, user.id]
  );

  if (!record) {
    return Response.json({ error: 'Recurring expense not found' }, { status: 404 });
  }

  await db.query(
    `DELETE FROM recurring_expenses WHERE id = ? AND user_id = ?`,
    [recordId, user.id]
  );

  return Response.json({ message: 'Recurring expense deleted successfully' });
}

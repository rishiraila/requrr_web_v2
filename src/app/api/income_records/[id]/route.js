import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await db.query(
    'SELECT * FROM income_records WHERE id = ? AND user_id = ?',
    [params.id, user.id]
  );

  return Response.json(rows[0] || {});
}

export async function PUT(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const {
    client_id,
    service_id,
    amount,
    payment_date,
    due_date,
    status,
    is_recurring,
    recurrence_id,
    notes,
  } = await req.json();

  await db.query(
    `UPDATE income_records SET 
      client_id = ?, service_id = ?, amount = ?, payment_date = ?, due_date = ?, 
      status = ?, is_recurring = ?, recurrence_id = ?, notes = ? 
     WHERE id = ? AND user_id = ?`,
    [
      client_id,
      service_id,
      amount,
      payment_date,
      due_date || null,
      status,
      is_recurring,
      recurrence_id,
      notes,
      params.id,
      user.id,
    ]
  );

  return Response.json({ message: 'Income record updated' });
}

export async function DELETE(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await db.query('DELETE FROM income_records WHERE id = ? AND user_id = ?', [params.id, user.id]);
  return Response.json({ message: 'Income record deleted' });
}

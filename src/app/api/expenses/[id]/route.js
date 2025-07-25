import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function PUT(req, context) {
  const { params } = context;
  const { id } = params;

  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const {
    description,
    amount,
    category,
    account,
    date,
  } = await req.json();

  if (!description || !amount || !category || !date || !account) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Perform the update
  await db.query(
    `UPDATE expenses SET description = ?, amount = ?, category = ?, account = ?, date = ? WHERE id = ? AND user_id = ?`,
    [description, amount, category, account, date, id, user.id]
  );

  // Fetch and return the updated expense
  const [rows] = await db.query(
    `SELECT * FROM expenses WHERE id = ? AND user_id = ?`,
    [id, user.id]
  );

  if (rows.length === 0) {
    return Response.json({ error: 'Expense not found or not updated' }, { status: 404 });
  }

  return Response.json(rows[0]);
}

export async function DELETE(req, context) {
  const { params } = context;
  const { id } = params;

  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await db.query(
    `DELETE FROM expenses WHERE id = ? AND user_id = ?`,
    [id, user.id]
  );

  return Response.json({ message: 'Expense record deleted successfully' });
}

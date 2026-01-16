import { db } from '../../../../../db';
import { authenticate } from '../../../../../middleware/auth';

export async function PUT(req, { params }) {
  const user = authenticate(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  // ✅ Check expense ownership
  const [[expense]] = await db.query(
    'SELECT id, status FROM expenses WHERE id = ? AND user_id = ?',
    [id, user.id]
  );

  if (!expense) {
    return Response.json({ error: 'Expense not found' }, { status: 404 });
  }

  if (expense.status === 'paid') {
    return Response.json({ error: 'Expense already paid' }, { status: 400 });
  }

  // ✅ Mark as paid
  await db.query(
    `UPDATE expenses 
     SET status = 'paid', paid_at = NOW() 
     WHERE id = ? AND user_id = ?`,
    [id, user.id]
  );

  return Response.json({ message: 'Expense marked as paid' });
}

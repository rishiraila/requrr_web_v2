import { db } from '../../../../../db';
import { authenticate } from '../../../../../middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [[income]] = await db.query(
    'SELECT SUM(amount) AS total FROM income_records WHERE user_id = ?',
    [user.id]
  );

  const [[expense]] = await db.query(
    'SELECT SUM(amount) AS total FROM expenses WHERE user_id = ?',
    [user.id]
  );

  return Response.json({
    income: income.total || 0,
    expense: expense.total || 0,
    net: (income.total || 0) - (expense.total || 0),
  });
}

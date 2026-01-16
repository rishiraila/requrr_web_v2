import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await db.query(
    `SELECT *
     FROM expenses
     WHERE user_id = ?
     AND due_date >= CURDATE()
     AND status != 'paid'
     ORDER BY due_date ASC`,
    [user.id]
  );

  return Response.json(rows);
}

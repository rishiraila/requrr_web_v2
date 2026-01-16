import { db } from '../../../../../db';
import { authenticate } from '../../../../../middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await db.query(
    `
    SELECT
      DATE_FORMAT(expense_date, '%Y-%m') AS month,
      SUM(amount) AS total
    FROM expenses
    WHERE user_id = ?
    GROUP BY month
    ORDER BY month ASC
    `,
    [user.id]
  );

  return Response.json(rows);
}

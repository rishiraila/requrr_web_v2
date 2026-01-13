import { db } from '../../../db';
import { authenticate } from '../../../middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [rows] = await db.query(
    'SELECT id, name FROM expense_categories WHERE user_id = ? ORDER BY name',
    [user.id]
  );

  return Response.json(rows);
}
export async function POST(req) {
  const user = authenticate(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name) {
    return Response.json({ error: 'Category name required' }, { status: 400 });
  }

  await db.query(
    'INSERT INTO expense_categories (user_id, name) VALUES (?, ?)',
    [user.id, name]
  );

  return Response.json({ message: 'Category added successfully' });
}

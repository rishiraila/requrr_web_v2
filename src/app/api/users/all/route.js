import { db } from '@/db';
import { authenticate } from '@/middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [rows] = await db.query('SELECT id, username, email, created_at FROM users WHERE role = ?', ['user']);
    return Response.json({ users: rows });
  } catch (error) {
    console.error('Database error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

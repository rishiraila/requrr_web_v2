import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function DELETE(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await db.query('DELETE FROM users WHERE id = ?', [user.id]);
  return Response.json({ message: 'Account deleted successfully' });
}

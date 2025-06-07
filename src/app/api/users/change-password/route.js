import { db } from '../../../../db';
import bcrypt from 'bcryptjs';
import { authenticate } from '../../../../middleware/auth';

export async function PUT(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();

  const [rows] = await db.query('SELECT password_hash FROM users WHERE id = ?', [user.id]);
  const match = await bcrypt.compare(currentPassword, rows[0]?.password_hash);

  if (!match) {
    return Response.json({ error: 'Incorrect current password' }, { status: 400 });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, user.id]);

  return Response.json({ message: 'Password changed successfully' });
}

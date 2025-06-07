import { db } from '../../../../db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { email, newPassword } = await req.json();

  const [userRows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (userRows.length === 0) {
    return Response.json({ error: 'Email not registered' }, { status: 404 });
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await db.query('UPDATE users SET password_hash = ? WHERE email = ?', [hash, email]);

  return Response.json({ message: 'Password reset successful' });
}

import { db } from '../../../../db';
import bcrypt from 'bcrypt';

export async function POST(req) {
  const { username = '', email, password } = await req.json();
  const hash = await bcrypt.hash(password, 10);

  const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (existing.length) return Response.json({ error: 'User already exists' }, { status: 400 });

  await db.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username || null, email, hash]);
  return Response.json({ message: 'User created' });
}

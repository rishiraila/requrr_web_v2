import { db } from '../../../../db';
import bcrypt from 'bcrypt';

export async function POST(req) {
  const { username = '', email, password } = await req.json();
  const hash = await bcrypt.hash(password, 10);

  const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (existing.length) return Response.json({ error: 'User already exists' }, { status: 400 });

  // Create user
  const [result] = await db.query(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    [username || null, email, hash]
  );

  const userId = result.insertId;

  // Assign Free Plan
  const [[freePlan]] = await db.query(`SELECT id FROM plans WHERE name = 'Free' LIMIT 1`);
  const startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);

  await db.query(
    `INSERT INTO subscriptions (user_id, plan_id, start_date, end_date)
     VALUES (?, ?, ?, ?)`,
    [userId, freePlan.id, startDate, endDate]
  );

  return Response.json({ message: 'User created and subscribed to Free plan' });
}

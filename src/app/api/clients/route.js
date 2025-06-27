// import { db } from '@/lib/db';
import { db } from '../../../db'
import { authenticate } from '../../../middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [clients] = await db.query('SELECT * FROM clients WHERE user_id = ?', [user.id]);
  return Response.json(clients);
}

export async function POST(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, email, phone, address, notes, company_name } = await req.json();
  await db.query(
    'INSERT INTO clients (user_id, name, email, phone, address, notes, company_name) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [user.id, name, email, phone, address, notes, company_name]
  );
  return Response.json({ message: 'Client created' });
}

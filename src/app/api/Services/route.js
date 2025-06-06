import { db } from '../../../db';
import { authenticate } from '../../../middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [services] = await db.query('SELECT * FROM services WHERE user_id = ?', [user.id]);
  return Response.json(services);
}

export async function POST(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, description, billing_type, billing_interval, base_price, is_active } = await req.json();

  await db.query(
    `INSERT INTO services (user_id, name, description, billing_type, billing_interval, base_price, is_active) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [user.id, name, description, billing_type, billing_interval || null, base_price, is_active ?? 1]
  );

  return Response.json({ message: 'Service created successfully' });
}

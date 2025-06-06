import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await db.query('SELECT * FROM services WHERE id = ? AND user_id = ?', [params.id, user.id]);
  return Response.json(rows[0] || {});
}

export async function PUT(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, description, billing_type, billing_interval, base_price, is_active } = await req.json();

  await db.query(
    `UPDATE services SET name = ?, description = ?, billing_type = ?, billing_interval = ?, base_price = ?, is_active = ? 
     WHERE id = ? AND user_id = ?`,
    [name, description, billing_type, billing_interval || null, base_price, is_active ?? 1, params.id, user.id]
  );

  return Response.json({ message: 'Service updated successfully' });
}

export async function DELETE(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await db.query('DELETE FROM services WHERE id = ? AND user_id = ?', [params.id, user.id]);
  return Response.json({ message: 'Service deleted successfully' });
}

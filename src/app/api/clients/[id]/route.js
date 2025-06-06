// import { db } from '@/lib/db';
import {db} from '../../../../db'
import { authenticate } from '../../../../middleware/auth';

export async function GET(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await db.query('SELECT * FROM clients WHERE id = ? AND user_id = ?', [params.id, user.id]);
  return Response.json(rows[0] || {});
}

export async function PUT(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, email, phone, address, notes } = await req.json();
  await db.query(
    'UPDATE clients SET name = ?, email = ?, phone = ?, address = ?, notes = ? WHERE id = ? AND user_id = ?',
    [name, email, phone, address, notes, params.id, user.id]
  );
  return Response.json({ message: 'Client updated' });
}

export async function DELETE(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await db.query('DELETE FROM clients WHERE id = ? AND user_id = ?', [params.id, user.id]);
  return Response.json({ message: 'Client deleted' });
}

// src/app/api/plans/[id]/route.js
import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req, { params }) {
  const planId = params.id;

  const [[plan]] = await db.query('SELECT * FROM plans WHERE id = ?', [planId]);
  if (!plan) return Response.json({ error: 'Plan not found' }, { status: 404 });

  return Response.json(plan);
}

export async function PUT(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Optional: check for admin role here
  const planId = params.id;
  const { name, price, max_renewals, description } = await req.json();

  try {
    await db.query(
      `UPDATE plans SET name = ?, price = ?, max_renewals = ?, description = ? WHERE id = ?`,
      [name, price, max_renewals, description, planId]
    );
    return Response.json({ message: 'Plan updated successfully' });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Optional: check for admin role here
  const planId = params.id;

  try {
    await db.query(`DELETE FROM plans WHERE id = ?`, [planId]);
    return Response.json({ message: 'Plan deleted successfully' });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

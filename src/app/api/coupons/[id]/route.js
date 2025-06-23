// src/app/api/coupons/[id]/route.js
import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req, { params }) {
  const couponId = params.id;

  try {
    const [[coupon]] = await db.query('SELECT * FROM coupons WHERE id = ?', [couponId]);
    if (!coupon) {
      return Response.json({ error: 'Coupon not found' }, { status: 404 });
    }
    return Response.json(coupon);
  } catch (err) {
    console.error('GET /coupons/:id error:', err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const couponId = params.id;
  const { code, discount_percent, max_usage = null, expires_at = null } = await req.json();

  if (!code || discount_percent == null) {
    return Response.json({ error: 'Code and discount percent are required' }, { status: 400 });
  }

  try {
    await db.query(
      `UPDATE coupons 
       SET code = ?, discount_percent = ?, max_usage = ?, expires_at = ?
       WHERE id = ?`,
      [code, discount_percent, max_usage, expires_at, couponId]
    );
    return Response.json({ message: 'Coupon updated successfully' });
  } catch (err) {
    console.error('PUT /coupons/:id error:', err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
   const user = authenticate(req);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const couponId = params.id;

  try {
    await db.query('DELETE FROM coupons WHERE id = ?', [couponId]);
    return Response.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    console.error('DELETE /coupons/:id error:', err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

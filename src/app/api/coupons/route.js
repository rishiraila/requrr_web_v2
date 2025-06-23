// src/app/api/coupons/route.js
import { db } from '../../../db';
import { authenticate } from '../../../middleware/auth';

export async function GET() {
  try {
    const [coupons] = await db.query(
      'SELECT * FROM coupons ORDER BY id DESC' // safer than created_at if column missing
    );
    return Response.json(coupons);
  } catch (err) {
    console.error('GET /coupons error:', err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req) {
  const user = authenticate(req);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { code, discount_percent, max_usage = null, expires_at = null } = await req.json();

  if (!code || discount_percent == null) {
    return Response.json({ error: 'Code and discount percent are required' }, { status: 400 });
  }

  try {
    await db.query(
      `INSERT INTO coupons (code, discount_percent, max_usage, expires_at) 
       VALUES (?, ?, ?, ?)`,
      [code, discount_percent, max_usage, expires_at]
    );
    return Response.json({ message: 'Coupon created successfully' });
  } catch (err) {
    console.error('POST /coupons error:', err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

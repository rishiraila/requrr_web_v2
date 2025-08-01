// File: /app/api/debug/plans/route.js
import { db } from '../../../../db'; // adjust path if needed

export async function GET() {
  try {
    const [rows] = await db.query('SELECT id, name, razorpay_plan_id FROM plans');
    return Response.json({ plans: rows });
  } catch (error) {
    return Response.json({ error: 'DB error', details: error.message }, { status: 500 });
  }
}

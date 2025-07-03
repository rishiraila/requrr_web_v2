import crypto from 'crypto';
import { authenticate } from '../../../../middleware/auth';
import { db } from '../../../../db';

export async function POST(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan_id,
    coupon_code,
  } = await req.json();

  if (!plan_id) return Response.json({ error: 'Missing plan_id' }, { status: 400 });

  const signatureBase = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(signatureBase)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const [[plan]] = await db.query('SELECT * FROM plans WHERE id = ?', [plan_id]);
  if (!plan) return Response.json({ error: 'Invalid plan ID' }, { status: 400 });

  // const startDate = new Date();
  // const endDate = new Date();
  // endDate.setFullYear(endDate.getFullYear() + 1);

  const now = new Date();
  const startDate = now.toISOString().slice(0, 19).replace('T', ' ');
  const end = new Date(now);
  end.setFullYear(end.getFullYear() + 1);
  const endDate = end.toISOString().slice(0, 19).replace('T', ' ');


  try {
    await db.query(
      `INSERT INTO subscriptions (user_id, plan_id, start_date, end_date)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE plan_id = VALUES(plan_id), start_date = VALUES(start_date), end_date = VALUES(end_date)`,
      [user.id, plan.id, startDate, endDate]
    );
    if (coupon_code) {
      await db.query(
        `UPDATE coupons SET used_count = used_count + 1 WHERE code = ?`,
        [coupon_code]
      );
    }
    return Response.json({ message: 'Subscription activated', plan: plan.name });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'DB update failed' }, { status: 500 });
  }
}
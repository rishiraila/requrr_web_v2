// src/app/api/payment/create-order/route.js
import Razorpay from 'razorpay';
import { authenticate } from '../../../../middleware/auth';
import { db } from '../../../../db';

export async function POST(req) {
  try {
    const user = authenticate(req);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { planId, couponCode } = await req.json();
    if (!planId) return Response.json({ error: 'Missing planId' }, { status: 400 });

    // Fetch plan
    const [[plan]] = await db.query('SELECT * FROM plans WHERE id = ?', [planId]);
    if (!plan) return Response.json({ error: 'Invalid plan' }, { status: 400 });

    let finalAmount = plan.price;
    let discount = 0;

    if (couponCode) {
      const [coupons] = await db.query(
        `SELECT * FROM coupons WHERE code = ? AND (expires_at IS NULL OR expires_at > NOW())`,
        [couponCode]
      );

      const coupon = coupons[0];

      if (!coupon) {
        return Response.json({ error: 'Invalid or expired coupon' }, { status: 400 });
      }

      if (coupon.max_usage !== null && coupon.used_count >= coupon.max_usage) {
        return Response.json({ error: 'Coupon usage limit reached' }, { status: 400 });
      }

      discount = (plan.price * coupon.discount_percent) / 100;
      finalAmount = plan.price - discount;

      // Avoid 0 or negative payment (Razorpay doesn't allow)
      if (finalAmount < 1) finalAmount = 1;
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(finalAmount * 100), // paise
      currency: 'INR',
      receipt: `receipt_${user.id}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return Response.json({
      ...order,
      planId: plan.id,
      originalPrice: plan.price,
      discount,
      finalPrice: finalAmount,
      couponCode: couponCode || null
    });
  } catch (err) {
    console.error('[CREATE ORDER ERROR]', err);
    return Response.json({ error: 'Order creation failed' }, { status: 500 });
  }
}
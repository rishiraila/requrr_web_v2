/**
 * @swagger
 * /api/payment/create-order:
 *   post:
 *     summary: Create a Razorpay order for a plan purchase
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planId
 *             properties:
 *               planId:
 *                 type: integer
 *                 example: 2
 *               couponCode:
 *                 type: string
 *                 example: WELCOME10
 *               userCurrency:
 *                 type: string
 *                 example: USD
 *     responses:
 *       200:
 *         description: Razorpay order created and pricing info returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: order_JcWjTtqvYzvYpm
 *                 entity:
 *                   type: string
 *                   example: order
 *                 amount:
 *                   type: integer
 *                   example: 49900
 *                 currency:
 *                   type: string
 *                   example: INR
 *                 receipt:
 *                   type: string
 *                   example: receipt_12_1717710408000
 *                 status:
 *                   type: string
 *                   example: created
 *                 planId:
 *                   type: integer
 *                   example: 2
 *                 originalPrice:
 *                   type: number
 *                   example: 499
 *                 discount:
 *                   type: number
 *                   example: 50
 *                 finalPrice:
 *                   type: number
 *                   example: 449
 *                 localPrice:
 *                   type: number
 *                   example: 5.42
 *                 localCurrency:
 *                   type: string
 *                   example: USD
 *                 couponCode:
 *                   type: string
 *                   example: WELCOME10
 *       400:
 *         description: Invalid input (e.g., missing planId or invalid coupon)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Order creation failed
 */


import Razorpay from 'razorpay';
import { authenticate } from '../../../../middleware/auth';
import { db } from '../../../../db';

export async function POST(req) {
  try {
    const user = authenticate(req);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { planId, couponCode, userCurrency } = await req.json();
    if (!planId) return Response.json({ error: 'Missing planId' }, { status: 400 });

    // 1. Fetch the plan
    const [[plan]] = await db.query('SELECT * FROM plans WHERE id = ?', [planId]);
    if (!plan) return Response.json({ error: 'Invalid plan' }, { status: 400 });

    let finalAmount = plan.price; // Base price in INR
    let discount = 0;

    // 2. Apply coupon if provided
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

      // Razorpay does not allow zero or negative amounts
      if (finalAmount < 1) finalAmount = 1;
    }

    // 3. Create order in Razorpay (charge always in INR)
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100), // INR in paise
      currency: 'INR',
      receipt: `receipt_${user.id}_${Date.now()}`
    });

    // 4. Get local currency conversion (only for display)
    let localCurrency = userCurrency || 'INR';
    let localPrice = finalAmount;

    if (localCurrency !== 'INR') {
      try {
        const res = await fetch(`https://api.exchangerate.host/convert?from=INR&to=${localCurrency}`);
        const data = await res.json();
        if (data?.result) {
          localPrice = Math.round(finalAmount * data.result * 100) / 100;
        }
      } catch (error) {
        console.warn('[Currency Conversion Failed]', error);
        localCurrency = 'INR';
        localPrice = finalAmount;
      }
    }

    // 5. Send all pricing info back to frontend
    return Response.json({
      ...order,
      planId: plan.id,
      originalPrice: plan.price,   // INR
      discount,
      finalPrice: finalAmount,     // INR
      localPrice,                  // converted value
      localCurrency,               // e.g., USD, AUD
      couponCode: couponCode || null
    });

  } catch (err) {
    console.error('[CREATE ORDER ERROR]', err);
    return Response.json({ error: 'Order creation failed' }, { status: 500 });
  }
}
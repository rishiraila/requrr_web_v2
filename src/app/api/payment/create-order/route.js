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
import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const user = authenticate(req);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId, couponCode, userCurrency } = await req.json();

    if (!planId) {
      return Response.json({ error: 'Missing planId in request body' }, { status: 400 });
    }

    // Get plan details from DB
    const [results] = await db.query(
      'SELECT price, currency FROM plans WHERE id = ?',
      [planId]
    );

    if (!results.length) {
      return Response.json({ error: 'Plan not found' }, { status: 404 });
    }

    let amount = results[0].price; // price in INR (or your base currency)
    const currency = results[0].currency || 'INR';

    // Apply coupon discount (if any)
    let discount = 0;
    if (couponCode) {
      const [couponResults] = await db.query(
        'SELECT discount_percent FROM coupons WHERE code = ? AND is_active = 1',
        [couponCode]
      );
      if (couponResults.length) {
        discount = (amount * couponResults[0].discount_percent) / 100;
        amount -= discount;
      }
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // convert to paise
      currency,
      receipt: `receipt_${planId}_${Date.now()}`,
      payment_capture: 1,
    });

    return Response.json({
      ...order,
      planId,
      originalPrice: results[0].price,
      discount,
      finalPrice: amount,
      couponCode: couponCode || null,
      localPrice: userCurrency ? convertToLocal(amount, userCurrency) : null,
      localCurrency: userCurrency || currency,
    });
  } catch (err) {
    console.error('Order Creation Error:', err);
    return Response.json(
      { error: 'Order creation failed', details: err.message },
      { status: 500 }
    );
  }
}

// Dummy currency conversion function for example
function convertToLocal(amount, currency) {
  if (currency === 'USD') return (amount / 82).toFixed(2); // Example rate
  return amount;
}


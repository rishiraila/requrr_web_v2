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
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { planId } = await req.json();

    if (!planId) {
      return Response.json({ error: 'Missing planId in request body' }, { status: 400 });
    }

    // Get Razorpay Plan ID from DB
    const [results] = await db.query('SELECT razorpay_plan_id FROM plans WHERE id = ?', [planId]);

    if (!results.length) {
      return Response.json({ error: 'Plan not found' }, { status: 404 });
    }

    const razorpayPlanId = results[0].razorpay_plan_id;

    if (!razorpayPlanId) {
      return Response.json({ error: 'Razorpay plan ID not found in DB' }, { status: 500 });
    }

    // Create Subscription in Razorpay
    const subscription = await razorpay.subscriptions.create({
      plan_id: razorpayPlanId,
      customer_notify: 1,
      total_count: 12, // Can be dynamic
      quantity: 1,
    });

    return Response.json({
      subscription_id: subscription.id,
      status: subscription.status,
      short_url: subscription.short_url,
    });
  } catch (err) {
    console.error('Subscription Error:', err);
    return Response.json({ error: 'Subscription creation failed', details: err }, { status: 500 });
  }
}

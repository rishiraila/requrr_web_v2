/**
 * @swagger
 * /api/subscription/status:
 *   get:
 *     summary: Get current user's active subscription status
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription details or unsubscribed status
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     subscribed:
 *                       type: boolean
 *                       example: false
 *                 - type: object
 *                   properties:
 *                     subscribed:
 *                       type: boolean
 *                       example: true
 *                     plan_name:
 *                       type: string
 *                       example: Premium
 *                     price_inr:
 *                       type: number
 *                       example: 999
 *                     price_usd:
 *                       type: number
 *                       example: 12.99
 *                     final_price:
 *                       type: number
 *                       description: Final amount paid by the user
 *                       example: 9.99
 *                     currency:
 *                       type: string
 *                       description: Payment currency
 *                       example: "USD"
 *                     start_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-09T12:00:00"
 *                     end_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-09T12:00:00"
 *                     max_renewals:
 *                       type: integer
 *                       nullable: true
 *                       example: 10
 *       401:
 *         description: Unauthorized
 */



// src/app/api/subscription/status/route.js
import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [result] = await db.query(
    `SELECT 
       s.start_date, 
       s.end_date, 
       p.name AS plan_name, 
       p.price_inr, 
       p.price_usd, 
       s.currency,
       s.final_price,
       p.max_renewals
     FROM subscriptions s
     JOIN plans p ON s.plan_id = p.id
     WHERE s.user_id = ? AND s.end_date >= CURDATE()`,
    [user.id]
  );

  if (result.length === 0) {
    return Response.json({ subscribed: false });
  }

  const subscription = result[0];

  return Response.json({
    subscribed: true,
    plan_name: subscription.plan_name,
    price_inr: subscription.price_inr,
    price_usd: subscription.price_usd,
    final_price: subscription.final_price, // actual paid
    currency: subscription.currency,       // e.g., 'INR' or 'USD'
    start_date: subscription.start_date,
    end_date: subscription.end_date,
    max_renewals: subscription.max_renewals,
  });
}

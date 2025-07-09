/**
 * @swagger
 * /api/subscription/status:
 *   get:
 *     summary: Get current user's active subscription status
 *     description: Returns subscription info including plan name, price, and limits if active, otherwise `subscribed: false`.
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription status retrieved
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
 *                       example: Pro
 *                     price:
 *                       type: number
 *                       example: 499
 *                     start_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-08-01T00:00:00Z"
 *                     end_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-08-01T00:00:00Z"
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
       p.price, 
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
    price: subscription.price,
    start_date: subscription.start_date,
    end_date: subscription.end_date,
    max_renewals: subscription.max_renewals,
  });
}

/**
 * @swagger
 * /api/subscription/status/{userId}:
 *   get:
 *     summary: Check subscription status for a specific user
 *     description: Returns whether the user with the given `userId` has an active subscription and its end date.
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Subscription status found
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
 *                     end_date:
 *                       type: string
 *                       format: date
 *                       example: "2025-08-01"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */


// src/app/api/subscription/status/[userId]/route.js
import { db } from '../../../../../db';

import { authenticate } from '../../../../../middleware/auth'

export async function GET(_, { params }) {

  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { userId } = params;

  const [result] = await db.query(
    'SELECT end_date FROM subscriptions WHERE user_id = ? AND end_date >= CURDATE()',
    [userId]
  );

  if (result.length === 0) {
    return Response.json({ subscribed: false });
  }

  return Response.json({ subscribed: true, end_date: result[0].end_date });
}

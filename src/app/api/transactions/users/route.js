/**
 * @swagger
 * /api/transactions/users:
 *   get:
 *     summary: Get all user transactions and subscription details (Admin only)
 *     description: Returns all users (with role 'user') along with their subscription info, total payments, and all transaction history. Requires admin authentication.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all user transaction and subscription data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         example: john_doe
 *                       email:
 *                         type: string
 *                         example: john@example.com
 *                       plan:
 *                         type: string
 *                         example: Pro
 *                       plan_start:
 *                         type: string
 *                         format: date
 *                         example: "2024-07-01"
 *                       plan_end:
 *                         type: string
 *                         format: date
 *                         example: "2025-07-01"
 *                       total_paid:
 *                         type: number
 *                         format: float
 *                         example: 199.99
 *                       transactions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             plan_id:
 *                               type: integer
 *                             coupon_code:
 *                               type: string
 *                               nullable: true
 *                             original_price:
 *                               type: number
 *                             discount:
 *                               type: number
 *                             final_price:
 *                               type: number
 *                             razorpay_order_id:
 *                               type: string
 *                             razorpay_payment_id:
 *                               type: string
 *                             status:
 *                               type: string
 *                               example: success
 *                             message:
 *                               type: string
 *                             created_at:
 *                               type: string
 *                               format: date-time
 *       401:
 *         description: Unauthorized (if user is not admin)
 *       500:
 *         description: Internal server error
 */


import { db } from '@/db';
import { authenticate } from '@/middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all users with role 'user'
    const [users] = await db.query(`
      SELECT id, username, email FROM users WHERE role = 'user'
    `);

    const userTransactions = await Promise.all(users.map(async (u) => {
      // Get subscription and plan
      const [[subscription]] = await db.query(`
        SELECT s.start_date, s.end_date, p.name as plan_name 
        FROM subscriptions s 
        JOIN plans p ON p.id = s.plan_id 
        WHERE s.user_id = ?
      `, [u.id]);

      // Get total paid amount from transactions
      const [[{ total_paid }]] = await db.query(`
        SELECT IFNULL(SUM(final_price), 0) as total_paid 
        FROM transactions 
        WHERE user_id = ? AND status = 'success'
      `, [u.id]);

      // Get all transactions (success or failed)
      const [transactions] = await db.query(`
        SELECT 
          id, plan_id, coupon_code, original_price, discount, final_price,
          razorpay_order_id, razorpay_payment_id, status, message, created_at
        FROM transactions 
        WHERE user_id = ?
        ORDER BY created_at DESC
      `, [u.id]);

      return {
        username: u.username || 'N/A',
        email: u.email,
        plan: subscription?.plan_name || 'N/A',
        plan_start: subscription?.start_date || null,
        plan_end: subscription?.end_date || null,
        total_paid,
        transactions
      };
    }));

    return Response.json({ users: userTransactions });
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

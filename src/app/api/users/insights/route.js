/**
 * @swagger
 * /api/users/insights:
 *   get:
 *     summary: Get admin insights
 *     description: Retrieves insight data for all users including total clients, services, renewals, payments, and subscription details. Requires admin role.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved insights
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 insights:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: johndoe
 *                       email:
 *                         type: string
 *                         example: johndoe@example.com
 *                       role:
 *                         type: string
 *                         example: user
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       total_clients:
 *                         type: integer
 *                         example: 5
 *                       total_services:
 *                         type: integer
 *                         example: 3
 *                       total_renewals:
 *                         type: integer
 *                         example: 12
 *                       total_paid:
 *                         type: number
 *                         example: 2999.99
 *                       paid_transactions:
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
 *                             message:
 *                               type: string
 *                             created_at:
 *                               type: string
 *                               format: date-time
 *                       plan:
 *                         type: string
 *                         example: Pro
 *                       plan_start:
 *                         type: string
 *                         format: date-time
 *                       plan_end:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized access (only admin allowed)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal Server Error
 */


import { db } from '@/db';
import { authenticate } from '@/middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all users
    const [users] = await db.query(`
      SELECT id, username, email, role, created_at FROM users
    `);

    const insights = await Promise.all(users.map(async (u) => {
      const [[{ total_clients }]] = await db.query(`
        SELECT COUNT(*) as total_clients FROM clients WHERE user_id = ?
      `, [u.id]);

      const [[{ total_services }]] = await db.query(`
        SELECT COUNT(*) as total_services FROM services WHERE user_id = ?
      `, [u.id]);

      const [[{ total_renewals }]] = await db.query(`
        SELECT COUNT(*) as total_renewals FROM income_records WHERE user_id = ?
      `, [u.id]);

      // Updated: Get total paid from transactions
      const [[{ total_paid }]] = await db.query(`
        SELECT IFNULL(SUM(final_price), 0) as total_paid 
        FROM transactions 
        WHERE user_id = ? AND status = 'success'
      `, [u.id]);

      // Updated: Get all transactions
      const [paid_transactions] = await db.query(`
        SELECT id, plan_id, coupon_code, original_price, discount, final_price, razorpay_order_id, razorpay_payment_id, status, message, created_at
        FROM transactions 
        WHERE user_id = ?
        ORDER BY created_at DESC
      `, [u.id]);

      const [[subscription]] = await db.query(`
        SELECT s.start_date, s.end_date, p.name as plan_name 
        FROM subscriptions s 
        JOIN plans p ON p.id = s.plan_id 
        WHERE s.user_id = ?
      `, [u.id]);

      return {
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        created_at: u.created_at,
        total_clients,
        total_services,
        total_renewals,
        total_paid,
        paid_transactions,
        plan: subscription?.plan_name || 'N/A',
        plan_start: subscription?.start_date || null,
        plan_end: subscription?.end_date || null
      };
    }));

    return Response.json({ insights });
  } catch (error) {
    console.error('Error fetching admin insights:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

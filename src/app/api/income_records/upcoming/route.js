/**
 * @swagger
 * /api/income_records/upcoming:
 *   get:
 *     summary: Get upcoming income records with client and service info
 *     tags: [Income Records]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of upcoming income records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: integer, example: 12 }
 *                   user_id: { type: integer, example: 1 }
 *                   client_id: { type: integer, example: 2 }
 *                   service_id: { type: integer, example: 3 }
 *                   amount: { type: number, example: 1999.99 }
 *                   payment_date: { type: string, format: date, example: 2025-07-01 }
 *                   due_date: { type: string, format: date, example: 2025-07-15 }
 *                   status: { type: string, example: "pending" }
 *                   is_recurring: { type: boolean, example: false }
 *                   recurrence_id: { type: integer, nullable: true, example: null }
 *                   notes: { type: string, example: "Upcoming payment from client" }
 *                   client_name: { type: string, example: "John Doe" }
 *                   service_name: { type: string, example: "SEO Consultation" }
 *       401:
 *         description: Unauthorized
 */


import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  const [records] = await db.query(`
  SELECT 
    ir.*, 
    c.name AS client_name, 
    s.name AS service_name
  FROM income_records ir
  JOIN clients c ON ir.client_id = c.id
  JOIN services s ON ir.service_id = s.id
  WHERE ir.user_id = ? AND ir.due_date >= CURDATE()
  ORDER BY ir.due_date ASC
`, [user.id]);


  return Response.json(records);
}

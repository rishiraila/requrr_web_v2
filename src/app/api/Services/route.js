/**
 * @swagger
 * /api/Services:
 *   get:
 *     summary: Get all services for the authenticated user
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   billing_type:
 *                     type: string
 *                   billing_interval:
 *                     type: string
 *                     nullable: true
 *                   base_price:
 *                     type: number
 *                   is_active:
 *                     type: boolean
 *       401:
 *         description: Unauthorized
 * 
 *   post:
 *     summary: Create a new service for the authenticated user
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - billing_type
 *               - base_price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Website Hosting
 *               description:
 *                 type: string
 *                 example: Annual hosting and support
 *               billing_type:
 *                 type: string
 *                 example: recurring
 *               billing_interval:
 *                 type: string
 *                 nullable: true
 *                 example: monthly
 *               base_price:
 *                 type: number
 *                 example: 99.99
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Service created successfully
 *       401:
 *         description: Unauthorized
 */


import { db } from '../../../db';
import { authenticate } from '../../../middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [services] = await db.query('SELECT * FROM services WHERE user_id = ?', [user.id]);
  return Response.json(services);
}

export async function POST(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, description, billing_type, billing_interval, base_price, is_active } = await req.json();

  await db.query(
    `INSERT INTO services (user_id, name, description, billing_type, billing_interval, base_price, is_active) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [user.id, name, description, billing_type, billing_interval || null, base_price, is_active ?? 1]
  );

  return Response.json({ message: 'Service created successfully' });
}

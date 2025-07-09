/**
 * @swagger
 * /api/Services/{id}:
 *   get:
 *     summary: Get a specific service by ID
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Service ID
 *     responses:
 *       200:
 *         description: A single service object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 billing_type:
 *                   type: string
 *                 billing_interval:
 *                   type: string
 *                   nullable: true
 *                 base_price:
 *                   type: number
 *                 is_active:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service not found
 * 
 *   put:
 *     summary: Update a service by ID
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Service ID
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
 *                 example: SEO Optimization
 *               description:
 *                 type: string
 *               billing_type:
 *                 type: string
 *               billing_interval:
 *                 type: string
 *                 nullable: true
 *               base_price:
 *                 type: number
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       401:
 *         description: Unauthorized
 * 
 *   delete:
 *     summary: Delete a service by ID
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       401:
 *         description: Unauthorized
 */


import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await db.query('SELECT * FROM services WHERE id = ? AND user_id = ?', [params.id, user.id]);
  return Response.json(rows[0] || {});
}

export async function PUT(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, description, billing_type, billing_interval, base_price, is_active } = await req.json();

  await db.query(
    `UPDATE services SET name = ?, description = ?, billing_type = ?, billing_interval = ?, base_price = ?, is_active = ? 
     WHERE id = ? AND user_id = ?`,
    [name, description, billing_type, billing_interval || null, base_price, is_active ?? 1, params.id, user.id]
  );

  return Response.json({ message: 'Service updated successfully' });
}

export async function DELETE(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await db.query('DELETE FROM services WHERE id = ? AND user_id = ?', [params.id, user.id]);
  return Response.json({ message: 'Service deleted successfully' });
}

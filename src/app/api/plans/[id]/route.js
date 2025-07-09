/**
 * @swagger
 * /api/plans/{id}:
 *   get:
 *     summary: Get a plan by ID
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Plan ID
 *     responses:
 *       200:
 *         description: Plan found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Starter
 *                 price:
 *                   type: number
 *                   example: 199
 *                 max_renewals:
 *                   type: integer
 *                   nullable: true
 *                   example: 10
 *                 description:
 *                   type: string
 *                   example: Starter plan description
 *       404:
 *         description: Plan not found
 *   put:
 *     summary: Update a plan by ID
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Plan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Plan
 *               price:
 *                 type: number
 *                 example: 299
 *               max_renewals:
 *                 type: integer
 *                 nullable: true
 *                 example: 20
 *               description:
 *                 type: string
 *                 example: Updated plan description
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Database error
 *   delete:
 *     summary: Delete a plan by ID
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Plan ID
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Database error
 */


// src/app/api/plans/[id]/route.js
import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req, { params }) {
  const planId = params.id;

  const [[plan]] = await db.query('SELECT * FROM plans WHERE id = ?', [planId]);
  if (!plan) return Response.json({ error: 'Plan not found' }, { status: 404 });

  return Response.json(plan);
}

export async function PUT(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Optional: check for admin role here
  const planId = params.id;
  const { name, price, max_renewals, description } = await req.json();

  try {
    await db.query(
      `UPDATE plans SET name = ?, price = ?, max_renewals = ?, description = ? WHERE id = ?`,
      [name, price, max_renewals, description, planId]
    );
    return Response.json({ message: 'Plan updated successfully' });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Optional: check for admin role here
  const planId = params.id;

  try {
    await db.query(`DELETE FROM plans WHERE id = ?`, [planId]);
    return Response.json({ message: 'Plan deleted successfully' });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

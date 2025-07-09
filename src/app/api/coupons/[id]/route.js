/**
 * @swagger
 * /api/coupons/{id}:
 *   get:
 *     summary: Get a coupon by ID
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 code:
 *                   type: string
 *                 discount_percent:
 *                   type: number
 *                 max_usage:
 *                   type: integer
 *                   nullable: true
 *                 expires_at:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Database error

 *   put:
 *     summary: Update a coupon by ID
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discount_percent
 *             properties:
 *               code:
 *                 type: string
 *                 example: SUMMER10
 *               discount_percent:
 *                 type: number
 *                 example: 10
 *               max_usage:
 *                 type: integer
 *                 nullable: true
 *                 example: 50
 *               expires_at:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: 2025-12-31T23:59:59Z
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Database error

 *   delete:
 *     summary: Delete a coupon by ID
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Database error
 */

// src/app/api/coupons/[id]/route.js
import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req, { params }) {
  const couponId = params.id;

  try {
    const [[coupon]] = await db.query('SELECT * FROM coupons WHERE id = ?', [couponId]);
    if (!coupon) {
      return Response.json({ error: 'Coupon not found' }, { status: 404 });
    }
    return Response.json(coupon);
  } catch (err) {
    console.error('GET /coupons/:id error:', err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const couponId = params.id;
  const { code, discount_percent, max_usage = null, expires_at = null } = await req.json();

  if (!code || discount_percent == null) {
    return Response.json({ error: 'Code and discount percent are required' }, { status: 400 });
  }

  try {
    await db.query(
      `UPDATE coupons 
       SET code = ?, discount_percent = ?, max_usage = ?, expires_at = ?
       WHERE id = ?`,
      [code, discount_percent, max_usage, expires_at, couponId]
    );
    return Response.json({ message: 'Coupon updated successfully' });
  } catch (err) {
    console.error('PUT /coupons/:id error:', err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
   const user = authenticate(req);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const couponId = params.id;

  try {
    await db.query('DELETE FROM coupons WHERE id = ?', [couponId]);
    return Response.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    console.error('DELETE /coupons/:id error:', err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

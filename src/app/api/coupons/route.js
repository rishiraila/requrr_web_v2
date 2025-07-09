/**
 * @swagger
 * /api/coupons:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupons]
 *     responses:
 *       200:
 *         description: List of all coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   code:
 *                     type: string
 *                   discount_percent:
 *                     type: number
 *                   max_usage:
 *                     type: integer
 *                     nullable: true
 *                   expires_at:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *       500:
 *         description: Database error

 *   post:
 *     summary: Create a new coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
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
 *                 example: SAVE20
 *               discount_percent:
 *                 type: number
 *                 example: 20
 *               max_usage:
 *                 type: integer
 *                 nullable: true
 *                 example: 100
 *               expires_at:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: 2025-12-31T23:59:59Z
 *     responses:
 *       200:
 *         description: Coupon created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Coupon created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Database error
 */


// src/app/api/coupons/route.js
import { db } from '../../../db';
import { authenticate } from '../../../middleware/auth';

export async function GET() {
  try {
    const [coupons] = await db.query(
      'SELECT * FROM coupons ORDER BY id DESC' // safer than created_at if column missing
    );
    return Response.json(coupons);
  } catch (err) {
    console.error('GET /coupons error:', err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req) {
  const user = authenticate(req);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { code, discount_percent, max_usage = null, expires_at = null } = await req.json();

  if (!code || discount_percent == null) {
    return Response.json({ error: 'Code and discount percent are required' }, { status: 400 });
  }

  try {
    await db.query(
      `INSERT INTO coupons (code, discount_percent, max_usage, expires_at) 
       VALUES (?, ?, ?, ?)`,
      [code, discount_percent, max_usage, expires_at]
    );
    return Response.json({ message: 'Coupon created successfully' });
  } catch (err) {
    console.error('POST /coupons error:', err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

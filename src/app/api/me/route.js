/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *                 first_name:
 *                   type: string
 *                   example: John
 *                 last_name:
 *                   type: string
 *                   example: Doe
 *                 country_code:
 *                   type: string
 *                   example: AU
 *                 phone_code:
 *                   type: string
 *                   example: +61
 *                 phone:
 *                   type: string
 *                   example: "412345678"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */


// /api/me/route.js
import { authenticate } from '../../../middleware/auth';
import { db } from '../../../db';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await db.query(
    'SELECT username, email, first_name, last_name, country_code, phone_code, phone FROM users WHERE id = ?',
    [user.id]
  );

  return Response.json(rows[0]);
}

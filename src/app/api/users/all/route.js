/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Get all user accounts
 *     description: Returns a list of all users with role 'user'. Requires authentication.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of users
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
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: johndoe
 *                       email:
 *                         type: string
 *                         example: johndoe@example.com
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-06-01T12:34:56.000Z
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal Server Error
 */

import { db } from '@/db';
import { authenticate } from '@/middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [rows] = await db.query('SELECT id, username, email, created_at FROM users WHERE role = ?', ['user']);
    return Response.json({ users: rows });
  } catch (error) {
    console.error('Database error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

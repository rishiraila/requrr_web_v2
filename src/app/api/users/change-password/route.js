/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Change user password
 *     description: Allows an authenticated user to change their password.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 example: newSecurePassword!456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Incorrect current password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Incorrect current password
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */


import { db } from '../../../../db';
import bcrypt from 'bcryptjs';
import { authenticate } from '../../../../middleware/auth';

export async function PUT(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();

  const [rows] = await db.query('SELECT password_hash FROM users WHERE id = ?', [user.id]);
  const match = await bcrypt.compare(currentPassword, rows[0]?.password_hash);

  if (!match) {
    return Response.json({ error: 'Incorrect current password' }, { status: 400 });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, user.id]);

  return Response.json({ message: 'Password changed successfully' });
}

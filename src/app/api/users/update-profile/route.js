/**
 * @swagger
 * /api/users/update-profile:
 *   put:
 *     summary: Update user profile
 *     description: Updates the authenticated user's profile information including name, email, and contact details.
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
 *               - username
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               country_code:
 *                 type: string
 *                 example: IN
 *               phone_code:
 *                 type: string
 *                 example: +91
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account updated successfully
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Server error
 */


import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function PUT(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const {
    username,
    email,
    first_name,
    last_name,
    country_code,
    phone_code,
    phone
  } = await req.json();

  await db.query(
    `UPDATE users
     SET username = ?, email = ?, first_name = ?, last_name = ?, country_code = ?, phone_code = ?, phone = ?
     WHERE id = ?`,
    [username, email, first_name, last_name, country_code, phone_code, phone, user.id]
  );

  return Response.json({ message: 'Account updated successfully' });
}
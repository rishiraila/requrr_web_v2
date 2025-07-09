/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Auth success
 *       401:
 *         description: Invalid credentials
 */


// import { db } from '@/lib/db';
import { db } from '../../../../db';
import bcrypt from 'bcrypt';
import { generateToken } from '@/lib/auth';

export async function POST(req) {
  const { email, password } = await req.json();

  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = users[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = generateToken(user);
  return Response.json({ token });
}

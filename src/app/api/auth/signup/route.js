/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Creates a new user and assigns a free subscription plan.
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
 *               username:
 *                 type: string
 *                 example: johndoe123
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
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
 *         description: User created and subscribed to Free plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created and subscribed to Free plan
 *       400:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User already exists
 */

import { db } from '../../../../db';
import bcrypt from 'bcrypt';

export async function POST(req) {
  const {
    username = '',
    email,
    password,
    first_name = '',
    last_name = '',
    country_code = '',
    phone_code = '',
    phone = ''
  } = await req.json();

  const hash = await bcrypt.hash(password, 10);

  const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (existing.length) {
    return Response.json({ error: 'User already exists' }, { status: 400 });
  }

  // Create user
  const [result] = await db.query(
    `INSERT INTO users (username, email, password_hash, first_name, last_name, country_code, phone_code, phone)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [username || null, email, hash, first_name, last_name, country_code, phone_code, phone]
  );

  const userId = result.insertId;

  // Assign Free Plan
  const [[freePlan]] = await db.query(`SELECT id FROM plans WHERE name = 'Free' LIMIT 1`);
  const startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);

  await db.query(
    `INSERT INTO subscriptions (user_id, plan_id, start_date, end_date)
     VALUES (?, ?, ?, ?)`,
    [userId, freePlan.id, startDate, endDate]
  );

  return Response.json({ message: 'User created and subscribed to Free plan' });
}

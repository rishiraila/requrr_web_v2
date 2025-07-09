/**
 * @swagger
 * /api/users/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Generates a temporary password and sends it to the user's email.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Temporary password sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Temporary password sent to your email
 *       404:
 *         description: Email not registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email not registered
 *       500:
 *         description: Failed to send email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to send email. Please try again.
 */


import { db } from '../../../../db';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export async function POST(req) {
  const { email } = await req.json();

  const [userRows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (userRows.length === 0) {
    return Response.json({ error: 'Email not registered' }, { status: 404 });
  }

  // 1. Generate temporary password
  const tempPassword = Math.random().toString(36).slice(-8); // 8-char random string
  const hash = await bcrypt.hash(tempPassword, 10);

  // 2. Update DB with temp password
  await db.query('UPDATE users SET password_hash = ? WHERE email = ?', [hash, email]);

  // 3. Send Email with Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "devshreyas21@gmail.com",
      pass: "ueluvpytkbirtebf",
    },
  });

  const mailOptions = {
    from: `"ReQurr Support" <devshreyas21@gmail.com>`,
    to: email,
    subject: 'Your Temporary Password - ReQurr',
    html: `
      <h3>Hello,</h3>
      <p>You have requested a password reset. Use the following temporary password to log in:</p>
      <p><strong>${tempPassword}</strong></p>
      <p>Once logged in, you can change your password from your profile settings.</p>
      <br />
      <p>Regards,<br/>ReQurr Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return Response.json({ message: 'Temporary password sent to your email' });
  } catch (err) {
    console.error('Email error:', err);
    return Response.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
  }
}

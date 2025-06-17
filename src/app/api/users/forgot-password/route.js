// import { db } from '../../../../db';
// import bcrypt from 'bcryptjs';

// export async function POST(req) {
//   const { email, newPassword } = await req.json();

//   const [userRows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
//   if (userRows.length === 0) {
//     return Response.json({ error: 'Email not registered' }, { status: 404 });
//   }

//   const hash = await bcrypt.hash(newPassword, 10);
//   await db.query('UPDATE users SET password_hash = ? WHERE email = ?', [hash, email]);

//   return Response.json({ message: 'Password reset successful' });
// }


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

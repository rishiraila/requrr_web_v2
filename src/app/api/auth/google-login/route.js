import { db } from '../../../../db';
import { generateToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const user = users[0];

    if (!user) {
      return Response.json(
        { message: 'Email not found' },
        { status: 401 }
      );
    }

    // Generate token (same as email+password login)
    const token = generateToken(user);

    return Response.json({ token });

  } catch (error) {
    console.error(error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

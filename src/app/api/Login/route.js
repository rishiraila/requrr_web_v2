import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '../../../db';

// Enable CORS for preflight requests (OPTIONS)
export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// POST request to handle login
export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Query the database to find the user by username and password
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    // Check if user exists
    if (rows.length === 0) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const user = rows[0];

    // Generate JWT token including user_id (actual value from database)
    const token = jwt.sign(
      { id: user.sr, username: user.username, user_id: user.sr }, // Use actual user ID as integer
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send success response with token and user details, including user_id as integer
    return NextResponse.json({
      message: 'Login successful',
      token: `Bearer ${token}`,
      user: {
        id: user.sr,
        name: user.name,
        email: user.email,
        phone: user.phone,
        user_id: user.sr,  // Return actual user_id as integer
      }
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
  }
}

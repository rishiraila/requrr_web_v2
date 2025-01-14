import { NextResponse } from 'next/server';
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

// POST request for user signup (without password hashing)
export async function POST(request) {
  try {
    const { username, email, password, name, phone } = await request.json();

    // Check if the username already exists in the database
    const [existingUser] = await db.execute('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);

    if (existingUser.length > 0) {
      return NextResponse.json({ message: 'Username or email already exists' }, { status: 409 });
    }

    // Insert the new user into the database without hashing the password
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password, name, phone) VALUES (?, ?, ?, ?, ?)',
      [username, email, password, name, phone]
    );

    // Return success response
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
  }
}

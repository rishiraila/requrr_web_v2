import { NextResponse } from 'next/server';
import { db } from '../../../db';
import jwt from 'jsonwebtoken';

// Enable CORS for preflight requests (OPTIONS)
export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

// PUT API for updating user details
export async function PUT(request) {
  try {
    // 1. Get authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Authorization token is missing or invalid' }, { status: 401 });
    }

    // 2. Verify the token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.user_id;

    // 3. Parse request body
    const { username, email, name, phone } = await request.json();

    // 4. Validate required fields
    if (!username || !email || !name || !phone) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // 5. Update user in the database
    const [result] = await db.execute(
      'UPDATE users SET username = ?, email = ?, name = ?, phone = ? WHERE sr = ?',
      [username, email, name, phone, user_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'User not found or no changes made' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
  }
}



// GET API for fetching user details
export async function GET(request) {
  try {
    // 1. Get authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Authorization token is missing or invalid' }, { status: 401 });
    }

    // 2. Verify the token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.user_id;

    // 3. Fetch user details from the database
    const [rows] = await db.execute(
      'SELECT username, email, name, phone FROM users WHERE sr = ?',
      [user_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'User  not found' }, { status: 404 });
    }

    // 4. Return user details
    return NextResponse.json(rows[0], { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
  }
}
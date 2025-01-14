import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '../../../db';

// Enable CORS for preflight requests (OPTIONS)
export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET request to fetch entities with user details (username) from the database with Bearer token
export async function GET(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    // Check if Authorization header is present
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Authorization token is missing or invalid' }, { status: 401 });
    }

    // Extract token from Authorization header
    const token = authHeader.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Query the database to fetch entities with the username by joining 'users' and 'entities'
    const [rows] = await db.execute(
      `SELECT entities.*, users.username, users.sr AS user_id
       FROM entities
       JOIN users ON entities.user_id = users.sr
       WHERE users.sr = ?`,
      [decoded.user_id]
    );

    // Check if there are entities
    if (rows.length === 0) {
      return NextResponse.json({ message: 'No entities found' }, { status: 404 });
    }

    // Send success response with fetched entities and user details
    return NextResponse.json({
      message: 'Entities fetched successfully',
      data: rows,
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

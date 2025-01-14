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

// GET request to fetch payees with user details, entity and service details from the database using Bearer token
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

    // Query the database to fetch payees, user details, entity details, and service details
    const [rows] = await db.execute(
      `SELECT payees.*, users.username, users.sr AS user_id,
              entities.id AS entity_id, entities.entity_name,
              services.id AS service_id, services.service_name
       FROM payees
       JOIN users ON payees.user_id = users.sr
       LEFT JOIN entities ON payees.entity_id = entities.id
       LEFT JOIN services ON payees.service_id = services.id
       WHERE users.sr = ?`,
      [decoded.user_id]
    );

    // Check if there are payees
    if (rows.length === 0) {
      return NextResponse.json({ message: 'No payees found' }, { status: 404 });
    }

    // Send success response with fetched payees, user details, entity details, and service details
    return NextResponse.json({
      message: 'Payees fetched successfully',
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

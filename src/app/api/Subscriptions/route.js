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

// GET request to fetch subscriptions with user, entity, service, payee details, and service duration from the database using Bearer token
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

    // Query the database to fetch subscriptions, user details, entity details, service details, and payee info
    const [rows] = await db.execute(
      `SELECT subscriptions.*, users.username, users.sr AS user_id,
              entities.id AS entity_id, entities.entity_name,
              services.id AS service_id, services.service_name, services.min_duration AS service_duration,
              payees.payee_name, payees.email AS payee_email, payees.phone AS payee_phone
       FROM subscriptions
       JOIN users ON subscriptions.user_id = users.sr
       LEFT JOIN entities ON subscriptions.entity_id = entities.id
       LEFT JOIN services ON subscriptions.service_id = services.id
       LEFT JOIN payees ON subscriptions.payee_id = payees.id
       WHERE users.sr = ?`,
      [decoded.user_id]
    );

    // Check if there are subscriptions
    if (rows.length === 0) {
      return NextResponse.json({ message: 'No subscriptions found' }, { status: 404 });
    }

    // Send success response with fetched subscriptions, user details, entity details, service details, and payee info
    return NextResponse.json({
      message: 'Subscriptions fetched successfully',
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

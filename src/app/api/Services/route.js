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

// GET request to fetch services with user details (username) and entity details from the database with Bearer token
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

    // Query the database to fetch services with the username and entity details by joining 'users', 'services', and 'entities'
    const [rows] = await db.execute(
      `SELECT services.*, users.username, users.sr AS user_id, entities.id AS entity_id, entities.entity_name AS entity_name
       FROM services
       JOIN users ON services.user_id = users.sr
       LEFT JOIN entities ON services.entity_id = entities.id
       WHERE users.sr = ?`,
      [decoded.user_id]
    );

    // Check if there are services
    if (rows.length === 0) {
      return NextResponse.json({ message: 'No services found' }, { status: 404 });
    }

    // Send success response with fetched services, user details, and entity details
    return NextResponse.json({
      message: 'Services fetched successfully',
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


// POST request to create a new service with entity name resolution
export async function POST(request) {
  try {
    const authHeader = request.headers.get('Authorization');

    // Check if Authorization header is present
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Authorization token is missing or invalid' }, { status: 401 });
    }

    // Extract token and verify
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Parse the request body
    const body = await request.json();
    const {
      service_name,
      service_desc,
      entity_name, // User provides entity_name instead of entity_id
      min_duration,
      amount,
      category,
    } = body;

    // Validate required fields
    if (!service_name || !service_desc || !min_duration || !amount || !category || !entity_name) {
      return NextResponse.json(
        { message: 'Missing required fields: service_name, service_desc, min_duration, amount, category, and entity_name are mandatory.' },
        { status: 400 }
      );
    }

    // Validate category
    if (!['income', 'expense'].includes(category.toLowerCase())) {
      return NextResponse.json(
        { message: 'Invalid category. Allowed values are "income" or "expense".' },
        { status: 400 }
      );
    }

    // Fetch the entity_id based on entity_name
    const [entityRows] = await db.execute(
      `SELECT id FROM entities WHERE entity_name = ? LIMIT 1`,
      [entity_name]
    );

    if (entityRows.length === 0) {
      return NextResponse.json(
        { message: `Entity with name "${entity_name}" not found` },
        { status: 404 }
      );
    }

    const entity_id = entityRows[0].id;

    // Insert the new service into the database
    const [result] = await db.execute(
      `INSERT INTO services (user_id, entity_id, service_name, service_desc, min_duration, amount, category)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [decoded.user_id, entity_id, service_name, service_desc, min_duration, amount, category.toLowerCase()]
    );

    // Return success response
    return NextResponse.json(
      {
        message: 'Service created successfully',
        data: {
          id: result.insertId,
          user_id: decoded.user_id,
          entity_id,
          entity_name,
          service_name,
          service_desc,
          min_duration,
          amount,
          category: category.toLowerCase(),
        },
      },
      {
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    );

  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong', error: error.message },
      { status: 500 }
    );
  }
}


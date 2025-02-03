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


// POST request to create a new entity
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
      entity_name,
      entity_desc,
      entity_short_desc,
      category,
    } = body;

    // Validate required fields
    if (!entity_name || !entity_desc || !entity_short_desc || !category) {
      return NextResponse.json(
        { message: 'Missing required fields: entity_name, entity_desc, entity_short_desc, and category are mandatory.' },
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

    // Insert the new entity into the database
    const [result] = await db.execute(
      `INSERT INTO entities (user_id, entity_name, entity_desc, entity_short_desc, category)
       VALUES (?, ?, ?, ?, ?)`,
      [decoded.user_id, entity_name, entity_desc, entity_short_desc, category.toLowerCase()]
    );

    // Return success response
    return NextResponse.json(
      {
        message: 'Entity created successfully',
        data: {
          id: result.insertId,
          user_id: decoded.user_id,
          entity_name,
          entity_desc,
          entity_short_desc,
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
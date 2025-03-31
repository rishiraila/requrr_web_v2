import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '../../../db';

// Enable CORS for preflight requests (OPTIONS)
export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Helper function to authenticate user
async function authenticate(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization token is missing or invalid');
  }
  const token = authHeader.split(' ')[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}

// GET: Fetch entities with user details
export async function GET(request) {
  try {
    const decoded = await authenticate(request);
    const [rows] = await db.execute(
      `SELECT entities.*, users.username, users.sr AS user_id
       FROM entities
       JOIN users ON entities.user_id = users.sr
       WHERE users.sr = ?`,
      [decoded.user_id]
    );
    return NextResponse.json({ message: 'Entities fetched successfully', data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

// POST: Create a new entity
export async function POST(request) {
  try {
    const decoded = await authenticate(request);
    const body = await request.json();
    const { entity_name, entity_desc, entity_short_desc, category } = body;

    if (!entity_name || !entity_desc || !entity_short_desc || !category) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }
    if (!['income', 'expense'].includes(category.toLowerCase())) {
      return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
    }

    const [result] = await db.execute(
      `INSERT INTO entities (user_id, entity_name, entity_desc, entity_short_desc, category)
       VALUES (?, ?, ?, ?, ?)`,
      [decoded.user_id, entity_name, entity_desc, entity_short_desc, category.toLowerCase()]
    );

    return NextResponse.json({ message: 'Entity created', id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT: Update an entity
export async function PUT(request) {
  try {
    const decoded = await authenticate(request);
    const body = await request.json();
    const { id, entity_name, entity_desc, entity_short_desc, category } = body;

    if (!id || !entity_name || !entity_desc || !entity_short_desc || !category) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }
    
    const [result] = await db.execute(
      `UPDATE entities SET entity_name = ?, entity_desc = ?, entity_short_desc = ?, category = ?
       WHERE id = ? AND user_id = ?`,
      [entity_name, entity_desc, entity_short_desc, category.toLowerCase(), id, decoded.user_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Entity not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Entity updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE: Remove an entity
export async function DELETE(request) {
  try {
    const decoded = await authenticate(request);
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Entity ID is required' }, { status: 400 });
    }
    
    const [result] = await db.execute(`DELETE FROM entities WHERE id = ? AND user_id = ?`, [id, decoded.user_id]);
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Entity not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Entity deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

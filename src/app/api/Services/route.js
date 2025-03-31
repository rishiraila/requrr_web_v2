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

// Helper function for authentication
async function authenticate(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization token is missing or invalid');
  }
  const token = authHeader.split(' ')[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}

// GET request to fetch services
export async function GET(request) {
  try {
    const decoded = await authenticate(request);
    const [rows] = await db.execute(
      `SELECT services.*, users.username, users.sr AS user_id, entities.id AS entity_id, entities.entity_name AS entity_name
       FROM services
       JOIN users ON services.user_id = users.sr
       LEFT JOIN entities ON services.entity_id = entities.id
       WHERE users.sr = ?`,
      [decoded.user_id]
    );
    return NextResponse.json({
      message: 'Services fetched successfully',
      data: rows,
    }, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

// POST request to create a new service
export async function POST(request) {
  try {
    const decoded = await authenticate(request);
    const body = await request.json();
    const { service_name, service_desc, entity_name, min_duration, amount, category } = body;
    if (!service_name || !service_desc || !min_duration || !amount || !category || !entity_name) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    if (!['income', 'expense'].includes(category.toLowerCase())) {
      return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
    }
    const [entityRows] = await db.execute(
      `SELECT id FROM entities WHERE entity_name = ? LIMIT 1`,
      [entity_name]
    );
    if (entityRows.length === 0) {
      return NextResponse.json({ message: 'Entity not found' }, { status: 404 });
    }
    const entity_id = entityRows[0].id;
    const [result] = await db.execute(
      `INSERT INTO services (user_id, entity_id, service_name, service_desc, min_duration, amount, category)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [decoded.user_id, entity_id, service_name, service_desc, min_duration, amount, category.toLowerCase()]
    );
    return NextResponse.json({
      message: 'Service created successfully',
      data: { id: result.insertId, ...body, entity_id },
    }, {
      status: 201,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT request to update a service
export async function PUT(request) {
  try {
    const decoded = await authenticate(request);
    const body = await request.json();
    const { id, service_name, service_desc, min_duration, amount, category } = body;
    if (!id || !service_name || !service_desc || !min_duration || !amount || !category) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    await db.execute(
      `UPDATE services SET service_name = ?, service_desc = ?, min_duration = ?, amount = ?, category = ? WHERE id = ? AND user_id = ?`,
      [service_name, service_desc, min_duration, amount, category.toLowerCase(), id, decoded.user_id]
    );
    return NextResponse.json({ message: 'Service updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE request to delete a service
export async function DELETE(request) {
  try {
    const decoded = await authenticate(request);
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ message: 'Missing service ID' }, { status: 400 });
    }
    await db.execute(
      `DELETE FROM services WHERE id = ? AND user_id = ?`,
      [id, decoded.user_id]
    );
    return NextResponse.json({ message: 'Service deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

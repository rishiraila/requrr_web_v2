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

// Helper function to extract and verify token
async function getUserIdFromToken(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization token is missing or invalid');
  }
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.user_id;
}

// GET: Fetch subscriptions
export async function GET(request) {
  try {
    const user_id = await getUserIdFromToken(request);
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
      [user_id]
    );
    return NextResponse.json({ message: 'Subscriptions fetched successfully', data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST: Create subscription
export async function POST(request) {
  try {
    const user_id = await getUserIdFromToken(request);
    const body = await request.json();
    const { entity_name, service_name, payee_name, startDate, endDate, amount, paymentDate, category } = body;

    if (!entity_name || !service_name || !payee_name || !startDate || !endDate || !amount || !paymentDate || !category) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const [[entity]] = await db.execute('SELECT id FROM entities WHERE entity_name = ?', [entity_name]);
    const [[service]] = await db.execute('SELECT id FROM services WHERE service_name = ?', [service_name]);
    const [[payee]] = await db.execute('SELECT id FROM payees WHERE payee_name = ?', [payee_name]);

    if (!entity || !service || !payee) {
      return NextResponse.json({ message: 'Invalid entity, service, or payee name' }, { status: 404 });
    }

    await db.execute(
      'INSERT INTO subscriptions (user_id, entity_id, service_id, payee_id, startDate, endDate, amount, paymentDate, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, entity.id, service.id, payee.id, startDate, endDate, amount, paymentDate, category]
    );

    return NextResponse.json({ message: 'Subscription created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT: Update subscription
export async function PUT(request) {
  try {
    const user_id = await getUserIdFromToken(request);
    const body = await request.json();
    const { id, entity_name, service_name, payee_name, startDate, endDate, amount, paymentDate, category } = body;

    if (!id || !entity_name || !service_name || !payee_name || !startDate || !endDate || !amount || !paymentDate || !category) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const [[entity]] = await db.execute('SELECT id FROM entities WHERE entity_name = ?', [entity_name]);
    const [[service]] = await db.execute('SELECT id FROM services WHERE service_name = ?', [service_name]);
    const [[payee]] = await db.execute('SELECT id FROM payees WHERE payee_name = ?', [payee_name]);

    if (!entity || !service || !payee) {
      return NextResponse.json({ message: 'Invalid entity, service, or payee name' }, { status: 404 });
    }

    const [updateResult] = await db.execute(
      'UPDATE subscriptions SET entity_id = ?, service_id = ?, payee_id = ?, startDate = ?, endDate = ?, amount = ?, paymentDate = ?, category = ? WHERE id = ? AND user_id = ?',
      [entity.id, service.id, payee.id, startDate, endDate, amount, paymentDate, category, id, user_id]
    );

    if (updateResult.affectedRows === 0) {
      return NextResponse.json({ message: 'Subscription not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Subscription updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE: Remove subscription
export async function DELETE(request) {
  try {
    const user_id = await getUserIdFromToken(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Subscription ID is required' }, { status: 400 });
    }

    const [deleteResult] = await db.execute('DELETE FROM subscriptions WHERE id = ? AND user_id = ?', [id, user_id]);

    if (deleteResult.affectedRows === 0) {
      return NextResponse.json({ message: 'Subscription not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Subscription deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

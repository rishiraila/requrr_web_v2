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

// Utility function to validate JWT and extract user ID
async function getUserIdFromToken(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization token is missing or invalid');
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.user_id;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// 📌 **READ**: Fetch payees with user, entity, and service details
export async function GET(request) {
  try {
    const user_id = await getUserIdFromToken(request);
    const [rows] = await db.execute(
      `SELECT payees.*, users.username, entities.entity_name, services.service_name
       FROM payees
       JOIN users ON payees.user_id = users.sr
       LEFT JOIN entities ON payees.entity_id = entities.id
       LEFT JOIN services ON payees.service_id = services.id
       WHERE payees.user_id = ?`,
      [user_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'No payees found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Payees fetched successfully', data: rows }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

// 📌 **CREATE**: Insert new payee
// 📌 **CREATE**: Insert new payee
export async function POST(request) {
  try {
    const user_id = await  getUserIdFromToken(request);
    const body = await request.json();
    const { 
      entity_name, 
      service_name, 
      payee_name, 
      phone, 
      email, 
      amount, 
      category, 
      startDate, 
      endDate, 
      paidAmount, 
      paymentDate 
    } = body;

    if (!entity_name || !service_name || !payee_name || !phone || !email || !amount || !category || !startDate || !endDate || !paidAmount || !paymentDate) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Fetch entity and service IDs
    const [[entity]] = await db.execute('SELECT id FROM entities WHERE entity_name = ? LIMIT 1', [entity_name]);
    const [[service]] = await db.execute('SELECT id FROM services WHERE service_name = ? LIMIT 1', [service_name]);

    if (!entity) return NextResponse.json({ message: 'Entity not found' }, { status: 404 });
    if (!service) return NextResponse.json({ message: 'Service not found' }, { status: 404 });

    // Insert new payee
    await db.execute(
      'INSERT INTO payees (user_id, entity_id, service_id, payee_name, phone, email, amount, category, startDate, endDate, paidAmount, paymentDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, entity.id, service.id, payee_name, phone, email, amount, category, startDate, endDate, paidAmount, paymentDate]
    );

    return NextResponse.json({ message: 'Payee created successfully' }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 📌 **UPDATE**: Modify an existing payee
// 📌 **UPDATE**: Modify an existing payee
export async function PUT(request) {
  try {
    const user_id = await getUserIdFromToken(request);
    const body = await request.json();
    const { 
      payee_id, 
      entity_name, 
      service_name, 
      payee_name, 
      phone, 
      email, 
      amount, 
      category, 
      startDate, 
      endDate, 
      paidAmount, 
      paymentDate 
    } = body;

    if (!payee_id || !entity_name || !service_name || !payee_name || !phone || !email || !amount || !category || !startDate || !endDate || !paidAmount || !paymentDate) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Fetch entity and service IDs
    const [[entity]] = await db.execute('SELECT id FROM entities WHERE entity_name = ? LIMIT 1', [entity_name]);
    const [[service]] = await db.execute('SELECT id FROM services WHERE service_name = ? LIMIT 1', [service_name]);

    if (!entity) return NextResponse.json({ message: 'Entity not found' }, { status: 404 });
    if (!service) return NextResponse.json({ message: 'Service not found' }, { status: 404 });

    // Update payee
    const [updateResult] = await db.execute(
      'UPDATE payees SET entity_id = ?, service_id = ?, payee_name = ?, phone = ?, email = ?, amount = ?, category = ?, startDate = ?, endDate = ?, paidAmount = ?, paymentDate = ? WHERE id = ? AND user_id = ?',
      [entity.id, service.id, payee_name, phone, email, amount, category, startDate, endDate, paidAmount, paymentDate, payee_id, user_id]
    );

    if (updateResult.affectedRows === 0) {
      return NextResponse.json({ message: 'Payee not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Payee updated successfully' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
// 📌 **DELETE**: Remove a payee by ID
export async function DELETE(request) {
  try {
    const user_id = await getUserIdFromToken(request);
    const url = new URL(request.url);
    const payee_id = url.searchParams.get('payee_id');

    if (!payee_id) {
      return NextResponse.json({ message: 'Payee ID is required' }, { status: 400 });
    }

    const [deleteResult] = await db.execute('DELETE FROM payees WHERE id = ? AND user_id = ?', [payee_id, user_id]);

    if (deleteResult.affectedRows === 0) {
      return NextResponse.json({ message: 'Payee not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Payee deleted successfully' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db } from '../../../db';

export async function GET(request) {
  try {
    const userId = await getUserId(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');
    
    let query = 'SELECT * FROM income_records WHERE user_id = ?';
    const params = [userId];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (clientId) {
      query += ' AND client_id = ?';
      params.push(clientId);
    }
    
    query += ' ORDER BY due_date ASC';
    
    const [incomeRecords] = await db.execute(query, params);
    return NextResponse.json({ data: incomeRecords });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const userId = await getUserId(request);
    const { clientId, serviceId, amount, payment_date, due_date, is_recurring, notes } = await request.json();
    
    // Get service details
    const [services] = await db.execute(
      'SELECT * FROM services WHERE id = ? AND user_id = ?',
      [serviceId, userId]
    );
    
    if (services.length === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    const service = services[0];
    
    // Insert income record
    const [result] = await db.execute(
      `INSERT INTO income_records 
       (user_id, client_id, service_id, amount, payment_date, due_date, is_recurring, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, clientId, serviceId, amount, payment_date, due_date, is_recurring, notes]
    );
    
    // If recurring, set the recurrence_id to the new record's ID
    if (is_recurring) {
      await db.execute(
        'UPDATE income_records SET recurrence_id = ? WHERE id = ?',
        [result.insertId, result.insertId]
      );
    }
    
    return NextResponse.json(
      { id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Additional endpoint for upcoming payments
export async function GET_UPCOMING(request) {
  try {
    const userId = await getUserId(request);
    const [upcoming] = await db.execute(
      `SELECT * FROM income_records 
       WHERE user_id = ? AND status = 'pending' AND due_date >= CURDATE()
       ORDER BY due_date ASC LIMIT 10`,
      [userId]
    );
    return NextResponse.json({ data: upcoming });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
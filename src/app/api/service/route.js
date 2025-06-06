import { NextResponse } from 'next/server';
import { db } from '../../../db';

export async function GET(request) {
  try {
    const userId = await getUserId(request);
    const [services] = await db.execute(
      `SELECT * FROM services WHERE user_id = ?`,
      [userId]
    );
    return NextResponse.json({ data: services });
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
    const { name, description, billing_type, billing_interval, base_price } = await request.json();
    
    // Validate billing interval for recurring services
    if (billing_type === 'recurring' && !billing_interval) {
      return NextResponse.json(
        { error: 'Billing interval is required for recurring services' },
        { status: 400 }
      );
    }
    
    const [result] = await db.execute(
      `INSERT INTO services 
       (user_id, name, description, billing_type, billing_interval, base_price)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, name, description, billing_type, billing_interval, base_price]
    );
    
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
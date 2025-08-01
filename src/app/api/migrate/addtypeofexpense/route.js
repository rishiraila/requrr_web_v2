import { db } from '@/db'; // Adjust this import to your actual db file
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [columns] = await db.query(`
      SHOW COLUMNS FROM plans LIKE 'razorpay_plan_id';
    `);

    if (columns.length === 0) {
      await db.query(`
        ALTER TABLE plans ADD COLUMN razorpay_plan_id VARCHAR(255);
      `);
      return NextResponse.json({ message: 'Column razorpay_plan_id added successfully' });
    } else {
      return NextResponse.json({ message: 'Column razorpay_plan_id already exists' });
    }
  } catch (error) {
    console.error('Migration Error:', error);
    return NextResponse.json({ error: 'Migration failed', details: error.message }, { status: 500 });
  }
}

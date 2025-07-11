// app/api/cron/update-status/route.js (Next.js 13+)
import { db } from '../../../../db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await db.execute(`
      UPDATE income_records
      SET status = 'pending'
      WHERE status = 'paid' AND due_date = CURDATE();
    `);

    await db.execute(`
      UPDATE income_records
      SET status = 'overdue'
      WHERE status = 'pending' AND due_date < CURDATE();
    `);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update statuses' }, { status: 500 });
  }
}

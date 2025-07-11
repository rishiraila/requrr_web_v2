// app/api/cron/update-status/route.js
import { db } from '../../../../db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  // Authorization header check
  const authHeader = req.headers.get('Authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expected) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

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

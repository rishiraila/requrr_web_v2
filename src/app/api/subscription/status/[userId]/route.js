// src/app/api/subscription/status/[userId]/route.js
import db from '@/lib/db';

import { authenticate } from '../../../../../middleware/auth'

export async function GET(_, { params }) {

  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { userId } = params;

  const [result] = await db.query(
    'SELECT end_date FROM subscriptions WHERE user_id = ? AND end_date >= CURDATE()',
    [userId]
  );

  if (result.length === 0) {
    return Response.json({ subscribed: false });
  }

  return Response.json({ subscribed: true, end_date: result[0].end_date });
}

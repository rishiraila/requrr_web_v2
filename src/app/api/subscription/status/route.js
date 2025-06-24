// src/app/api/subscription/status/route.js
import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [result] = await db.query(
    `SELECT 
       s.start_date, 
       s.end_date, 
       p.name AS plan_name, 
       p.price, 
       p.max_renewals
     FROM subscriptions s
     JOIN plans p ON s.plan_id = p.id
     WHERE s.user_id = ? AND s.end_date >= CURDATE()`,
    [user.id]
  );

  if (result.length === 0) {
    return Response.json({ subscribed: false });
  }

  const subscription = result[0];

  return Response.json({
    subscribed: true,
    plan_name: subscription.plan_name,
    price: subscription.price,
    start_date: subscription.start_date,
    end_date: subscription.end_date,
    max_renewals: subscription.max_renewals,
  });
}

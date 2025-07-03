import { db } from '@/db';
import { authenticate } from '@/middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all users with role 'user'
    const [users] = await db.query(`
      SELECT id, username, email FROM users WHERE role = 'user'
    `);

    const userTransactions = await Promise.all(users.map(async (u) => {
      // Get subscription and plan
      const [[subscription]] = await db.query(`
        SELECT s.start_date, s.end_date, p.name as plan_name 
        FROM subscriptions s 
        JOIN plans p ON p.id = s.plan_id 
        WHERE s.user_id = ?
      `, [u.id]);

      // Get total paid amount
      const [[{ total_paid }]] = await db.query(`
        SELECT IFNULL(SUM(amount), 0) as total_paid 
        FROM income_records 
        WHERE user_id = ? AND status = 'paid'
      `, [u.id]);

      // Get all paid transactions
      const [transactions] = await db.query(`
        SELECT id, client_id, amount, payment_date, notes 
        FROM income_records 
        WHERE user_id = ? AND status = 'paid'
      `, [u.id]);

      return {
        username: u.username || 'N/A',
        email: u.email,
        plan: subscription?.plan_name || 'N/A',
        plan_start: subscription?.start_date || null,
        plan_end: subscription?.end_date || null,
        total_paid,
        transactions
      };
    }));

    return Response.json({ users: userTransactions });
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

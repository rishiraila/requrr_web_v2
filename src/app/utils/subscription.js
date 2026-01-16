import { db } from '../../db';

export async function getActivePlan(userId) {
  const [rows] = await db.query(
    `SELECT p.*
     FROM subscriptions s
     JOIN plans p ON s.plan_id = p.id
     WHERE s.user_id = ?
     AND s.end_date >= CURDATE()`,
    [userId]
  );

  return rows.length ? rows[0] : null;
}

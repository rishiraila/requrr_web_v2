import { db } from '../../../db';
import { authenticate } from '../../../middleware/auth';
import { sendEmail } from '../../utils/mailer';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [records] = await db.query(
    'SELECT * FROM income_records WHERE user_id = ? ORDER BY payment_date DESC',
    [user.id]
  );

  return Response.json(records);
}



// export async function POST(req) {
//   const user = authenticate(req);
//   if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

//   const {
//     client_id,
//     service_id,
//     amount,
//     payment_date,
//     due_date,
//     status = 'pending',
//     is_recurring = 0,
//     recurrence_id = null,
//     notes,
//   } = await req.json();

//   // Step 1: Get current active subscription and plan
//   const [subscriptions] = await db.query(
//     `SELECT s.start_date, s.end_date, p.max_renewals, p.name AS plan_name
//      FROM subscriptions s
//      JOIN plans p ON s.plan_id = p.id
//      WHERE s.user_id = ? AND s.end_date >= CURDATE()`,
//     [user.id]
//   );

//   if (subscriptions.length === 0) {
//     return Response.json({ error: 'No active subscription found' }, { status: 403 });
//   }

//   const { start_date, end_date, max_renewals, plan_name } = subscriptions[0];

//   // Step 2: Enforce renewal limit strictly for recurring entries
//   if (is_recurring && max_renewals !== null) {
//     const [countResult] = await db.query(
//       `SELECT COUNT(*) AS total FROM income_records 
//      WHERE user_id = ? AND is_recurring = 1 AND payment_date BETWEEN ? AND ?`,
//       [user.id, start_date, end_date]
//     );

//     const renewalCount = countResult[0].total;

//     if (renewalCount >= max_renewals) {
//       return Response.json({
//         error: `You have reached the renewal limit (${max_renewals}) for your "${plan_name}" plan.`,
//       }, { status: 403 });
//     }
//   }

//   // Step 3: Allow record creation
//   await db.query(
//     `INSERT INTO income_records 
//      (user_id, client_id, service_id, amount, payment_date, due_date, status, is_recurring, recurrence_id, notes) 
//      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//     [
//       user.id,
//       client_id,
//       service_id,
//       amount,
//       payment_date,
//       due_date || null,
//       status,
//       is_recurring,
//       recurrence_id,
//       notes,
//     ]
//   );

//   return Response.json({ message: 'Income record created' });
// }


export async function POST(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const {
    client_id,
    service_id,
    amount,
    payment_date,
    due_date,
    status = 'pending',
    is_recurring = 0,
    recurrence_id = null,
    notes,
  } = await req.json();

  // Step 1: Get active subscription and plan
  const [subscriptions] = await db.query(
    `SELECT s.start_date, s.end_date, p.max_renewals, p.name AS plan_name
     FROM subscriptions s
     JOIN plans p ON s.plan_id = p.id
     WHERE s.user_id = ? AND s.end_date >= CURDATE()`,
    [user.id]
  );

  if (subscriptions.length === 0) {
    return Response.json({ error: 'No active subscription found' }, { status: 403 });
  }

  const { start_date, end_date, max_renewals, plan_name } = subscriptions[0];

  // Step 2: Enforce max_renewals by counting ALL income records during active subscription
  if (max_renewals !== null) {
    const [countResult] = await db.query(
      `SELECT COUNT(*) AS total FROM income_records
       WHERE user_id = ? AND payment_date BETWEEN ? AND ?`,
      [user.id, start_date, end_date]
    );

    const recordCount = countResult[0].total;

    if (recordCount >= max_renewals) {
      return Response.json({
        error: `You have reached the limit of ${max_renewals} entries for your "${plan_name}" plan.`,
      }, { status: 403 });
    }
  }

  // Step 3: Allow record creation
  await db.query(
    `INSERT INTO income_records 
     (user_id, client_id, service_id, amount, payment_date, due_date, status, is_recurring, recurrence_id, notes) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.id,
      client_id,
      service_id,
      amount,
      payment_date,
      due_date || null,
      status,
      is_recurring,
      recurrence_id,
      notes,
    ]
  );

  return Response.json({ message: 'Income record created' });
}

/**
 * @swagger
 * /api/income_records:
 *   get:
 *     summary: Get all income records for the authenticated user
 *     tags: [Income Records]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of income records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   client_id:
 *                     type: integer
 *                   service_id:
 *                     type: integer
 *                   amount:
 *                     type: number
 *                   payment_date:
 *                     type: string
 *                     format: date
 *                   due_date:
 *                     type: string
 *                     format: date
 *                     nullable: true
 *                   status:
 *                     type: string
 *                   is_recurring:
 *                     type: boolean
 *                   recurrence_id:
 *                     type: integer
 *                     nullable: true
 *                   notes:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *
 *   post:
 *     summary: Create a new income record
 *     tags: [Income Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client_id
 *               - service_id
 *               - amount
 *               - payment_date
 *             properties:
 *               client_id:
 *                 type: integer
 *                 example: 1
 *               service_id:
 *                 type: integer
 *                 example: 2
 *               amount:
 *                 type: number
 *                 example: 1500
 *               payment_date:
 *                 type: string
 *                 format: date
 *                 example: 2025-07-09
 *               due_date:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 example: 2025-07-30
 *               status:
 *                 type: string
 *                 example: pending
 *               is_recurring:
 *                 type: boolean
 *                 example: false
 *               recurrence_id:
 *                 type: integer
 *                 nullable: true
 *                 example: null
 *               notes:
 *                 type: string
 *                 example: Follow-up in August
 *     responses:
 *       200:
 *         description: Income record created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Limit exceeded or no active subscription
 */


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

//   // Step 1: Get active subscription and plan
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

//   // Step 2: Enforce max_renewals by counting ALL income records during active subscription
//   if (max_renewals !== null) {
//     const [countResult] = await db.query(
//       `SELECT COUNT(*) AS total FROM income_records
//        WHERE user_id = ?`,
//       [user.id]
//     );

//     const recordCount = countResult[0].total;

//     console.log("checking the stats ", recordCount, max_renewals)

//     if (recordCount >= max_renewals) {
//       return Response.json({
//         error: `You have reached the limit of ${max_renewals} entries for your "${plan_name}" plan.`,
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
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  const { max_renewals, plan_name } = subscriptions[0];

  // Step 2: Enforce max_renewals by counting income records during subscription
  if (max_renewals !== null) {
    const [countResult] = await db.query(
      `SELECT COUNT(*) AS total FROM income_records
       WHERE user_id = ?`,
      [user.id]
    );

    const recordCount = countResult[0].total;

    if (recordCount >= max_renewals) {
      return Response.json({
        error: `You have reached the limit of ${max_renewals} entries for your "${plan_name}" plan.`,
      }, { status: 403 });
    }
  }

  // Step 3: Insert the income record
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

  // ✅ Step 4: Set the linked service as active
  if (service_id) {
    await db.query(
      `UPDATE services SET is_active = 1 WHERE id = ? AND user_id = ?`,
      [service_id, user.id]
    );
  }

  return Response.json({ message: 'Income record created successfully' });
}

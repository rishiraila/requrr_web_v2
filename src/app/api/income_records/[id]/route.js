/**
 * @swagger
 * /api/income_records/{id}:
 *   get:
 *     summary: Get a specific income record by ID
 *     tags: [Income Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Income record ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Income record object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer }
 *                 client_id: { type: integer }
 *                 service_id: { type: integer }
 *                 amount: { type: number }
 *                 payment_date: { type: string, format: date }
 *                 due_date: { type: string, format: date, nullable: true }
 *                 status: { type: string }
 *                 is_recurring: { type: boolean }
 *                 recurrence_id: { type: integer, nullable: true }
 *                 notes: { type: string }
 *       401:
 *         description: Unauthorized
 *
 *   put:
 *     summary: Update an income record by ID
 *     tags: [Income Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Income record ID
 *         schema:
 *           type: integer
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
 *               client_id: { type: integer, example: 1 }
 *               service_id: { type: integer, example: 2 }
 *               amount: { type: number, example: 2000 }
 *               payment_date: { type: string, format: date, example: 2025-07-10 }
 *               due_date: { type: string, format: date, nullable: true, example: 2025-07-20 }
 *               status: { type: string, example: "paid" }
 *               is_recurring: { type: boolean, example: false }
 *               recurrence_id: { type: integer, nullable: true, example: null }
 *               notes: { type: string, example: "Paid in full" }
 *     responses:
 *       200:
 *         description: Income record updated
 *       401:
 *         description: Unauthorized
 *
 *   delete:
 *     summary: Delete an income record by ID
 *     tags: [Income Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Income record ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Income record deleted
 *       401:
 *         description: Unauthorized
 */


import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await db.query(
    'SELECT * FROM income_records WHERE id = ? AND user_id = ?',
    [params.id, user.id]
  );

  return Response.json(rows[0] || {});
}

export async function PUT(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const {
    client_id,
    service_id,
    amount,
    payment_date,
    due_date,
    status,
    is_recurring,
    recurrence_id,
    notes,
  } = await req.json();

  await db.query(
    `UPDATE income_records SET 
      client_id = ?, service_id = ?, amount = ?, payment_date = ?, due_date = ?, 
      status = ?, is_recurring = ?, recurrence_id = ?, notes = ? 
     WHERE id = ? AND user_id = ?`,
    [
      client_id,
      service_id,
      amount,
      payment_date,
      due_date || null,
      status,
      is_recurring,
      recurrence_id,
      notes,
      params.id,
      user.id,
    ]
  );

  return Response.json({ message: 'Income record updated' });
}

// export async function DELETE(req, { params }) {
//   const user = authenticate(req);
//   if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

//   await db.query('DELETE FROM income_records WHERE id = ? AND user_id = ?', [params.id, user.id]);
//   return Response.json({ message: 'Income record deleted' });
// }

export async function DELETE(req, { params }) {
  const user = authenticate(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const recordId = params.id;

  // 1. Fetch the service_id for this income record before deleting
  const [[record]] = await db.query(
    `SELECT service_id FROM income_records WHERE id = ? AND user_id = ?`,
    [recordId, user.id]
  );

  if (!record) {
    return Response.json({ error: 'Income record not found' }, { status: 404 });
  }

  const serviceId = record.service_id;

  // 2. Delete the income record
  await db.query(
    `DELETE FROM income_records WHERE id = ? AND user_id = ?`,
    [recordId, user.id]
  );

  // 3. Check if the service is still used in other income records
  const [[{ count }]] = await db.query(
    `SELECT COUNT(*) AS count FROM income_records WHERE service_id = ? AND user_id = ?`,
    [serviceId, user.id]
  );

  // 4. If count is 0, mark the service as inactive
  if (count === 0) {
    await db.query(
      `UPDATE services SET is_active = 0 WHERE id = ? AND user_id = ?`,
      [serviceId, user.id]
    );
  }

  return Response.json({ message: 'Income record deleted successfully' });
}

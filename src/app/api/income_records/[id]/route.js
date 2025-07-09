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

export async function DELETE(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await db.query('DELETE FROM income_records WHERE id = ? AND user_id = ?', [params.id, user.id]);
  return Response.json({ message: 'Income record deleted' });
}

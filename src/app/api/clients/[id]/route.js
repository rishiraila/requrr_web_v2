/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Get a specific client by ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the client to retrieve
 *     responses:
 *       200:
 *         description: Client object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 address:
 *                   type: string
 *                 notes:
 *                   type: string
 *                 company_name:
 *                   type: string
 *       401:
 *         description: Unauthorized

 *   put:
 *     summary: Update a client by ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the client to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               address:
 *                 type: string
 *                 example: 123 Street Name
 *               notes:
 *                 type: string
 *                 example: VIP client
 *               company_name:
 *                 type: string
 *                 example: ABC Corp
 *     responses:
 *       200:
 *         description: Client updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Client updated
 *       401:
 *         description: Unauthorized

 *   delete:
 *     summary: Delete a client by ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the client to delete
 *     responses:
 *       200:
 *         description: Client deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Client deleted
 *       401:
 *         description: Unauthorized
 */

// import { db } from '@/lib/db';
import {db} from '../../../../db'
import { authenticate } from '../../../../middleware/auth';

export async function GET(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const [rows] = await db.query('SELECT * FROM clients WHERE id = ? AND user_id = ?', [id, user.id]);
  return Response.json(rows[0] || {});
}

export async function PUT(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { name, email, phone, address, notes, company_name } = await req.json();
  await db.query(
    'UPDATE clients SET name = ?, email = ?, phone = ?, address = ?, notes = ?, company_name = ? WHERE id = ? AND user_id = ?',
    [name, email, phone, address, notes, company_name, id, user.id]
  );
  return Response.json({ message: 'Client updated' });
}

export async function DELETE(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  console.log('Deleting client with ID:', id, 'for user:', user.id);

  // Check if client exists first
  const [clientRows] = await db.query('SELECT * FROM clients WHERE id = ? AND user_id = ?', [id, user.id]);
  if (clientRows.length === 0) {
    console.log('Client not found');
    return Response.json({ error: 'Client not found' }, { status: 404 });
  }

  // Delete all income records associated with this client
  const [incomeResult] = await db.query('DELETE FROM income_records WHERE client_id = ? AND user_id = ?', [id, user.id]);
  console.log('Deleted income records:', incomeResult.affectedRows);

  // Delete the client
  const [result] = await db.query('DELETE FROM clients WHERE id = ? AND user_id = ?', [id, user.id]);
  console.log('Deleted client:', result.affectedRows);

  if (result.affectedRows === 0) {
    return Response.json({ error: 'Failed to delete client' }, { status: 500 });
  }

  return Response.json({ message: 'Client deleted successfully' });
}

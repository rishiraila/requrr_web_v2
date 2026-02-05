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
import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const [rows] = await db.query(
    'SELECT * FROM clients WHERE id = ? AND user_id = ?',
    [id, user.id]
  );

  return Response.json(rows[0] || {});
}

export async function PUT(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const {
    name,
    email = null,
    phone = null,
    notes = null,
    company_name = null
  } = await req.json();

  await db.query(
    `UPDATE clients
     SET name = ?, email = ?, phone = ?, notes = ?, company_name = ?
     WHERE id = ? AND user_id = ?`,
    [name, email, phone, notes, company_name, id, user.id]
  );

  return Response.json({ message: 'Client updated' });
}

export async function DELETE(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;

  // Check if client exists
  const [clientRows] = await db.query(
    'SELECT id FROM clients WHERE id = ? AND user_id = ?',
    [id, user.id]
  );

  if (clientRows.length === 0) {
    return Response.json({ error: 'Client not found' }, { status: 404 });
  }

  // Delete related income records
  await db.query(
    'DELETE FROM income_records WHERE client_id = ? AND user_id = ?',
    [id, user.id]
  );

  // Delete client
  await db.query(
    'DELETE FROM clients WHERE id = ? AND user_id = ?',
    [id, user.id]
  );

  return Response.json({ message: 'Client deleted successfully' });
}

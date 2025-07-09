/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Get all clients for the authenticated user
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   user_id:
 *                     type: integer
 *                     example: 42
 *                   name:
 *                     type: string
 *                     example: Jane Doe
 *                   email:
 *                     type: string
 *                     example: jane@example.com
 *                   phone:
 *                     type: string
 *                     example: "9876543210"
 *                   address:
 *                     type: string
 *                     example: 123 Street Name, City
 *                   notes:
 *                     type: string
 *                     example: Important client
 *                   company_name:
 *                     type: string
 *                     example: ABC Corp
 *       401:
 *         description: Unauthorized

 *   post:
 *     summary: Create a new client for the authenticated user
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
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
 *                 example: 123 Street Name, City
 *               notes:
 *                 type: string
 *                 example: Follow up next week
 *               company_name:
 *                 type: string
 *                 example: ABC Corp
 *     responses:
 *       200:
 *         description: Client created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Client created
 *       401:
 *         description: Unauthorized
 */


// import { db } from '@/lib/db';
import { db } from '../../../db'
import { authenticate } from '../../../middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [clients] = await db.query('SELECT * FROM clients WHERE user_id = ?', [user.id]);
  return Response.json(clients);
}

export async function POST(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, email, phone, address, notes, company_name } = await req.json();
  await db.query(
    'INSERT INTO clients (user_id, name, email, phone, address, notes, company_name) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [user.id, name, email, phone, address, notes, company_name]
  );
  return Response.json({ message: 'Client created' });
}

/**
 * @swagger
 * /api/setup/expenses:
 *   get:
 *     summary: Create the 'expenses' table if it doesn't exist
 *     tags: [Setup]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Table creation status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "✅ expenses table created." }
 *       401:
 *         description: Unauthorized
 */

import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS expenses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      description TEXT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category VARCHAR(100) NOT NULL,
      date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await db.query(createTableSQL);
    return NextResponse.json({ success: true, message: '✅ expenses table created.' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message });
  }
}

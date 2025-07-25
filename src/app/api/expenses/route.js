import { db } from '../../../db';
import { authenticate } from '../../../middleware/auth';

async function ensureAccountColumnExists() {
  try {
    const [rows] = await db.query(`SHOW COLUMNS FROM expenses LIKE 'account'`);
    if (rows.length === 0) {
      await db.query(`ALTER TABLE expenses ADD COLUMN account VARCHAR(100)`);
      console.log("'account' column added to expenses table.");
    }
  } catch (error) {
    console.error('Failed to ensure account column exists:', error);
    throw error;
  }
}

export async function GET(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await ensureAccountColumnExists();

  const [records] = await db.query(
    'SELECT * FROM expenses WHERE user_id = ? AND type = "expense" ORDER BY date DESC',
    [user.id]
  );

  return Response.json(records);
}

export async function POST(req) {
  const user = authenticate(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await ensureAccountColumnExists();

  const {
    description,
    amount,
    category,
    account,
    date,
  } = await req.json();

  if (!description || !amount || !category || !date || !account) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await db.query(
    `INSERT INTO expenses (user_id, description, amount, category, account, date, type)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [user.id, description, amount, category, account, date, 'expense']
  );

  return Response.json({ message: 'Expense record created successfully' });
}

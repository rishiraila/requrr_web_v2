import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [records] = await db.query(
      'SELECT * FROM expenses WHERE user_id = ? AND type = "income" ORDER BY date DESC',
      [user.id]
    );
    return Response.json(records);
  } catch (err) {
    console.error('Error fetching incomes:', err);
    return Response.json({ error: 'Failed to fetch incomes' }, { status: 500 });
  }
}

export async function POST(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { description, amount, category, account, date } = await req.json();

    if (!description || !amount || !date) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await db.query(
      `INSERT INTO expenses (user_id, description, amount, date, category, account, type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,

      [user.id, description, amount, date, category || '', account || '', 'income']
    );

    return Response.json({ message: '✅ Income record created successfully' });
  } catch (err) {
    console.error('Error inserting income:', err);
    return Response.json({ error: 'Failed to create income record' }, { status: 500 });
  }
}

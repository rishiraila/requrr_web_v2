import { db } from '../../../db'
import { authenticate } from '../../../middleware/auth';

export async function GET() {
  const [plans] = await db.query(
    'SELECT id, name, price, max_renewals, description FROM plans ORDER BY price ASC'
  );
  return Response.json(plans);
}

export async function POST(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Optional: check for admin role here
  const { name, price, max_renewals = null, description = '' } = await req.json();

  if (!name || price === undefined) {
    return Response.json({ error: 'Name and price are required' }, { status: 400 });
  }

  try {
    await db.query(
      `INSERT INTO plans (name, price, max_renewals, description) VALUES (?, ?, ?, ?)`,
      [name, price, max_renewals, description]
    );
    return Response.json({ message: 'Plan created successfully' });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

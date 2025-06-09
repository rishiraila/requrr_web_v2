import { db } from '../../../db';
import { authenticate } from '../../../middleware/auth';
import {sendEmail} from '../../utils/mailer'

export async function GET(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [records] = await db.query(
    'SELECT * FROM income_records WHERE user_id = ? ORDER BY payment_date DESC',
    [user.id]
  );

  return Response.json(records);
}

export async function POST(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

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

  return Response.json({ message: 'Income record created' });
}

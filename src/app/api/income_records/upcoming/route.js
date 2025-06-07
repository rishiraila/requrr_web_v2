import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  const [records] = await db.query(`
  SELECT 
    ir.*, 
    c.name AS client_name, 
    s.name AS service_name
  FROM income_records ir
  JOIN clients c ON ir.client_id = c.id
  JOIN services s ON ir.service_id = s.id
  WHERE ir.user_id = ? AND ir.due_date >= CURDATE()
  ORDER BY ir.due_date ASC
`, [user.id]);


  return Response.json(records);
}

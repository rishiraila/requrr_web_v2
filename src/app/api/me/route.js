// // /api/me/route.js
// import { authenticate } from '../../../middleware/auth';
// import { db } from '../../../db';

// export async function GET(req) {
//   const user = authenticate(req);
//   if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

//   const [rows] = await db.query('SELECT username, email FROM users WHERE id = ?', [user.id]);
//   return Response.json(rows[0]);
// }



// /api/me/route.js
import { authenticate } from '../../../middleware/auth';
import { db } from '../../../db';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await db.query(
    'SELECT username, email, first_name, last_name, country_code, phone_code, phone FROM users WHERE id = ?',
    [user.id]
  );

  return Response.json(rows[0]);
}

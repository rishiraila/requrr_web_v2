// import { db } from '../../../../db';
// import { authenticate } from '../../../../middleware/auth';

// export async function PUT(req) {
//   const user = authenticate(req);
//   if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

//   const { username, email } = await req.json();

//   await db.query(
//     'UPDATE users SET username = ?, email = ? WHERE id = ?',
//     [username, email, user.id]
//   );

//   return Response.json({ message: 'Account updated successfully' });
// }


import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function PUT(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const {
    username,
    email,
    first_name,
    last_name,
    country_code,
    phone_code,
    phone
  } = await req.json();

  await db.query(
    `UPDATE users
     SET username = ?, email = ?, first_name = ?, last_name = ?, country_code = ?, phone_code = ?, phone = ?
     WHERE id = ?`,
    [username, email, first_name, last_name, country_code, phone_code, phone, user.id]
  );

  return Response.json({ message: 'Account updated successfully' });
}
// File: /app/api/fcm-token/route.js
import { db } from '../../../../db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, email, platform = 'unknown' } = body;

    if (!token || !email) {
      return Response.json({ error: 'Missing token or email' }, { status: 400 });
    }

    // Check if token already exists
    const [existing] = await db.query(
      'SELECT id FROM fcm_tokens WHERE user_id = ?',
      [email]
    );

    if (existing.length > 0) {
      // Update existing token
      await db.query(
        'UPDATE fcm_tokens SET token = ?, platform = ?, updated_at = NOW() WHERE user_id = ?',
        [token, platform, email]
      );
    } else {
      // Insert new token
      await db.query(
        'INSERT INTO fcm_tokens (user_id, token, platform) VALUES (?, ?, ?)',
        [email, token, platform]
      );
    }

    return Response.json({
      success: true,
      message: 'FCM token saved successfully',
      data: { email, token, platform }
    });
  } catch (error) {
    return Response.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const email = searchParams.get('email');

//     if (!email) {
//       return Response.json({ error: 'Missing email' }, { status: 400 });
//     }

//     const [rows] = await db.query(
//       'SELECT token, platform, updated_at FROM fcm_tokens WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
//       [email]
//     );

//     if (rows.length === 0) {
//       return Response.json({ error: 'No token found for user' }, { status: 404 });
//     }

//     return Response.json({ token: rows[0] });
//   } catch (error) {
//     return Response.json({ error: 'DB error', details: error.message }, { status: 500 });
//   }
// }
export async function GET() {
  try {
    const [rows] = await db.query(
      'SELECT user_id AS email, token, platform, updated_at FROM fcm_tokens ORDER BY updated_at DESC'
    );

    return Response.json({ tokens: rows });
  } catch (error) {
    return Response.json({ error: 'DB error', details: error.message }, { status: 500 });
  }
}
// File: /app/api/fcm-token/route.js
import { db } from '../../../db';

// Helper function to validate platform
function validatePlatform(platform) {
  const validPlatforms = ['android', 'iOS', 'web'];
  return validPlatforms.includes(platform) ? platform : 'unknown';
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, email, platform = 'unknown' } = body;

    if (!token || !email) {
      return Response.json({ error: 'Missing token or email' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate platform
    const validatedPlatform = validatePlatform(platform);

    // Use UPSERT with unique constraint on (user_id, platform)
    const query = `
      INSERT INTO fcm_tokens (user_id, token, platform) 
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        token = VALUES(token),
        updated_at = NOW()
    `;

    const [result] = await db.query(query, [email, token, validatedPlatform]);

    return Response.json({
      success: true,
      message: result.affectedRows === 1 ? 'FCM token created successfully' : 'FCM token updated successfully',
      data: { 
        email, 
        token, 
        platform: validatedPlatform,
        action: result.affectedRows === 1 ? 'created' : 'updated'
      }
    });
  } catch (error) {
    console.error('FCM Token Error:', error);
    return Response.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const platform = searchParams.get('platform');

    if (!email) {
      return Response.json({ error: 'Missing email' }, { status: 400 });
    }

    let query = 'SELECT token, platform, updated_at FROM fcm_tokens WHERE user_id = ?';
    let params = [email];

    if (platform) {
      query += ' AND platform = ?';
      params.push(platform);
    }

    query += ' ORDER BY updated_at DESC LIMIT 1';

    const [rows] = await db.query(query, params);

    if (rows.length === 0) {
      return Response.json({ error: 'No token found for user' }, { status: 404 });
    }

    return Response.json({ 
      success: true,
      data: rows[0] 
    });
  } catch (error) {
    console.error('FCM Token GET Error:', error);
    return Response.json({ error: 'DB error', details: error.message }, { status: 500 });
  }
}

// New endpoint to get all tokens for a user
export async function GET_ALL(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return Response.json({ error: 'Missing email' }, { status: 400 });
    }

    const [rows] = await db.query(
      'SELECT token, platform, updated_at FROM fcm_tokens WHERE user_id = ? ORDER BY updated_at DESC',
      [email]
    );

    return Response.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('FCM Token GET_ALL Error:', error);
    return Response.json({ error: 'DB error', details: error.message }, { status: 500 });
  }
}

// New endpoint to delete a token
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { email, platform } = body;

    if (!email || !platform) {
      return Response.json({ error: 'Missing email or platform' }, { status: 400 });
    }

    const validatedPlatform = validatePlatform(platform);

    const [result] = await db.query(
      'DELETE FROM fcm_tokens WHERE user_id = ? AND platform = ?',
      [email, validatedPlatform]
    );

    if (result.affectedRows === 0) {
      return Response.json({ error: 'No token found for this user and platform' }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'FCM token deleted successfully',
      data: { email, platform: validatedPlatform }
    });
  } catch (error) {
    console.error('FCM Token DELETE Error:', error);
    return Response.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}

// New endpoint to update token without creating new one
export async function PUT(req) {
  try {
    const body = await req.json();
    const { token, email, platform } = body;

    if (!token || !email || !platform) {
      return Response.json({ error: 'Missing token, email, or platform' }, { status: 400 });
    }

    const validatedPlatform = validatePlatform(platform);

    const [result] = await db.query(
      'UPDATE fcm_tokens SET token = ?, updated_at = NOW() WHERE user_id = ? AND platform = ?',
      [token, email, validatedPlatform]
    );

    if (result.affectedRows === 0) {
      return Response.json({ error: 'No token found for this user and platform' }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'FCM token updated successfully',
      data: { email, token, platform: validatedPlatform }
    });
  } catch (error) {
    console.error('FCM Token PUT Error:', error);
    return Response.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}

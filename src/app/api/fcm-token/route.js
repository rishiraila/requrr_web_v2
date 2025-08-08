import { NextResponse } from 'next/server';
import { db } from '../../../db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { user_id, fcm_token, platform } = body;

    if (!user_id || !fcm_token || !platform) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    // Check if user_id already exists
    const [existing] = await db.query(
      'SELECT * FROM fcm_tokens WHERE user_id = ?',
      [user_id]
    );

    if (existing.length > 0) {
      // Update token and platform
      await db.query(
        'UPDATE fcm_tokens SET fcm_token = ?, platform = ?, created_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [fcm_token, platform, user_id]
      );
      return new Response(JSON.stringify({ message: 'Token updated' }), { status: 200 });
    } else {
      // Insert new token
      await db.query(
        'INSERT INTO fcm_tokens (user_id, fcm_token, platform, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
        [user_id, fcm_token, platform]
      );
      return new Response(JSON.stringify({ message: 'Token saved' }), { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');

  if (!user_id) {
    return NextResponse.json({ error: 'user_id query param required' }, { status: 400 });
  }

  try {
    const [tokens] = await db.query(
      'SELECT * FROM fcm_tokens WHERE user_id = ?',
      [user_id]
    );

    return NextResponse.json({ data: tokens });
  } catch (err) {
    console.error('Fetch FCM Token Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

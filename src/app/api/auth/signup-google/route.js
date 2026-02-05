import { db } from '../../../../db';

export async function POST(req) {
  try {
    const {
      email,
      first_name = '',
      last_name = '',
      country_code = ''
    } = await req.json();

    if (!email) {
      return Response.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // 1. Check if user already exists
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length) {
      return Response.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // 2. Create user (NO PASSWORD)
    const [result] = await db.query(
      `INSERT INTO users (email, first_name, last_name, country_code)
       VALUES (?, ?, ?, ?)`,
      [email, first_name, last_name, country_code]
    );

    const userId = result.insertId;

    // 3. Assign Free Plan
    const [[freePlan]] = await db.query(
      `SELECT id FROM plans WHERE name = 'Free' LIMIT 1`
    );

    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    await db.query(
      `INSERT INTO subscriptions (user_id, plan_id, start_date, end_date)
       VALUES (?, ?, ?, ?)`,
      [userId, freePlan.id, startDate, endDate]
    );

    return Response.json({
      message: 'User registered successfully with Google'
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

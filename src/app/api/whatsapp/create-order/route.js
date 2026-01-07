import Razorpay from 'razorpay';
import jwt from 'jsonwebtoken';
import { db } from '../../../../db';

export async function POST(req) {
  try {
    // ✅ READ AUTH HEADER CORRECTLY (App Router)
     console.log('JWT_SECRET (create-order):', "your_secret_key");
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    let user;
    try {
      user = jwt.verify(token, "your_secret_key");
    } catch (err) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { credits, userCurrency = 'INR' } = await req.json();
    if (!credits) {
      return Response.json({ error: 'Missing credits' }, { status: 400 });
    }

    // ✅ Fetch pricing
    const [rows] = await db.query(
      'SELECT * FROM whatsapp_credit_pricing WHERE credits = ? AND active = 1',
      [credits]
    );

    if (!rows.length) {
      return Response.json({ error: 'Invalid credits amount' }, { status: 400 });
    }

    const pricing = rows[0];
    const basePrice = userCurrency === 'INR'
      ? pricing.price_inr
      : pricing.price_usd;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(basePrice * 100),
      currency: 'INR',
      receipt: `whatsapp_${user.id}_${Date.now()}`
    });

    return Response.json({
      ...order,
      credits,
      finalPrice: basePrice,
      currency: 'INR'
    });

  } catch (err) {
    console.error('[WHATSAPP CREATE ORDER]', err);
    return Response.json({ error: 'Order creation failed' }, { status: 500 });
  }
}

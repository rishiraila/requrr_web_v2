// import crypto from 'crypto';
// import { authenticate } from '../../../../middleware/auth';
// import { db } from '../../../../db';

// export async function POST(req) {
//   const user = authenticate(req);
//   if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

//   const {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     plan_id,
//     coupon_code,
//     final_price
//   } = await req.json();

//   if (!plan_id) return Response.json({ error: 'Missing plan_id' }, { status: 400 });

//   const signatureBase = `${razorpay_order_id}|${razorpay_payment_id}`;
//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(signatureBase)
//     .digest("hex");

//   if (expectedSignature !== razorpay_signature) {
//     return Response.json({ error: 'Invalid signature' }, { status: 400 });
//   }

//   const [[plan]] = await db.query('SELECT * FROM plans WHERE id = ?', [plan_id]);
//   if (!plan) return Response.json({ error: 'Invalid plan ID' }, { status: 400 });

//   const now = new Date();
//   const startDate = now.toISOString().slice(0, 19).replace('T', ' ');
//   const end = new Date(now);
//   end.setFullYear(end.getFullYear() + 1);
//   const endDate = end.toISOString().slice(0, 19).replace('T', ' ');


//   try {
//     await db.query(
//       `INSERT INTO subscriptions (user_id, plan_id, start_date, end_date)
//        VALUES (?, ?, ?, ?)
//        ON DUPLICATE KEY UPDATE plan_id = VALUES(plan_id), start_date = VALUES(start_date), end_date = VALUES(end_date)`,
//       [user.id, plan.id, startDate, endDate]
//     );
//     if (coupon_code) {
//       await db.query(
//         `UPDATE coupons SET used_count = used_count + 1 WHERE code = ?`,
//         [coupon_code]
//       );
//     }
//     await db.query(
//       `INSERT INTO transactions 
//     (user_id, plan_id, coupon_code, original_price, discount, final_price, razorpay_order_id, razorpay_payment_id, status, message)
//    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         user.id,
//         plan.id,
//         coupon_code || null,
//         plan.price,
//         coupon_code ? plan.price - final_price : 0,
//         final_price,
//         razorpay_order_id,
//         razorpay_payment_id,
//         'success',
//         'Subscription payment successful'
//       ]
//     );

//     return Response.json({ message: 'Subscription activated', plan: plan.name });
//   } catch (err) {
//     console.error(err);
//     return Response.json({ error: 'DB update failed' }, { status: 500 });
//   }
// }

// src/app/api/payment/verify/route.js
import crypto from 'crypto';
import { authenticate } from '../../../../middleware/auth';
import { db } from '../../../../db';

export async function POST(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan_id,
    coupon_code,
    final_price,
    currency  // user's local currency (e.g., USD)
  } = await req.json();

  if (!plan_id) return Response.json({ error: 'Missing plan_id' }, { status: 400 });

  // Verify signature
  const signatureBase = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(signatureBase)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Fetch plan
  const [[plan]] = await db.query('SELECT * FROM plans WHERE id = ?', [plan_id]);
  if (!plan) return Response.json({ error: 'Invalid plan ID' }, { status: 400 });

  // Calculate subscription period
  const now = new Date();
  const startDate = now.toISOString().slice(0, 19).replace('T', ' ');
  const end = new Date(now);
  end.setFullYear(end.getFullYear() + 1);
  const endDate = end.toISOString().slice(0, 19).replace('T', ' ');

  try {
    // Save/Update subscription
    await db.query(
      `INSERT INTO subscriptions (user_id, plan_id, start_date, end_date)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE plan_id = VALUES(plan_id), start_date = VALUES(start_date), end_date = VALUES(end_date)`,
      [user.id, plan.id, startDate, endDate]
    );

    // Update coupon usage count
    if (coupon_code) {
      await db.query(
        `UPDATE coupons SET used_count = used_count + 1 WHERE code = ?`,
        [coupon_code]
      );
    }

    // Save transaction
    await db.query(
      `INSERT INTO transactions 
       (user_id, plan_id, coupon_code, original_price, discount, final_price, currency, razorpay_order_id, razorpay_payment_id, status, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        plan.id,
        coupon_code || null,
        plan.price,                                 // original price in INR
        coupon_code ? plan.price - final_price : 0, // discount in INR
        final_price,                                // final price in user's currency
        currency || 'INR',
        razorpay_order_id,
        razorpay_payment_id,
        'success',
        'Subscription payment successful'
      ]
    );

    return Response.json({ message: 'Subscription activated', plan: plan.name });

  } catch (err) {
    console.error('[VERIFY ERROR]', err);
    return Response.json({ error: 'DB update failed' }, { status: 500 });
  }
}

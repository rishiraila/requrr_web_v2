import Razorpay from 'razorpay';
import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const user = authenticate(req);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { planId } = await req.json();

    if (!planId) {
      return Response.json({ error: 'Missing planId in request body' }, { status: 400 });
    }

    const [results] = await db.query('SELECT razorpay_plan_id FROM plans WHERE id = ?', [planId]);

    if (!results.length) {
      return Response.json({ error: 'Plan not found' }, { status: 404 });
    }

    const razorpayPlanId = results[0].razorpay_plan_id;

    if (!razorpayPlanId) {
      return Response.json({ error: 'Razorpay plan ID not found in DB' }, { status: 500 });
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: razorpayPlanId,
      customer_notify: 1,
      total_count: 12,
      quantity: 1,
    });

    return Response.json({
      subscription_id: subscription.id,
      status: subscription.status,
      short_url: subscription.short_url,
    });
  } catch (err) {
    console.error('Subscription Error:', err);
    return Response.json({ error: 'Subscription creation failed', details: err }, { status: 500 });
  }
}

import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function GET(req, { params }) {
  const { subscriptionId } = params;

  try {
    const subscription = await razorpay.subscriptions.fetch(subscriptionId);

    return Response.json({
      status: subscription.status, // active | paused | cancelled
      plan_id: subscription.plan_id,
      customer_email: subscription.customer_email,
      start_at: subscription.start_at,
      current_start: subscription.current_start,
      current_end: subscription.current_end,
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return Response.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}

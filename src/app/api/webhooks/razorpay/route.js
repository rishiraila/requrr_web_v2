import crypto from 'crypto';
import { db } from '../../../../db';

export async function POST(req) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const body = await req.text(); // must use raw text, not json
  const receivedSignature = req.headers.get('x-razorpay-signature');

  // Validate signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (receivedSignature !== expectedSignature) {
    return new Response('Invalid signature', { status: 400 });
  }

  const event = JSON.parse(body);

  // ✅ Handle subscription events
  switch (event.event) {
    case 'subscription.activated':
      // Example: update user subscription status
      const subscriptionId = event.payload.subscription.entity.id;
      const customerEmail = event.payload.subscription.entity.customer_email;

      // Update your user DB if you store subscriptions
      await db.query(
        'UPDATE users SET subscription_id = ?, subscription_status = ? WHERE email = ?',
        [subscriptionId, 'active', customerEmail]
      );

      break;

    case 'subscription.halted':
    case 'subscription.cancelled':
      // Mark as inactive/paused
      break;

    // Handle invoice.paid, invoice.failed, etc. if needed
  }

  return new Response('Webhook received', { status: 200 });
}

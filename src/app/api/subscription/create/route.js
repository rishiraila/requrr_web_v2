import Razorpay from 'razorpay';
import { authenticate } from '../../../../middleware/auth';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const user = authenticate(req);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, currency, receipt } = await req.json();

    if (!amount) {
      return Response.json({ error: 'Amount is required' }, { status: 400 });
    }

    // Create a Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1, // Auto-capture after payment
    });

    return Response.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error('Payment Order Error:', err);
    return Response.json({ 
      error: 'Failed to create payment order', 
      details: err.message || 'Internal server error' 
    }, { status: 500 });
  }
}

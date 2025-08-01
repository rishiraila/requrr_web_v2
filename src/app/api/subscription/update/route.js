import { db } from "../../../../db";
import { authenticate } from "../../../../middleware/auth";

export async function POST(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { planId, razorpay_subscription_id, razorpay_payment_id, final_price } = await req.json();

  try {
    // Upsert subscription record in subscriptions table
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear() + 1);

    // Check if subscription exists
    const [existingSubs] = await db.query(
      "SELECT id FROM subscriptions WHERE user_id = ?",
      [user.id]
    );

    if (existingSubs.length > 0) {
      // Update existing subscription
      await db.query(
        "UPDATE subscriptions SET plan_id = ?, start_date = ?, end_date = ? WHERE user_id = ?",
        [planId, startDate, endDate, user.id]
      );
    } else {
      // Insert new subscription
      await db.query(
        "INSERT INTO subscriptions (user_id, plan_id, start_date, end_date) VALUES (?, ?, ?, ?)",
        [user.id, planId, startDate, endDate]
      );
    }

    // Insert transaction record with final_price
    await db.query(
      `INSERT INTO transactions 
      (user_id, plan_id, razorpay_payment_id, final_price, status, created_at) 
      VALUES (?, ?, ?, ?, 'success', NOW())`,
      [user.id, planId, razorpay_payment_id, final_price]
    );

    return Response.json({ message: "Plan and transaction updated successfully" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to update subscription and transaction" }, { status: 500 });
  }
}

import crypto from "crypto";
import jwt from "jsonwebtoken";
import { db } from "../../../../db";

export async function POST(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  let user;
  try {
    user = jwt.verify(token, "your_secret_key"); // ✅ SAME SECRET EVERYWHERE
  } catch {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    credits,
    final_price,
    currency = "INR",
  } = await req.json();

  if (!credits || !final_price) {
    return Response.json({ error: "Missing payment data" }, { status: 400 });
  }

  // 🔐 Verify Razorpay signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // 1️⃣ Update WhatsApp credits
    await conn.execute(
      `
      INSERT INTO whatsapp_credits (user_id, total_credits, used_credits, remaining_credits)
      VALUES (?, ?, 0, ?)
      ON DUPLICATE KEY UPDATE
        total_credits = total_credits + VALUES(total_credits),
        remaining_credits = remaining_credits + VALUES(remaining_credits)
      `,
      [user.id, credits, credits]
    );

    // 2️⃣ Track transaction (JUST LIKE subscriptions)
    await conn.execute(
      `
      INSERT INTO whatsapp_credit_transactions
      (
        user_id,
        credits_added,
        amount,
        currency,
        razorpay_order_id,
        razorpay_payment_id,
        status,
        message
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user.id,
        credits,
        final_price,
        currency,
        razorpay_order_id,
        razorpay_payment_id,
        "success",
        "WhatsApp credit purchase successful",
      ]
    );

    await conn.commit();

    return Response.json({
      message: "WhatsApp credits added successfully",
      credits_added: credits,
    });
  } catch (err) {
    await conn.rollback();
    console.error("[WHATSAPP VERIFY ERROR]", err);
    return Response.json(
      { error: "DB update failed: " + err.message },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}

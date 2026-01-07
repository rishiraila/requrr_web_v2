import { NextResponse } from "next/server";
import { db } from "../../../../db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  let user;
  try {
    user = jwt.verify(token, "your_secret_key");
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { credits, amount, currency } = await req.json();

  await db.execute(
    `INSERT INTO whatsapp_credits (user_id, total_credits, used_credits, remaining_credits)
   VALUES (?, ?, 0, ?)
   ON DUPLICATE KEY UPDATE
     total_credits = total_credits + VALUES(total_credits),
     remaining_credits = remaining_credits + VALUES(remaining_credits)`,
    [user.id, credits, credits]
  );

  await db.execute(
    `INSERT INTO whatsapp_credit_transactions
     (user_id, credits_added, amount, currency)
     VALUES (?, ?, ?, ?)`,
    [user.id, credits, amount, currency]
  );

  return NextResponse.json({ success: true });
}

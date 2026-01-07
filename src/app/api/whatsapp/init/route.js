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


  await db.execute(
    `INSERT IGNORE INTO whatsapp_credits (user_id, total_credits, used_credits, remaining_credits)
     VALUES (?, 0, 0, 0)`,
    [user.id]
  );

  return NextResponse.json({ success: true });
}

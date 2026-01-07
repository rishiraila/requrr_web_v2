import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "../../../../db";

export async function GET() {
  const [rows] = await db.execute(
    "SELECT * FROM whatsapp_credit_pricing"
  );
  return NextResponse.json(rows);
}

export async function POST(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  let user;

  try {
    user = jwt.verify(token, "your_secret_key");
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { credits, price_inr, price_usd } = await req.json();

  await db.execute(
    `INSERT INTO whatsapp_credit_pricing (credits, price_inr, price_usd, active)
     VALUES (?, ?, ?, 1)`,
    [credits, price_inr, price_usd]
  );

  return NextResponse.json({ success: true });
}

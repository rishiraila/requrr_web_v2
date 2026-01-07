import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "../../../../../db";

export async function PUT(req, { params }) {
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

  const { id } = await params;
  const { credits, price_inr, price_usd, active } = await req.json();

  if (id === undefined) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  await db.execute(
    `UPDATE whatsapp_credit_pricing
     SET credits = ?, price_inr = ?, price_usd = ?, active = ?
     WHERE id = ?`,
    [credits ?? null, price_inr ?? null, price_usd ?? null, active ?? null, id]
  );

  return NextResponse.json({ success: true });
}

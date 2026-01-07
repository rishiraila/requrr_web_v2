import { NextResponse } from "next/server";
import { db } from "../../../../db";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user;
  try {
    user = jwt.verify(token, "your_secret_key");
  } catch {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  const [rows] = await db.query(`
    SELECT
      wc.total_credits,
      wc.used_credits,
      wc.remaining_credits
    FROM whatsapp_credits wc
    WHERE wc.user_id = ?
  `, [user.id]);

  if (rows.length === 0) {
    return Response.json({ total_credits: 0, used_credits: 0, remaining_credits: 0 });
  }

  return Response.json(rows[0]);
}

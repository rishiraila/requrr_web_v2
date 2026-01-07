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

  if (user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const [rows] = await db.query(`
    SELECT
      wc.user_id,
      u.email,
      wc.total_credits,
      wc.used_credits,
      wc.remaining_credits
    FROM whatsapp_credits wc
    JOIN users u ON u.id = wc.user_id
    ORDER BY wc.remaining_credits DESC
  `);

  return Response.json(rows);
}

import jwt from "jsonwebtoken";
import { db } from "../../../../db";

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
      t.id,
      u.email,
      t.credits_added,
      t.amount,
      t.currency,
      t.status,
      t.created_at
    FROM whatsapp_credit_transactions t
    JOIN users u ON u.id = t.user_id
    ORDER BY t.created_at DESC
  `);

  return Response.json(rows);
}

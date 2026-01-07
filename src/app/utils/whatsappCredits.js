import { db } from "../../db";

export async function checkAndDeductWhatsAppCredit(userId, count = 1) {
  const [rows] = await db.execute(
    "SELECT remaining_credits FROM whatsapp_credits WHERE user_id = ?",
    [userId]
  );

  if (!rows.length || rows[0].remaining_credits < count) {
    throw new Error("WHATSAPP_CREDITS_EXHAUSTED");
  }

  await db.execute(
    `UPDATE whatsapp_credits
     SET used_credits = used_credits + ?,
         remaining_credits = remaining_credits - ?
     WHERE user_id = ?`,
    [count, count, userId]
  );
}

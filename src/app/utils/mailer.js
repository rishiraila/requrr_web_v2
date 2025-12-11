// import nodemailer from 'nodemailer';

// export const sendEmail = async ({ to, subject, text, html }) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'rishiraila007@gmail.com', // change
//       pass: 'uyxtftizhjqzsvoc',    // change
//     }
//   });


//   const mailOptions = {
//     from: '"Requrr Team" <devshreyas21@gmail.com>',
//     to,
//     subject,
//     text: text || '',
//     html: html || ''
//   };

//   return transporter.sendMail(mailOptions);
// };
import axios from "axios";

/**
 * Unified MSG91 Email Sender
 *
 * Supports:
 *  - Template sending (templateId + templateVariables)
 *  - Raw HTML sending (subject + html)
 *
 * Usage:
 * sendEmail({
 *   to: { email: "user@mail.com", name: "User" },
 *   templateId: "renewal_reminder_v1",
 *   templateVariables: { ... }
 * })
 */

const MSG91_URL = "https://control.msg91.com/api/v5/email/send";

function normalizeToList(to) {
  const arr = Array.isArray(to) ? to : [to];
  return arr
    .map((t) => {
      if (!t) return null;
      if (typeof t === "string") return { email: t };
      return { email: t.email, name: t.name };
    })
    .filter(Boolean);
}

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  templateId,
  templateVariables,
}) => {
  if (!process.env.MSG91_AUTH_KEY) {
    throw new Error("MSG91_AUTH_KEY missing");
  }

  const authKey = process.env.MSG91_AUTH_KEY;
  const fromEmail =
    process.env.MSG91_FROM_EMAIL ||
    `noreply@${process.env.MSG91_DOMAIN || "mail.requrr.com"}`;
  const fromName = process.env.MSG91_FROM_NAME || "Requrr Team";
  const domain = process.env.MSG91_DOMAIN || "mail.requrr.com";

  const toList = normalizeToList(to);
  if (!toList.length) throw new Error("Recipient missing in sendEmail");

  let payload;

  /** ---------------------------
   * TEMPLATE MODE
   * --------------------------- */
  if (templateId) {
    payload = {
      recipients: [
        {
          to: toList,
          variables: templateVariables || {},
        },
      ],
      from: { email: fromEmail, name: fromName },
      domain,
      template_id: templateId,
    };
  }

  /** ---------------------------
   * RAW HTML MODE
   * --------------------------- */
  else {
    payload = {
      recipients: [{ to: toList }],
      from: { email: fromEmail, name: fromName },
      domain,
      subject,
      content: [{ type: "html", value: html || text || "" }],
    };
  }

  try {
    const res = await axios.post(MSG91_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        authkey: authKey,
      },
    });

    return res.data;
  } catch (err) {
    console.error("MSG91 ERROR:", err.response?.data || err.message);
    throw new Error(
      "MSG91 email sending failed: " + JSON.stringify(err.response?.data)
    );
  }
};

export default sendEmail;

// app/api/test-email/route.js
import { NextResponse } from 'next/server';
import { sendEmail } from '../../utils/mailer';

export async function GET() {
  try {
    await sendEmail({
      to: 'rishiraila2305@gmail.com',
      subject: 'Test Email from REQURR App',
      text: 'This is a successful test email sent from the REQURR cron job setup.',
    });

    return NextResponse.json({ status: '✅ Email sent!' });
  } catch (err) {
    console.error('❌ Failed to send test email:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

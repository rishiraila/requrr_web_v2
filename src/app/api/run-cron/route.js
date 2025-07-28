import { sendEmail } from '../../utils/mailer'; // adjust path if needed

await sendEmail({
  to: 'rishiraila2305@gmail.com',
  subject: '✅ Test Email from REQURR',
  text: 'This is a test email sent via your cron email system.',
});

import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rishiraila007@gmail.com', // change
      pass: 'uyxtftizhjqzsvoc',    // change
    }
  });

  const mailOptions = {
    from: '"Requrr Team" <devshreyas21@gmail.com>',
    to,
    subject,
    text: text || '',
    html: html || ''
  };

  return transporter.sendMail(mailOptions);
};

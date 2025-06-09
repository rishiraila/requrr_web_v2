import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'devshreyas21@gmail.com', // change
      pass: 'ueluvpytkbirtebf',    // change
    }
  });

  const mailOptions = {
    from: '"My Service App" <devshreyas21@gmail.com>',
    to,
    subject,
    text
  };

  return transporter.sendMail(mailOptions);
};

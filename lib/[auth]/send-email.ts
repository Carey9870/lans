// utils/sendEmail.ts
import nodemailer from 'nodemailer';

export async function sendEmail(to: string, otp: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}. It expires in 90 seconds.`,
    html: `<p>Your OTP is: <strong>${otp}</strong>. It expires in 90 seconds.</p>`,
  });
}
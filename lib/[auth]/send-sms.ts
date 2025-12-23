// utils/sendSMS.ts
import twilio from 'twilio';

export async function sendSMS(to: string, otp: string): Promise<void> {
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  const internationalPhone = `+254${to.slice(1)}`;  // Assuming Kenyan numbers starting with 07 -> +2547...

  await client.messages.create({
    body: `Your OTP is: ${otp}. It expires in 90 seconds.`,
    from: process.env.TWILIO_FROM,
    to: internationalPhone,
  });
}


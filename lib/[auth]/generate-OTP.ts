// utils/generateOTP.ts
export function generateOTP(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let otp = '';
  for (let i = 0; i < 7; i++) {
    otp += chars[Math.floor(Math.random() * chars.length)];
  }
  return otp;
}


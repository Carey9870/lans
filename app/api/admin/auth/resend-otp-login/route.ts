// app/api/admin/resend-otp-login/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth-api-verification'; 
import { generateOTP } from '@/lib/[auth]/generate-OTP';
import { sendEmail } from '@/lib/[auth]/send-email'; 
import { sendSMS } from '@/lib/[auth]/send-sms';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  // Auth check first
  const auth = await verifyAdminAuth(req);
  if (!auth.success) {
    return unauthorizedResponse(auth.error!);
  }
  
  try {
    const body = await req.json();
    const { email } = body;

    // Find admin
    const adminRes = await pool.query(
      'SELECT id, phone FROM admins WHERE email = $1 AND is_verified = TRUE',
      [email]
    );
    if (adminRes.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid' }, { status: 400 });
    }
    const { id: adminId, phone } = adminRes.rows[0];

    // Check if current OTP expired
    const otpRes = await pool.query(
      `SELECT id FROM otps WHERE admin_id = $1 AND type = 'login' AND expires_at > CURRENT_TIMESTAMP`,
      [adminId]
    );
    if (otpRes.rows.length > 0) {
      return NextResponse.json({ error: 'Current OTP not expired' }, { status: 400 });
    }

    // Delete old
    await pool.query('DELETE FROM otps WHERE admin_id = $1 AND type = $2', [adminId, 'login']);

    // New OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 90 * 1000);

    await pool.query(
      `INSERT INTO otps (admin_id, otp, type, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [adminId, otp, 'login', expiresAt]
    );

    await Promise.all([sendEmail(email, otp), sendSMS(phone, otp)]);

    return NextResponse.json({ success: true, message: 'New OTP sent' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


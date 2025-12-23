// app/api/admin/verify-registration/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    // Find admin
    const adminRes = await pool.query(
      'SELECT id FROM admins WHERE email = $1 AND is_verified = FALSE',
      [email]
    );
    if (adminRes.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid or already verified' }, { status: 400 });
    }
    const adminId = adminRes.rows[0].id;

    // Check OTP
    const otpRes = await pool.query(
      `SELECT id FROM otps WHERE admin_id = $1 AND otp = $2 AND type = 'registration' AND expires_at > CURRENT_TIMESTAMP`,
      [adminId, otp]
    );
    if (otpRes.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Verify
    await pool.query('UPDATE admins SET is_verified = TRUE WHERE id = $1', [adminId]);
    await pool.query('DELETE FROM otps WHERE admin_id = $1 AND type = $2', [adminId, 'registration']);

    return NextResponse.json({ success: true, message: 'Registration complete' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
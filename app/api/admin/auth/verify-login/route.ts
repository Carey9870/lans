// app/api/admin/verify-login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    // Find admin
    const adminRes = await pool.query(
      'SELECT id FROM admins WHERE email = $1 AND is_verified = TRUE',
      [email]
    );
    if (adminRes.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid' }, { status: 400 });
    }
    const adminId = adminRes.rows[0].id;

    // Check OTP
    const otpRes = await pool.query(
      `SELECT id FROM otps WHERE admin_id = $1 AND otp = $2 AND type = 'login' AND expires_at > CURRENT_TIMESTAMP`,
      [adminId, otp]
    );
    if (otpRes.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Clean up
    await pool.query('DELETE FROM otps WHERE admin_id = $1 AND type = $2', [adminId, 'login']);

    // Generate JWT
    const token = jwt.sign({ adminId }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    const response = NextResponse.json({ success: true, message: 'Login successful' });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
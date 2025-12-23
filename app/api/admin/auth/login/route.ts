// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import { generateOTP } from '@/lib/[auth]/generate-OTP';
import { sendEmail } from '@/lib/[auth]/send-email';
import { sendSMS } from '@/lib/[auth]/send-sms';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, password } = body;

    // Find admin
    const adminRes = await pool.query(
      `SELECT id, password_hash, phone AS db_phone, email AS db_email FROM admins 
       WHERE first_name = $1 AND last_name = $2 AND email = $3 AND phone = $4 AND is_verified = TRUE`,
      [firstName, lastName, email, phone]
    );
    if (adminRes.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }
    const { id: adminId, password_hash } = adminRes.rows[0];

    const match = await bcrypt.compare(password, password_hash);
    if (!match) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 90 * 1000);

    await pool.query(
      `INSERT INTO otps (admin_id, otp, type, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [adminId, otp, 'login', expiresAt]
    );

    // Send
    await Promise.all([sendEmail(email, otp), sendSMS(phone, otp)]);

    return NextResponse.json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
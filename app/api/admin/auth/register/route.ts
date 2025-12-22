// app/api/admin/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import { generateOTP } from '@/lib/[auth]/generate-OTP';
import { sendEmail } from '@/lib/[auth]/send-email';
import { sendSMS } from '@/lib/[auth]/send-sms';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, middleName, lastName, phone, altPhone, email, password, confirmPassword } = body;

    // Server-side validation (though client has Zod, double-check)
    if (!firstName || !lastName || !phone || !email || !password || password !== confirmPassword) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    if (!phone.startsWith('07') || phone.length !== 10 || !/^\d+$/.test(phone.slice(2))) {
      return NextResponse.json({ error: 'Phone must start with 07 and be 10 digits' }, { status: 400 });
    }
    if (!email.endsWith('@gmail.com')) {
      return NextResponse.json({ error: 'Email must be a gmail.com address' }, { status: 400 });
    }

    // Check if email or phone exists
    const existing = await pool.query(
      'SELECT id FROM admins WHERE email = $1 OR phone = $2',
      [email, phone]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Email or phone already registered' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create admin with is_verified = false
    const result = await pool.query(
      `INSERT INTO admins (first_name, middle_name, last_name, phone, alt_phone, email, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [firstName, middleName || null, lastName, phone, altPhone || null, email, passwordHash]
    );
    const adminId = result.rows[0].id;

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 90 * 1000);

    await pool.query(
      `INSERT INTO otps (admin_id, otp, type, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [adminId, otp, 'registration', expiresAt]
    );

    // Send OTP
    await Promise.all([sendEmail(email, otp), sendSMS(phone, otp)]);

    return NextResponse.json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
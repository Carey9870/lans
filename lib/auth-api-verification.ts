// lib/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function verifyAdminAuth(req: NextRequest): Promise<{ success: boolean; error?: string; adminId?: number }> {
  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    return { success: false, error: 'No auth token provided' };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { adminId: number };
    return { success: true, adminId: decoded.adminId };
  } catch (error) {
    return { success: false, error: 'Invalid or expired token' };
  }
}

export function unauthorizedResponse(error: string): NextResponse {
  return NextResponse.json({ error }, { status: 401 });
}

/*
  Another way:

  1. Step 1: Create middleware.ts (or middleware.js) in the Project Root
      -> This file runs before any API request. It checks for the auth_token cookie, verifies the JWT, and blocks access if invalid.

// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Your JWT secret (same as in /api/admin/verify-login)
const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(request: NextRequest) {
  // Only protect admin API routes (e.g., /api/admin/*)
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    // Get the auth token from cookies
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      // No token: Block access
      return NextResponse.json(
        { success: false, message: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    try {
      // Verify the JWT
      jwt.verify(token, JWT_SECRET);
      // Token is valid: Allow the request to proceed
      return NextResponse.next();
    } catch (error) {
      // Invalid or expired token: Block access
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Invalid or expired token' },
        { status: 401 }
      );
    }
  }

  // For non-admin API routes, proceed normally
  return NextResponse.next();
}

// Apply middleware ONLY to admin API routes
export const config = {
  matcher: '/api/admin/:path*',
};

       2. Step 2: Add Environment Variable
          -> In your .env.local (or .env), ensure you have:

          JWT_SECRET=your-super-secret-key-here  # Same as in /api/admin/verify-login

        3. Optional Enhancements
            -> Logout Endpoint: Add /api/admin/logout to clear the cookie:

            // app/api/admin/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('auth_token');
  return response;
}

      4. Frontend Handling: In your admin dashboard, catch 401 errors and redirect to login:

      // Example in a client component
const fetchServices = async () => {
  const res = await fetch('/api/admin/services');
  if (res.status === 401) {
    // Redirect to login
    window.location.href = '/admin/login';
  }
  // Handle success
};

  5. Rate Limiting: Add to middleware for extra security:
        // In middleware.ts
        import rateLimit from 'express-rate-limit'; // npm install express-rate-limit
// ... (integrate with Next.js if needed)
*/








      //-------------

/*

How it is used:

// app/api/admin/services/route.ts
import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET(req: NextRequest) {
  // Auth check first
  const auth = await verifyAdminAuth(req);
  if (!auth.success) {
    return unauthorizedResponse(auth.error!);
  }

  // Your original GET logic
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT
        c.id, c.title, c.slug,
        COALESCE(json_agg(
          json_build_object('id', si.id, 'number', si.number, 'title', si.title, 'description', si.description)
          ORDER BY si.number
        ) FILTER (WHERE si.id IS NOT NULL), '[]') as items
      FROM categories c
      LEFT JOIN service_items si ON si.category_id = c.id
      GROUP BY c.id, c.title, c.slug
      ORDER BY c.id
    `);
    return NextResponse.json(
      res.rows.map((row) => ({
        ...row,
        items: row.items || [],
      }))
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(req: NextRequest) {
  // Auth check first
  const auth = await verifyAdminAuth(req);
  if (!auth.success) {
    return unauthorizedResponse(auth.error!);
  }

  // Your original POST logic
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { title, items } = await req.json();
    if (!title || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
    const baseSlug = slugify(title);
    // ... (rest of your POST code unchanged)
    await client.query('COMMIT');
    return NextResponse.json({
      success: true,
      message:
        existingCat.rows.length > 0
          ? 'Services added to existing category!'
          : 'New category & services created!',
      categorySlug: finalSlug,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    await client.query('ROLLBACK');
    console.error('API Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    client.release();
  }
}


*/
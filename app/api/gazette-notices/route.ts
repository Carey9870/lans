// app/api/gazette-notices/route.ts
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  let sql = `
    SELECT 
      n.*,
      COALESCE(json_agg(r ORDER BY r.display_order) FILTER (WHERE r.id IS NOT NULL), '[]') as resources
    FROM gazette_notices n
    LEFT JOIN gazette_resources r ON r.notice_id = n.id
  `;

  const params: any[] = [];

  if (search) {
    sql += ` WHERE n.title ILIKE $1 OR n.slug ILIKE $1`;
    params.push(`%${search}%`);
  }

  sql += ` GROUP BY n.id ORDER BY n.created_at DESC`;

  const res = await query(sql, params);
  return NextResponse.json(res.rows);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, content = '', resources = [] } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .replace(/-+/g, '-'); // prevent double dashes

  // Avoid duplicate slugs (optional but recommended)
  const slugSuffix = slug ? `-${Date.now()}` : Date.now();
  const finalSlug = slug || `notice-${slugSuffix}`;

  const res = await query(
    `INSERT INTO gazette_notices (title, slug, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title.trim(), finalSlug, content]
  );

  const notice = res.rows[0];

  // Insert resources if any
  if (resources.length > 0) {
    for (const [index, r] of resources.entries()) {
      await query(
        `INSERT INTO gazette_resources 
         (notice_id, type, filename, original_name, url, display_order)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [notice.id, r.type, r.filename, r.originalName, r.url, index]
      );
    }
  }

  // Always return full notice with resources
  const fullNotice = await query(
    `SELECT 
       n.*,
       COALESCE(json_agg(r ORDER BY r.display_order) FILTER (WHERE r.id IS NOT NULL), '[]') as resources
     FROM gazette_notices n
     LEFT JOIN gazette_resources r ON r.notice_id = n.id
     WHERE n.id = $1
     GROUP BY n.id`,
    [notice.id]
  );

  return NextResponse.json(fullNotice.rows[0]);
}
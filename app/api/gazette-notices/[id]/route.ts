// app/api/gazette-notices/[id]/route.ts
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Next.js 16 requires await
  const res = await query(
    `SELECT n.*, json_agg(r ORDER BY r.display_order) as resources
     FROM gazette_notices n
     LEFT JOIN gazette_resources r ON r.notice_id = n.id
     WHERE n.id = $1
     GROUP BY n.id`,
    [id]
  );

  if (res.rowCount === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(res.rows[0]);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { title, content, resources } = body;

  await query('UPDATE gazette_notices SET title = $1, content = $2 WHERE id = $3', [
    title,
    content,
    id,
  ]);

  // Clear old resources
  await query('DELETE FROM gazette_resources WHERE notice_id = $1', [id]);

  // Insert new ones
  for (const [index, r] of resources.entries()) {
    await query(
      `INSERT INTO gazette_resources (notice_id, type, filename, original_name, url, display_order)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, r.type, r.filename, r.originalName, r.url, index]
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await query('DELETE FROM gazette_notices WHERE id = $1', [id]);
  return NextResponse.json({ success: true });
}


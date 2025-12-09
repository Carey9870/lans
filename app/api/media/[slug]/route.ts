import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Add this inside app/media-center/[slug]/page.tsx
export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/media?limit=100`);
  const data = await res.json();
  return data.data?.map((item: any) => ({
    slug: item.slug,
  })) || [];
}

export async function GET({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const itemRes = await query('SELECT * FROM media_items WHERE slug = $1', [slug]);
  if (itemRes.rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const item = itemRes.rows[0];

  const filesRes = await query(
    'SELECT file_path, type FROM media_files WHERE media_item_id = $1 ORDER BY "order" ASC',
    [item.id]
  );
  const files = filesRes.rows;

  return NextResponse.json({ item, files });
}


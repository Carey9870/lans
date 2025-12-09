// import { NextResponse } from 'next/server';
// import { query } from '@/lib/db';

// // Add this inside app/media-center/[slug]/page.tsx
// export async function generateStaticParams() {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/media?limit=100`);
//   const data = await res.json();
//   return data.data?.map((item: any) => ({
//     slug: item.slug,
//   })) || [];
// }

// export async function GET({ params }: { params: { slug: string } }) {
//   const { slug } = params;

//   const itemRes = await query('SELECT * FROM media_items WHERE slug = $1', [slug]);
//   if (itemRes.rows.length === 0) {
//     return NextResponse.json({ error: 'Not found' }, { status: 404 });
//   }
//   const item = itemRes.rows[0];

//   const filesRes = await query(
//     'SELECT file_path, type FROM media_files WHERE media_item_id = $1 ORDER BY "order" ASC',
//     [item.id]
//   );
//   const files = filesRes.rows;

//   return NextResponse.json({ item, files });
// }

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// For page pre-rendering
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/media?limit=100`);
    const data = await res.json();

    // return empty array if no data
    return data?.data?.map((item: any) => ({
      slug: item.slug,
    })) || [];
  } catch (err) {
    console.error('generateStaticParams error:', err);
    return [];
  }
}

// API handler
export async function GET({ params }: { params?: { slug?: string } }) {
  const slug = params?.slug;
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  try {
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
  } catch (err) {
    console.error('GET /api/media/[slug] error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

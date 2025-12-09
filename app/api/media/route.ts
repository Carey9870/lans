import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

import { query } from '@/lib/db';

function toSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // 1. Just get total count
  if (searchParams.has('count')) {
    const res = await query('SELECT COUNT(*) FROM media_items');
    const total = parseInt(res.rows[0].count, 10);
    return NextResponse.json({ total });
  }

  // 2. Normal pagination (for /media-center page)
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '8', 10);
  const offset = (page - 1) * limit;

  // 3. Check if we need to include files (for homepage)
  const includeFiles = searchParams.has('include_files');

  // Fetch main items
  const dataRes = await query(
    `SELECT id, title, slug, date, preview_image 
     FROM media_items 
     ORDER BY date DESC 
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  const items = dataRes.rows;

  // Get total count for pagination
  const countRes = await query('SELECT COUNT(*) FROM media_items');
  const total = parseInt(countRes.rows[0].count, 10);

  // Only fetch files when requested (homepage uses this)
  if (includeFiles) {
    for (const item of items) {
      const filesRes = await query(
        `SELECT file_path, type 
         FROM media_files 
         WHERE media_item_id = $1 
         ORDER BY "order" ASC`,
        [item.id]
      );
      item.files = filesRes.rows; // This is what your NewsEventsSection expects
    }
  }

  return NextResponse.json({
    data: items,
    total,
    page,
    limit,
    hasMore: offset + limit < total,
  });
}

// Optional: Keep your POST if you have it
// export async function POST(...) { ... }

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams;
//   if (searchParams.has('count')) {
//     const res = await query('SELECT COUNT(*) FROM media_items');
//     const total = parseInt(res.rows[0].count);
//     return NextResponse.json({ total });
//   }

//   const page = parseInt(searchParams.get('page') || '1');
//   const limit = parseInt(searchParams.get('limit') || '8');
//   const offset = (page - 1) * limit;

//   const countRes = await query('SELECT COUNT(*) FROM media_items');
//   const total = parseInt(countRes.rows[0].count);

//   const dataRes = await query(
//     'SELECT * FROM media_items ORDER BY date DESC LIMIT $1 OFFSET $2',
//     [limit, offset]
//   );

//   return NextResponse.json({
//     data: dataRes.rows,
//     total,
//     page,
//     limit,
//   });
// }

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const subtitle = (formData.get('subtitle') as string) || null; // ← ADDED
  const story = formData.get('story') as string;
  const dateStr = formData.get('date') as string;
  const files = formData.getAll('files') as File[];

  if (!title || !dateStr || files.length === 0) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const images = files.filter((f) => f.type.startsWith('image/'));
  const videos = files.filter((f) => f.type.startsWith('video/'));

  if (images.length === 0) {
    return NextResponse.json({ error: 'At least one image required' }, { status: 400 });
  }
  if (images.length > 6 || videos.length > 6) {
    return NextResponse.json({ error: 'Max 6 images and 6 videos' }, { status: 400 });
  }

  const date = new Date(dateStr);

  const baseSlug = toSlug(title);
  let slug = baseSlug;
  let i = 1;
  while (true) {
    const checkRes = await query('SELECT id FROM media_items WHERE slug = $1', [slug]);
    if (checkRes.rows.length === 0) break;
    slug = `${baseSlug}-${i++}`;
  }

  // ← INSERT NOW INCLUDES subtitle
  const insertRes = await query(
    `INSERT INTO media_items (title, subtitle, slug, story, date) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id`,
    [title, subtitle, slug, story || null, date]
  );

  const newId = insertRes.rows[0].id;

  const uploadDir = path.join(process.cwd(), 'public/media', newId.toString());
  await fs.mkdir(uploadDir, { recursive: true });

  const firstImage = images[0];
  const firstImageExt = path.extname(firstImage.name);
  const firstImageFilename = `preview${firstImageExt}`;
  const firstImageBuffer = Buffer.from(await firstImage.arrayBuffer());
  const firstImagePath = `/media/${newId}/${firstImageFilename}`;
  await fs.writeFile(path.join(uploadDir, firstImageFilename), firstImageBuffer);

  await query('UPDATE media_items SET preview_image = $1 WHERE id = $2', [firstImagePath, newId]);

  for (let ord = 0; ord < files.length; ord++) {
    const file = files[ord];
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${randomUUID()}${path.extname(file.name)}`;
    const filePath = `/media/${newId}/${filename}`;
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    const type = file.type.startsWith('image/') ? 'image' : 'video';
    await query(
      'INSERT INTO media_files (media_item_id, file_path, type, "order") VALUES ($1, $2, $3, $4)',
      [newId, filePath, type, ord]
    );
  }

  return NextResponse.json({ success: true, slug });
}
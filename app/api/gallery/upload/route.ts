// app/api/gallery/upload/route.ts
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll('files') as File[];

  if (files.length === 0) {
    return new Response('No files uploaded', { status: 400 });
  }

  // Define paths
  const uploadDir = join(process.cwd(), 'public/uploads/gallery');
  const thumbDir = join(process.cwd(), 'public/uploads/gallery/thumbs');

  // Create folders if they don't exist
  await mkdir(uploadDir, { recursive: true });
  await mkdir(thumbDir, { recursive: true });

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filepath = join(uploadDir, filename);

    // Save original file
    await writeFile(filepath, buffer);

    const url = `/uploads/gallery/${filename}`;
    let thumbnailUrl: string | null = null;

    // Generate thumbnail for images
    if (file.type.startsWith('image/')) {
      const thumbBuffer = await sharp(buffer)
        .resize(400, 400, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer();

      const thumbName = `thumb-${uuidv4()}.jpg`;
      const thumbPath = join(thumbDir, thumbName);
      await writeFile(thumbPath, thumbBuffer);

      thumbnailUrl = `/uploads/gallery/thumbs/${thumbName}`;
    }

    // Get shared text/subtext (same for all files)
    const text = (formData.get('text') as string) || null;
    ;
    const subtext = (formData.get('subtext') as string) || null;

    // Get next order
    const orderRes = await query(`SELECT COALESCE(MAX("order"), -1) + 1 AS next FROM gallery_media`);
    const order = orderRes.rows[0].next;

    // Insert into DB
    await query(
      `INSERT INTO gallery_media 
       (type, title, text, subtext, file_path, thumbnail_path, "order")
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE',
        file.name.split('.').slice(0, -1).join('.'),
        text,
        subtext,
        url,
        thumbnailUrl,
        order,
      ]
    );
  }

  revalidatePath('/management-and-leadership');
  revalidatePath('/admin/gallery');

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
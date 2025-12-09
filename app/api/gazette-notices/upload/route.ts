// app/api/gazette-notices/upload/route.ts
import { writeFile } from 'fs/promises';
import { NextRequest } from 'next/server';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/gazette-notices');

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    await writeFile(filepath, buffer);

    const url = `/uploads/gazette-notices/${filename}`;

    return Response.json({
      success: true,
      url,
      filename,
      originalName: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'document',
    });
  } catch (error) {
    console.log(error);
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}


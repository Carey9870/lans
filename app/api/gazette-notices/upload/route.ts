// app/api/gazette-notices/upload/route.ts

import { writeFile } from 'fs/promises';
import { NextRequest } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

// Define upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/gazette-notices');

// Helper to ensure directory exists
async function ensureDirectoryExists(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    // Ignore if directory already exists
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Ensure the full directory path exists
    await ensureDirectoryExists(UPLOAD_DIR);

    const filepath = path.join(UPLOAD_DIR, filename);

    // Now safe to write
    await writeFile(filepath, buffer);

    const url = `/uploads/gazette-notices/${filename}`;

    return Response.json({
      success: true,
      url,
      filename,
      originalName: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'document',
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return Response.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    );
  }
}
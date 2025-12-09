// lib/upload.ts
import fs from "fs";
import path from "path";

export async function uploadFile(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filepath = path.join(process.cwd(), "public", "uploads", "tenders", filename);

  // Ensure directory exists
  if (!fs.existsSync(path.dirname(filepath))) {
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
  }

  fs.writeFileSync(filepath, buffer);

  // This is the key: store with leading slash so it's a proper public URL
  return {
    path: `/uploads/tenders/${filename}`, // ← This is correct
    size: file.size,
    originalName: file.name,
    mimeType: file.type,
  };
}


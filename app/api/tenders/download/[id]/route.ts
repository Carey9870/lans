// app/api/tenders/download/[id]/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import pool from "@/lib/db";

async function getId(params: Promise<{ id: string }>) {
  const { id } = await params;
  if (!id || isNaN(Number(id))) throw new Error("Invalid ID");
  return Number(id);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await getId(params);

    const result = await pool.query(
      `SELECT document_path, document_name, document_mime_type 
       FROM tenders 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0 || !result.rows[0].document_path) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const { document_path, document_name, document_mime_type } = result.rows[0];

    const filePath = document_path.replace(/^\/+/, ""); // Remove all leading slashes
    const absolutePath = path.join(process.cwd(), "public", filePath);

    if (!fs.existsSync(absolutePath)) {
      console.error("File not found on disk:", absolutePath);
      return NextResponse.json({ error: "File missing on server" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(absolutePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": document_mime_type || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          document_name || "download"
        )}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error("Download error:", err);
    return NextResponse.json(
      { error: err.message || "Download failed" },
      { status: 500 }
    );
  }
}


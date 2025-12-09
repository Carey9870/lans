// app/api/admin/resources/[id]/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const fallbackContent = formData.get("fallbackContent") as string;
  const file = formData.get("pdf") as File | null;

  let pdfFilename: string | null = formData.get("existingPdf") as string;
  if (!pdfFilename) pdfFilename = null;

  if (file) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${slug}.pdf`;
    const filepath = path.join(process.cwd(), "public", "resources", filename);

    await mkdir(path.dirname(filepath), { recursive: true });
    await writeFile(filepath, buffer);
    pdfFilename = filename;
  }

  try {
    const client = await pool.connect();
    await client.query(
      `UPDATE resources 
       SET title = $1, slug = $2, pdf_filename = $3, fallback_content = $4
       WHERE id = $5`,
      [title, slug, pdfFilename, fallbackContent, params.id]
    );
    client.release();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

  // - 2

// app/api/admin/resources/[id]/route.ts


export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }  // ← params is now a Promise!
) {
  // CORRECT WAY: await params
  const { id } = await context.params;

  const resourceId = parseInt(id, 10);

  // Validate ID
  if (isNaN(resourceId)) {
    return NextResponse.json({ error: "Invalid resource ID" }, { status: 400 });
  }

  let client;
  try {
    client = await pool.connect();

    // Get PDF filename before deleting
    const result = await client.query(
      `SELECT pdf_filename FROM resources WHERE id = $1`,
      [resourceId]
    );

    if (result.rowCount === 0) {
      client.release();
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    const pdfFilename = result.rows[0].pdf_filename;

    // Delete from database
    await client.query(`DELETE FROM resources WHERE id = $1`, [resourceId]);

    // Delete physical PDF file if exists
    if (pdfFilename) {
      const filepath = path.join(process.cwd(), "public", "resources", pdfFilename);
      try {
        await unlink(filepath);
        console.log(`Deleted file: ${pdfFilename}`);
      } catch (err: any) {
        if (err.code !== "ENOENT") {
          console.warn("Could not delete file (might be missing):", pdfFilename);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete failed:", error);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}
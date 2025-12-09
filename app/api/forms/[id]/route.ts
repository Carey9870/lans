// app/api/forms/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const UPLOAD_DIR = join(process.cwd(), "public/forms");

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ← Promise!
) {
  const { id } = await params; // ← await it!
  const res = await query("SELECT * FROM forms WHERE id = $1", [id]);
  if (res.rowCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(res.rows[0]);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ← Promise!
) {
  const { id } = await params;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    const sno = Number(formData.get("sno"));
    const form_number = (formData.get("form_number") as string)?.trim() || "";
    const description = (formData.get("description") as string)?.trim() || "";
    const category = (formData.get("category") as string)?.trim() || "";

    if (!sno || !form_number || !description || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let pdf_filename: string | null = null;
    let pdf_size_kb: number | null = null;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      pdf_filename = `${form_number.replace(/\s+/g, "-")}.pdf`;
      const filepath = join(UPLOAD_DIR, pdf_filename);
      await writeFile(filepath, buffer);
      pdf_size_kb = Number((buffer.length / 1024).toFixed(2));
    }

    const res = await query(
      `UPDATE forms
       SET sno = $1, form_number = $2, description = $3, category = $4,
           pdf_filename = COALESCE($5, pdf_filename),
           pdf_size_kb = COALESCE($6, pdf_size_kb),
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [sno, form_number, description, category, pdf_filename, pdf_size_kb, id]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update form" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ← Promise!
) {
  const { id } = await params;

  try {
    const res = await query("SELECT pdf_filename FROM forms WHERE id = $1", [id]);
    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const filename = res.rows[0].pdf_filename;
    if (filename) {
      const filepath = join(UPLOAD_DIR, filename);
      if (existsSync(filepath)) {
        await unlink(filepath);
      }
    }

    await query("DELETE FROM forms WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete form" }, { status: 500 });
  }
}
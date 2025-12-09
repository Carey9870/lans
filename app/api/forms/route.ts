// app/api/forms/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "public/forms");
await mkdir(UPLOAD_DIR, { recursive: true });

export async function GET() {
  try {
    const res = await query("SELECT * FROM forms ORDER BY sno ASC");
    return NextResponse.json(res.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    const sno = Number(formData.get("sno"));
    const form_number = (formData.get("form_number") as string).trim();
    const description = (formData.get("description") as string).trim();
    const category = (formData.get("category") as string).trim();

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
      `INSERT INTO forms (sno, form_number, description, category, pdf_filename, pdf_size_kb)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [sno, form_number, description, category, pdf_filename, pdf_size_kb]
    );

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create form" }, { status: 500 });
  }
}
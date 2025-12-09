// app/api/download/route.ts   ←←← MUST BE THIS PATH
import { NextRequest } from "next/server";
import { query } from "@/lib/db";
import path from "path";
import { existsSync, createReadStream } from "fs";

const PUBLIC_FORMS_DIR = path.join(process.cwd(), "public/forms");

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  // Normalize the slug exactly like we do when uploading
  const normalizedSlug = slug
    .trim()
    .toUpperCase()
    .replace(/-/g, " "); // form-cla-1 → FORM CLA 1

  console.log("Looking for form_number:", normalizedSlug);

  // THIS IS THE KEY FIX — fuzzy match on normalized form_number
  const res = await query(
    `SELECT pdf_filename, form_number 
     FROM forms 
     WHERE UPPER(REPLACE(form_number, '-', ' ')) = $1
     LIMIT 1`,
    [normalizedSlug]
  );

  console.log("DB query result:", res.rowCount, "rows");

  if (res.rowCount === 0) {
    return new Response(`Form not found: "${normalizedSlug}"`, { status: 404 });
  }

  const { pdf_filename, form_number } = res.rows[0];

  if (!pdf_filename) {
    return new Response("No PDF uploaded", { status: 404 });
  }

  const filePath = path.join(PUBLIC_FORMS_DIR, pdf_filename);

  if (!existsSync(filePath)) {
    console.log("File missing:", filePath);
    return new Response("File not found on disk", { status: 404 });
  }

  console.log("Serving file:", filePath);

  const fileStream = createReadStream(filePath);

  return new Response(fileStream as any, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${form_number}.pdf"`,
    },
  });
}
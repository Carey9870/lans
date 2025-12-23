// app/api/admin/resources/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT 
        rs.id AS section_id,
        rs.title AS section_title,
        rs.slug AS section_slug,
        rs."order" AS section_order,
        r.id,
        r.title,
        r.slug,
        r.pdf_filename,
        r.fallback_content,
        r."order"
      FROM resource_sections rs
      LEFT JOIN resources r ON r.section_id = rs.id
      ORDER BY rs."order", r."order"
    `);

    const sections = result.rows.reduce((acc: any[], row: any) => {
      let section = acc.find((s) => s.id === row.section_id);
      if (!section) {
        section = {
          id: row.section_id,
          title: row.section_title,
          slug: row.section_slug,
          order: row.section_order,
          links: [],
        };
        acc.push(section);
      }
      if (row.id) {
        section.links.push({
          id: row.id,
          title: row.title,
          slug: row.slug,
          pdfFilename: row.pdf_filename,
          fallbackContent: row.fallback_content,
        });
      }
      return acc;
    }, []);

    client.release();
    return NextResponse.json(sections);
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ error: "Failed to load resources" }, { status: 500 });
  }
}

          //---------
// app/api/admin/resources/route.ts
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const sectionId = formData.get("sectionId") as string;
  const title = formData.get("title") as string;
  const slug = (formData.get("slug") as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const fallbackContent = formData.get("fallbackContent") as string;
  const file = formData.get("pdf") as File | null;

  let pdfFilename: string | null = null;

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${slug}.pdf`;
    const filepath = path.join(process.cwd(), "public", "resources", filename);
    await mkdir(path.dirname(filepath), { recursive: true });
    await writeFile(filepath, buffer);
    pdfFilename = filename;
  }

  // Save to DB
  await pool.query(
    `INSERT INTO resources (section_id, title, slug, pdf_filename, fallback_content)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [sectionId, title, slug, pdfFilename, fallbackContent]
  );

  return Response.json({ success: true });
}


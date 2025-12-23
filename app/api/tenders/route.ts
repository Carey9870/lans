// app/api/tenders/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { uploadFile } from "@/lib/tender/upload";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all"; // "active" | "closed" | null

  const offset = (page - 1) * limit;

  let query = `
    SELECT *, 
           EXTRACT(EPOCH FROM (closing_datetime - NOW()))::bigint AS seconds_until_close
    FROM tenders
    WHERE tender_no ILIKE $1 OR description ILIKE $1
  `;
  const params: any[] = [`%${search}%`];

  // Only apply filter if status is "active" or "closed", otherwise show all
  if (status === "active") {
    query += ` AND closing_datetime > NOW()`;
  } else if (status === "closed") {
    query += ` AND closing_datetime <= NOW()`;
  }

  // if (status === "active") {
  //   query += ` AND is_active = true AND closing_datetime > NOW()`;
  // } else if (status === "closed") {
  //   query += ` AND (is_active = false OR closing_datetime <= NOW())`;
  // }

  query += ` ORDER BY closing_datetime DESC LIMIT $${
    params.length + 1
  } OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const countQuery = `
    SELECT COUNT(*) FROM tenders
    WHERE tender_no ILIKE $1 OR description ILIKE $1
    ${
      status === "active"
        ? "AND closing_datetime > NOW()"
        : status === "closed"
        ? "AND closing_datetime <= NOW()" : ""
    }
  `;

  const [result, countResult] = await Promise.all([
    pool.query(query, params),
    pool.query(countQuery, [`%${search}%`]),
  ]);

  return NextResponse.json({
    tenders: result.rows,
    total: parseInt(countResult.rows[0].count),
    page,
    limit,
    totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
  });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const tender_no = formData.get("tender_no") as string;
  const description = formData.get("description") as string;
  const start_date = formData.get("start_date") as string;
  const closing_datetime = formData.get("closing_datetime") as string;
  const file = formData.get("document") as File | null;

  let document_path = null;
  let document_size = null;
  let document_name = null;
  let document_mime_type = null;

  if (file) {
    const { path, size, originalName, mimeType } = await uploadFile(file);
    document_path = path;
    document_size = size;
    document_name = originalName;
    document_mime_type = mimeType;
  }

  const result = await pool.query(
    `INSERT INTO tenders 
     (tender_no, description, start_date, closing_datetime, document_path, document_size, document_name, document_mime_type)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      tender_no,
      description,
      start_date,
      closing_datetime,
      document_path,
      document_size,
      document_name,
      document_mime_type,
    ]
  );

  return NextResponse.json(result.rows[0], { status: 201 });
}

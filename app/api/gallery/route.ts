// app/api/gallery/route.ts
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await query(
      `SELECT 
        id,
        type,
        title,
        text,
        subtext,
        file_path AS url,
        thumbnail_path AS "thumbnailUrl",
        duration_seconds AS duration,
        "order"
      FROM gallery_media
      ORDER BY "order" ASC, id ASC`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

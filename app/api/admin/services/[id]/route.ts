// app/api/admin/services/[id]/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // ← params is now a Promise
) {
  const client = await pool.connect();

  try {
    // ← THIS IS THE FIX: await params
    const { id } = await params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId) || categoryId <= 0) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
    }

    await client.query("BEGIN");

    const { title, items } = await request.json();

    if (!title || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Title and services are required" }, { status: 400 });
    }

    // Update category title
    await client.query(
      "UPDATE categories SET title = $1 WHERE id = $2",
      [title.trim(), categoryId]
    );

    // Delete all existing services for this category
    await client.query("DELETE FROM service_items WHERE category_id = $1", [categoryId]);

    // Insert updated services
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemTitle = item.title?.trim();
      if (!itemTitle) continue;

      const itemSlug = slugify(itemTitle) || `service-${i + 1}`;

      await client.query(
        `INSERT INTO service_items 
         (category_id, number, title, slug, description, requirements)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          categoryId,
          i + 1,
          itemTitle,
          itemSlug,
          item.description?.trim() || null,
          JSON.stringify([]),
        ]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Update failed:", error);
    return NextResponse.json(
      { error: "Failed to update category", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// Optional: Allow fetching single category for future use
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const categoryId = parseInt(id, 10);

  if (isNaN(categoryId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const res = await client.query(
      `
      SELECT c.id, c.title, c.slug,
             COALESCE(json_agg(
               json_build_object('id', si.id, 'number', si.number, 'title', si.title, 'description', si.description)
               ORDER BY si.number
             ) FILTER (WHERE si.id IS NOT NULL), '[]') as items
      FROM categories c
      LEFT JOIN service_items si ON si.category_id = c.id
      WHERE c.id = $1
      GROUP BY c.id
      `,
      [categoryId]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const row = res.rows[0];
    return NextResponse.json({
      ...row,
      items: row.items || [],
    });
  } finally {
    client.release();
  }
}
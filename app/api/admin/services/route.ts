// app/api/admin/services/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT 
        c.id, c.title, c.slug,
        COALESCE(json_agg(
          json_build_object('id', si.id, 'number', si.number, 'title', si.title, 'description', si.description)
          ORDER BY si.number
        ) FILTER (WHERE si.id IS NOT NULL), '[]') as items
      FROM categories c
      LEFT JOIN service_items si ON si.category_id = c.id
      GROUP BY c.id, c.title, c.slug
      ORDER BY c.id
    `);

    return NextResponse.json(
      res.rows.map(row => ({
        ...row,
        items: row.items || []
      }))
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { title, items } = await request.json();

    if (!title || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const baseSlug = slugify(title);

    // Check if category with this slug (or similar) already exists
    const existingCat = await client.query(
      "SELECT id, slug FROM categories WHERE slug = $1 OR slug LIKE $2",
      [baseSlug, `${baseSlug}%`]
    );

    let categoryId: number;
    let finalSlug: string;

    if (existingCat.rows.length > 0) {
      // Category exists → REUSE it
      const row = existingCat.rows[0];
      categoryId = row.id;
      finalSlug = row.slug;

      // Optional: update title if changed
      await client.query("UPDATE categories SET title = $1 WHERE id = $2", [title, categoryId]);
    } else {
      // Create new category
      finalSlug = baseSlug;
      let counter = 1;
      while (true) {
        const check = await client.query("SELECT 1 FROM categories WHERE slug = $1", [finalSlug]);
        if (check.rows.length === 0) break;
        finalSlug = `${baseSlug}-${++counter}`;
      }

      const res = await client.query(
        "INSERT INTO categories (title, slug) VALUES ($1, $2) RETURNING id",
        [title, finalSlug]
      );
      categoryId = res.rows[0].id;
    }

    // Now add services (skip if already exist by slug)
    const existingSlugs = await client.query("SELECT slug FROM service_items WHERE category_id = $1", [categoryId]);
    const usedSlugs = new Set(existingSlugs.rows.map((r: any) => r.slug));

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemBaseSlug = slugify(item.title);

      let itemSlug = itemBaseSlug;
      let counter = 1;
      while (usedSlugs.has(itemSlug)) {
        itemSlug = `${itemBaseSlug}-${++counter}`;
      }
      usedSlugs.add(itemSlug);

      // Only insert if not exists
      const exists = await client.query(
        "SELECT 1 FROM service_items WHERE category_id = $1 AND slug = $2",
        [categoryId, itemSlug]
      );

      if (exists.rows.length === 0) {
        await client.query(
          `INSERT INTO service_items 
           (category_id, number, title, slug, description, requirements)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            categoryId,
            i + 1,
            item.title.trim(),
            itemSlug,
            item.description?.trim() || null,
            JSON.stringify([]),
          ]
        );
      }
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: existingCat.rows.length > 0
        ? "Services added to existing category!"
        : "New category & services created!",
      categorySlug: finalSlug,
    });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
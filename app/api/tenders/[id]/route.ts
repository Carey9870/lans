// app/api/tenders/[id]/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

// Helper to safely extract id
async function getId(params: Promise<{ id: string }>) {
  const { id } = await params;
  if (!id || isNaN(Number(id))) {
    throw new Error("Invalid or missing ID");
  }
  return Number(id);
}

// GET – Fetch single tender
export async function GET(
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await getId(params);
    const result = await pool.query("SELECT * FROM tenders WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Tender not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.log(`err - ${err}`)
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
}

          // ------------------

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = await getId(params);
  const formData = await request.formData();
  const updates: any = {};
  const fields = ["tender_no", "description", "start_date", "closing_datetime"];
  fields.forEach((f) => {
    const val = formData.get(f);
    if (val) updates[f] = val;
  });

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const setClause = Object.keys(updates)
    .map((k, i) => `${k} = $${i + 1}`)
    .join(", ");
  const values = Object.values(updates);

  const result = await pool.query(
    `UPDATE tenders SET ${setClause}, updated_at = NOW() WHERE id = $${values.length + 1} RETURNING *`,
    [...values, id]
  );

  return NextResponse.json(result.rows[0]);
}

                  // -------------------------

// DELETE – Remove tender
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await getId(params);

    const result = await pool.query("DELETE FROM tenders WHERE id = $1 RETURNING id", [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Tender not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete tender" },
      { status: 400 }
    );
  }
}


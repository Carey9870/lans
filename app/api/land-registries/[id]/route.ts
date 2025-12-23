// app/api/land-registries/[id]/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { CreateLandRegistryInput } from "@/types/land-registries";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ← Promise!
) {
  const { id } = await params; // ← await it!
  try {
    await pool.query("DELETE FROM land_registries WHERE id = $1", [
      id,
    ]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT (Update)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ← Promise!
) {
  const { id } = await params; // ← await it!
  const body: CreateLandRegistryInput = await request.json();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `UPDATE land_registries SET county = $1, station = $2 WHERE id = $3`,
      [body.county, body.station, id]
    );

    await client.query(
      `DELETE FROM registry_locations WHERE registry_id = $1`,
      [id]
    );

    for (const loc of body.locations) {
      await client.query(
        `INSERT INTO registry_locations (registry_id, location, departments)
         VALUES ($1, $2, $3)`,
        [id, loc.location, loc.departments]
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
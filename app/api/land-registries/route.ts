// app/api/land-registries/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { CreateLandRegistryInput } from "@/types/land-registries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 7;
  const offset = (page - 1) * limit;

  try {
    const countRes = await pool.query("SELECT COUNT(*) FROM land_registries");
    const total = parseInt(countRes.rows[0].count);

    const res = await pool.query(
      `SELECT 
        r.id, r.serial_no, r.county, r.station,
        COALESCE(
          json_agg(
            json_build_object('id', rl.id, 'location', rl.location, 'departments', rl.departments)
          ) FILTER (WHERE rl.id IS NOT NULL), 
          '[]'
        ) as locations
      FROM land_registries r
      LEFT JOIN registry_locations rl ON rl.registry_id = r.id
      GROUP BY r.id, r.serial_no, r.county, r.station
      ORDER BY r.serial_no ASC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return NextResponse.json({
      data: res.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body: CreateLandRegistryInput = await request.json();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const registryRes = await client.query(
      `INSERT INTO land_registries (county, station) 
       VALUES ($1, $2) RETURNING id, serial_no`,
      [body.county, body.station]
    );

    const registryId = registryRes.rows[0].id;

    for (const loc of body.locations) {
      await client.query(
        `INSERT INTO registry_locations (registry_id, location, departments)
         VALUES ($1, $2, $3)`,
        [registryId, loc.location, loc.departments]
      );
    }

    await client.query("COMMIT");

    const finalRes = await client.query(
      `SELECT * FROM land_registries WHERE id = $1`,
      [registryId]
    );

    return NextResponse.json(finalRes.rows[0], { status: 201 });
  } catch (error: any) {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
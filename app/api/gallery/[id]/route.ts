// app/api/gallery/[id]/route.ts
import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  const result = await query(
    `SELECT 
       id, type, title, text, subtext, 
       file_path, thumbnail_path, duration_seconds, "order"
     FROM gallery_media WHERE id = $1`,
    [id]
  );

  if (result.rowCount === 0) {
    return NextResponse.json({ error: 'Media not found' }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}

// app/api/gallery/[id]/route.ts  →  Only the PUT part (replace this)

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  try {
    const body = await request.json();
    const { title, text, subtext, order } = body;

    // Only parse order if it's actually sent
    const orderValue = order !== undefined 
      ? (typeof order === 'number' ? order : parseInt(order, 10))
      : null;

    if (order !== undefined && (isNaN(orderValue as number))) {
      return NextResponse.json({ error: 'Order must be a valid number' }, { status: 400 });
    }

    await query(
      `UPDATE gallery_media
       SET
         title = $1,
         text = $2,
         subtext = $3,
         "order" = COALESCE($4, "order"),
         updated_at = NOW()
       WHERE id = $5`,
      [
        title ?? null,
        text ?? null,
        subtext ?? null,
        orderValue,           // ← now safely passes number | null
        id,
      ]
    );

    revalidatePath('/management-and-leadership');
    revalidatePath('/admin/gallery');
    revalidatePath(`/admin/gallery/edit/${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT /api/gallery/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  try {
    // Get current order for reordering
    const orderResult = await query(`SELECT "order" FROM gallery_media WHERE id = $1`, [id]);
    const currentOrder = orderResult.rows[0]?.order;

    // Delete the media
    await query(`DELETE FROM gallery_media WHERE id = $1`, [id]);

    // Reorder remaining items
    if (currentOrder !== undefined) {
      await query(
        `UPDATE gallery_media 
         SET "order" = "order" - 1 
         WHERE "order" > $1`,
        [currentOrder]
      );
    }

    revalidatePath('/management-and-leadership');
    revalidatePath('/admin/gallery');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/gallery/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
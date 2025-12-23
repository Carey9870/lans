// app/api/faqs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from "@/lib/db";

// Helper to safely get the ID
async function getId(params: Promise<{ id: string }>) {
  const { id } = await params;
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    throw new Error('Invalid FAQ ID');
  }
  return parsedId;
}

// GET: Fetch single FAQ
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await getId(params);

    const client = await pool.connect();
    const result = await client.query('SELECT * FROM faqs WHERE id = $1', [id]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching FAQ:', error);
    if (error.message === 'Invalid FAQ ID') {
      return NextResponse.json({ error: 'Invalid FAQ ID' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Update FAQ
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await getId(params);
    const body = await request.json();
    const { question, answer } = body;

    if (!question || !answer || typeof question !== 'string' || typeof answer !== 'string') {
      return NextResponse.json(
        { error: 'Question and answer are required and must be strings' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    const result = await client.query(
      `UPDATE faqs 
       SET question = $1, answer = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [question.trim(), answer.trim(), id]
    );
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating FAQ:', error);
    if (error.message === 'Invalid FAQ ID') {
      return NextResponse.json({ error: 'Invalid FAQ ID' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Remove FAQ
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await getId(params);

    const client = await pool.connect();
    const result = await client.query('DELETE FROM faqs WHERE id = $1 RETURNING id', [id]);
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'FAQ deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting FAQ:', error);
    if (error.message === 'Invalid FAQ ID') {
      return NextResponse.json({ error: 'Invalid FAQ ID' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
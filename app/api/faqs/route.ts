// app/api/faqs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '7', 10);
  const offset = (page - 1) * limit;

  try {
    const client = await pool.connect();
    const countResult = await client.query('SELECT COUNT(*) FROM faqs');
    const total = parseInt(countResult.rows[0].count, 10);
    const result = await client.query(
      'SELECT * FROM faqs ORDER BY created_at ASC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    client.release();

    return NextResponse.json({
      faqs: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { question, answer } = await request.json();
    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO faqs (question, answer) VALUES ($1, $2) RETURNING *',
      [question, answer]
    );
    client.release();

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


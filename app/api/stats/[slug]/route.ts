import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const result = await pool.query('SELECT slug, url, clicks, created_at FROM links WHERE slug = $1', [slug]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(`Failed to fetch stats for slug:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT slug, url, clicks, created_at FROM links ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch links:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { slug } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const result = await pool.query('DELETE FROM links WHERE slug = $1 RETURNING *', [slug]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Slug not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Failed to delete link:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

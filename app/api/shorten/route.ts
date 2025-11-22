import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { validateUrl, normalizeUrl } from '@/lib/validateUrl';

export async function POST(req: NextRequest) {
  try {
    const { url, slug } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const normalized = normalizeUrl(url);
    if (!validateUrl(normalized)) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    let finalSlug = slug;
    if (!finalSlug) {
      finalSlug = Math.random().toString(36).substring(2, 8);
    }

    try {
      const result = await pool.query(
        'INSERT INTO links (slug, url) VALUES ($1, $2) RETURNING *',
        [finalSlug, normalized]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    } catch (dbError: any) {
      if (dbError.code === '23505') { // Unique violation
        return NextResponse.json({ error: 'Slug is already in use' }, { status: 409 });
      }
      throw dbError; // Rethrow other database errors
    }
  } catch (error) {
    console.error('Failed to create short link:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  try {
    // Increment the click count and get the URL in one query
    const result = await pool.query(
      'UPDATE links SET clicks = clicks + 1 WHERE slug = $1 RETURNING url',
      [slug]
    );

    if (result.rows.length > 0) {
      const { url } = result.rows[0];
      return NextResponse.redirect(url);
    } else {
      // If the slug doesn't exist, you might want to redirect to a 404 page
      // For simplicity, we'll redirect to the home page.
      const homeUrl = new URL('/', req.url);
      return NextResponse.redirect(homeUrl.toString());
    }
  } catch (error) {
    console.error('Failed to redirect:', error);
    // Redirect to home on error as well
    const homeUrl = new URL('/', req.url);
    return NextResponse.redirect(homeUrl.toString());
  }
}

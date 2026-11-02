import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL?.replace('&uselibpqcompat=true', ''),
    connectionTimeoutMillis: 30000,
  });

  try {
    const { slug } = await params;

    const client = await pool.connect();
    const postResult = await client.query('SELECT id FROM "Post" WHERE slug = $1', [slug]);
    if (postResult.rows.length === 0) {
      client.release();
      await pool.end();
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      null;

    const userAgent = request.headers.get('user-agent') || null;
    const referer = request.headers.get('referer') || null;

    await client.query('UPDATE "Post" SET "viewCount" = "viewCount" + 1 WHERE slug = $1', [slug]);
    await client.query(
      'INSERT INTO "post_views" ("id", "postSlug", "viewerIp", "userAgent", "referer", "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())',
      [slug, ip, userAgent, referer]
    );

    client.release();
    await pool.end();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    await pool.end().catch(() => {});
    console.error('Failed to track view:', error.code, error.message);
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }
}
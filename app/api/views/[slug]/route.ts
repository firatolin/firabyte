import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      null;

    const userAgent = request.headers.get('user-agent') || null;
    const referer = request.headers.get('referer') || null;

    await prisma.$transaction([
      prisma.post.update({
        where: { slug },
        data: { viewCount: { increment: 1 } },
      }),
      prisma.postView.create({
        data: {
          postSlug: slug,
          viewerIp: ip,
          userAgent,
          referer,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to track view:', error);
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }
}
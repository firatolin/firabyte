import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Check if user already liked this comment
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: session.user.id,
          commentId: id,
        },
      },
    });

    if (existingLike) {
      // Unlike - remove the like
      await prisma.commentLike.delete({
        where: { id: existingLike.id },
      });
      
      await prisma.comment.update({
        where: { id },
        data: { likes: { decrement: 1 } },
      });
      
      return NextResponse.json({ liked: false });
    } else {
      // Like - add the like
      await prisma.commentLike.create({
        data: {
          userId: session.user.id,
          commentId: id,
        },
      });
      
      await prisma.comment.update({
        where: { id },
        data: { likes: { increment: 1 } },
      });
      
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Error liking comment:', error);
    return NextResponse.json(
      { error: 'Failed to like comment' },
      { status: 500 }
    );
  }
}
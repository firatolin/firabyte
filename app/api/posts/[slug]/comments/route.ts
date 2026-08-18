import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { getPostBySlug } from '@/lib/mdx';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    // Check if post exists
    try {
      getPostBySlug(slug);
    } catch {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const comments = await prisma.comment.findMany({
      where: {
        postSlug: slug,
        parentId: null,
        isApproved: true,
      },
      include: {
        replies: {
          where: { isApproved: true },
          orderBy: { createdAt: 'asc' },
        },
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const body = await request.json();
    const { content, parentId, authorName, authorEmail } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment cannot exceed 1000 characters' },
        { status: 400 }
      );
    }

    // Check if post exists
    try {
      getPostBySlug(slug);
    } catch {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const userId = session?.user?.id;
    const isLoggedIn = !!userId;

    const commentData: {
      content: string;
      postSlug: string;
      isApproved: boolean;
      authorId?: string;
      authorName: string;
      authorEmail: string;
      parentId?: string | null;
    } = {
      content: content.trim(),
      postSlug: slug,
      isApproved: true,
      authorName: '',
      authorEmail: '',
    };

    if (isLoggedIn) {
      commentData.authorId = userId;
      commentData.authorName = session.user.name || 'Anonymous';
      commentData.authorEmail = session.user.email || '';
    } else {
      if (!authorName || !authorEmail) {
        return NextResponse.json(
          { error: 'Name and email are required for guest comments' },
          { status: 400 }
        );
      }
      commentData.authorName = authorName.trim();
      commentData.authorEmail = authorEmail.trim();
    }

    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { id: true, postSlug: true },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }

      if (parentComment.postSlug !== slug) {
        return NextResponse.json(
          { error: 'Parent comment does not belong to this post' },
          { status: 400 }
        );
      }

      commentData.parentId = parentId;
    }

    const comment = await prisma.comment.create({
      data: commentData,
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
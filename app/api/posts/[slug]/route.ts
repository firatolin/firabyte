import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getPostBySlug, updatePost, deletePost } from '@/lib/mdx';

// GET a single post
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.email !== 'firatolesayas@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const post = await getPostBySlug(slug);
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
}

// PUT (update) a post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.email !== 'firatolesayas@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const body = await request.json();
    const { title, excerpt, content, category, tags, coverImage, status } = body;

    if (!title || !excerpt || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const post = await updatePost(slug, {
      title,
      excerpt,
      content,
      category,
      tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
      coverImage: coverImage || '',
      status: status === 'published' ? 'PUBLISHED' : 'DRAFT',
    });

    return NextResponse.json({ success: true, slug: post.slug });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE a post
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.email !== 'firatolesayas@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    await deletePost(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
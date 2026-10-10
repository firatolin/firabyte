import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug, updatePost, deletePost } from '@/lib/mdx';
import { requireAdmin } from '@/lib/auth-utils';

// GET a single post (admin only)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

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
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

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
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

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
import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/lib/mdx';
import { sendNewPostNotification } from '@/lib/email-templates';
import { slugify, generateUniqueSlug } from '@/lib/utils';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const posts = await getAllPosts();
    return NextResponse.json({ posts: posts || [] });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ posts: [], error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { title, excerpt, content, category, tags, coverImage, status, author } = body;

    if (!title || !excerpt || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const baseSlug = slugify(title);
    const slug = await generateUniqueSlug(baseSlug, async (s) => {
      const existing = await prisma.post.findUnique({ where: { slug: s } });
      return !!existing;
    });

    const tagsArray = tags ? tags.split(',').map((t: string) => t.trim()) : [];
    const postStatus = status === 'published' ? 'PUBLISHED' : 'DRAFT';

    const userId = auth.session.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
    }

    // Create post in database
    const post = await createPost({
      title,
      slug,
      excerpt,
      content,
      category,
      tags: tagsArray,
      authorId: userId,
      coverImage: coverImage || '',
      status: postStatus,
    });

    // Send newsletter notification if post is published
    if (postStatus === 'PUBLISHED') {
      try {
        await sendNewPostNotification({
          title,
          excerpt,
          slug,
          coverImage: coverImage || '',
          author: author || 'Firatol Esayas Tefera',
          date: new Date().toISOString().split('T')[0],
        });
        console.log('📬 Newsletter sent to subscribers!');
      } catch (emailError) {
        console.error('Failed to send newsletter:', emailError);
        // Don't fail the post creation if newsletter fails
      }
    }

    return NextResponse.json({ success: true, slug: post.slug });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
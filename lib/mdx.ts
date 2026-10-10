import { serialize } from 'next-mdx-remote/serialize';
import readingTime from 'reading-time';
import { slug } from 'github-slugger';
import { PostMetadata, TocItem, PostWithContent } from '@/types/post';
import prisma from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';

/**
 * Get all post slugs
 */
export async function getPostSlugs(): Promise<string[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    });
    return posts.map((post) => post.slug);
  } catch (error) {
    console.error('Error fetching post slugs:', error);
    return [];
  }
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<PostWithContent> {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          name: true,
          bio: true,
          avatar: true,
        },
      },
    },
  });

  if (!post) {
    throw new Error(`Post not found: ${slug}`);
  }

  const toc = generateToc(post.content);

  return {
    slug: post.slug,
    title: post.title,
    date: post.publishedAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
    excerpt: post.excerpt,
    coverImage: post.coverImage || '',
    tags: post.tags || [],
    category: post.category,
    author: post.author.name,
    content: post.content,
    readingTime: post.readingTime,
    toc,
  };
}

/**
 * Get all posts with metadata
 */
export async function getAllPosts(): Promise<PostMetadata[]> {
  noStore(); // Opt out of static caching so new posts appear immediately

  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        author: {
          select: {
            name: true,
            bio: true,
            avatar: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
    });

    return posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.publishedAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      excerpt: post.excerpt,
      coverImage: post.coverImage || '',
      tags: post.tags || [],
      category: post.category,
      author: post.author.name,
      readingTime: post.readingTime,
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(category: string): Promise<PostMetadata[]> {
  const posts = await getAllPosts();
  return posts.filter((post: PostMetadata) => post.category.toLowerCase() === category.toLowerCase());
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string): Promise<PostMetadata[]> {
  const posts = await getAllPosts();
  return posts.filter((post: PostMetadata) => 
    post.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Get all unique categories with post counts (from database)
 */
export async function getAllCategories(): Promise<{ name: string; slug: string; count: number }[]> {
  const { prisma } = await import('@/lib/prisma');
  
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return categories.map((cat) => ({
    name: cat.name,
    slug: cat.slug,
    count: cat.postCount,
  }));
}

/**
 * Get all unique tags with post counts (from database)
 */
export async function getAllTags(): Promise<{ name: string; slug: string; count: number }[]> {
  const { prisma } = await import('@/lib/prisma');
  
  const tags = await prisma.tag.findMany({
    orderBy: { postCount: 'desc' },
  });

  return tags.map((tag) => ({
    name: tag.name,
    slug: tag.slug,
    count: tag.postCount,
  }));
}

/**
 * Generate table of contents from markdown content
 */
function generateToc(content: string): TocItem[] {
  const headings: TocItem[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = slug(text);

      if (level >= 2 && level <= 3) {
        headings.push({ id, text, level });
      }
    }
  }

  return headings;
}

/**
 * Serialize MDX content for rendering
 */
export async function serializeMdx(content: string) {
  return serialize(content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
  });
}

/**
 * Create a new post
 */
export async function createPost(data: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  authorId: string;
  coverImage?: string;
  status?: 'DRAFT' | 'PUBLISHED';
}) {
  const readTime = readingTime(data.content);

  return prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      tags: data.tags,
      coverImage: data.coverImage || '',
      authorId: data.authorId,
      readingTime: Math.ceil(readTime.minutes),
      status: data.status || 'DRAFT',
      publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
    },
  });
}

/**
 * Update a post
 */
export async function updatePost(
  slug: string,
  data: {
    title?: string;
    excerpt?: string;
    content?: string;
    category?: string;
    tags?: string[];
    coverImage?: string;
    status?: 'DRAFT' | 'PUBLISHED';
  }
) {
  // Get current post to check status change
  const currentPost = await prisma.post.findUnique({
    where: { slug },
    select: { status: true, publishedAt: true },
  });

  if (!currentPost) {
    throw new Error(`Post not found: ${slug}`);
  }

  const updateData: {
    title?: string;
    excerpt?: string;
    content?: string;
    category?: string;
    tags?: string[];
    coverImage?: string;
    status?: 'DRAFT' | 'PUBLISHED';
    readingTime?: number;
    publishedAt?: Date | null;
  } = { ...data };

  if (data.content) {
    const readTime = readingTime(data.content);
    updateData.readingTime = Math.ceil(readTime.minutes);
  }

  // Handle publishedAt based on status change
  if (data.status) {
    if (data.status === 'PUBLISHED' && currentPost.status !== 'PUBLISHED') {
      // First time publishing - set publishedAt
      updateData.publishedAt = new Date();
    } else if (data.status === 'DRAFT' && currentPost.status === 'PUBLISHED') {
      // Unpublishing - clear publishedAt
      updateData.publishedAt = null;
    }
    // If status stays the same, don't change publishedAt
  }

  return prisma.post.update({
    where: { slug },
    data: updateData,
  });
}

/**
 * Delete a post
 */
export async function deletePost(slug: string) {
  return prisma.post.delete({
    where: { slug },
  });
}
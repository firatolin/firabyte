import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export { prisma };

/**
 * Create a new user
 */
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  bio?: string;
  role?: 'ADMIN' | 'AUTHOR' | 'CONTRIBUTOR';
}) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      bio: data.bio || `Hello! I'm ${data.name}. I write about tech.`,
      role: data.role || 'AUTHOR',
    },
  });
}

/**
 * Find a user by email
 */
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Check if a user exists
 */
export async function userExists(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return !!user;
}

/**
 * Get all published posts
 */
export async function getPublishedPosts({
  page = 1,
  limit = 10,
  category,
  tag,
}: {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
} = {}) {
  const where: Prisma.PostWhereInput = {
    status: 'PUBLISHED',
  };
  
  if (category) {
    where.category = category;
  }

  if (tag) {
    where.tags = { has: tag };
  }

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            bio: true,
            avatar: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { 
      slug,
      status: 'PUBLISHED',
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          bio: true,
          avatar: true,
        },
      },
    },
  });
}

/**
 * Increment post view count
 */
export async function incrementViewCount(slug: string) {
  return prisma.post.update({
    where: { slug },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });
}

/**
 * Get all tags with post counts
 */
export async function getTags() {
  return prisma.tag.findMany({
    orderBy: { postCount: 'desc' },
  });
}

/**
 * Get all categories with post counts
 */
export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
}
import { connectToDatabase } from './mongodb';
import { Post, Author, Comment, Subscriber, Tag, Category } from './models';

// Export models for use in other files
export { Post, Author, Comment, Subscriber, Tag, Category };
export { connectToDatabase };

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string) {
  await connectToDatabase();
  return Post.findOne({ slug, status: 'published' })
    .populate('author', 'name bio avatar')
    .lean();
}

/**
 * Get all published posts with pagination
 */
export async function getPosts({
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
  await connectToDatabase();

  const query: any = { status: 'published' };
  
  if (category) query.category = category;
  if (tag) query.tags = tag;

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find(query)
      .populate('author', 'name bio avatar')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(query),
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
 * Get all tags with post counts
 */
export async function getTags() {
  await connectToDatabase();
  return Tag.find().sort({ postCount: -1 }).lean();
}

/**
 * Get all categories with post counts
 */
export async function getCategories() {
  await connectToDatabase();
  return Category.find().sort({ name: 1 }).lean();
}

/**
 * Increment post view count
 */
export async function incrementViewCount(slug: string) {
  await connectToDatabase();
  return Post.findOneAndUpdate(
    { slug },
    { $inc: { viewCount: 1 } },
    { new: true }
  );
}

/**
 * Search posts by title or content
 */
export async function searchPosts(query: string) {
  await connectToDatabase();
  return Post.find(
    {
      status: 'published',
      $text: { $search: query },
    },
    {
      score: { $meta: 'textScore' },
    }
  )
    .populate('author', 'name bio avatar')
    .sort({ score: { $meta: 'textScore' } })
    .limit(20)
    .lean();
}
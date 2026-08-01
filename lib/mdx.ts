import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import readingTime from 'reading-time';
import { slug } from 'github-slugger';
import { Post, PostFrontmatter, TocItem } from '@/types/post';

// Directory where posts are stored
const POSTS_DIRECTORY = path.join(process.cwd(), 'content/posts');

/**
 * Get all post slugs
 */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    return [];
  }
  const files = fs.readdirSync(POSTS_DIRECTORY);
  return files.filter((file) => file.endsWith('.mdx')).map((file) => file.replace(/\.mdx$/, ''));
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug: string): Omit<Post, 'content'> & { content: string } {
  const fullPath = path.join(POSTS_DIRECTORY, `${slug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const frontmatter = data as PostFrontmatter;
  const readTime = readingTime(content);
  const toc = generateToc(content);

  return {
    slug,
    content,
    title: frontmatter.title,
    date: frontmatter.date,
    excerpt: frontmatter.excerpt,
    coverImage: frontmatter.coverImage,
    tags: frontmatter.tags,
    category: frontmatter.category,
    author: frontmatter.author,
    readingTime: Math.ceil(readTime.minutes),
    toc,
  };
}

/**
 * Get all posts with metadata
 */
export function getAllPosts(): Omit<Post, 'content'>[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => {
      try {
        const post = getPostBySlug(slug);
        const { content, ...metadata } = post;
        return metadata;
      } catch (error) {
        console.error(`Error reading post ${slug}:`, error);
        return null;
      }
    })
    .filter((post): post is Omit<Post, 'content'> => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
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
import Fuse from 'fuse.js';
import { getAllPosts } from './mdx';
import type { PostMetadata } from '@/types/post';
import { unstable_cache } from 'next/cache';

// Configure Fuse.js for fuzzy search
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'excerpt', weight: 0.3 },
    { name: 'tags', weight: 0.15 },
    { name: 'category', weight: 0.05 },
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
};

/**
 * Get all posts with caching (revalidates every 60 seconds)
 */
const getCachedPosts = unstable_cache(
  async () => getAllPosts(),
  ['posts-search'],
  { revalidate: 60, tags: ['posts'] }
);

/**
 * Create a Fuse instance from posts
 */
function createFuse(posts: PostMetadata[]) {
  return new Fuse(posts, fuseOptions);
}

/**
 * Search posts by query
 */
export async function searchPosts(query: string): Promise<PostMetadata[]> {
  const posts = await getCachedPosts();
  
  if (!query || query.trim().length < 2) {
    return posts.slice(0, 10);
  }

  const fuse = createFuse(posts);
  const results = fuse.search(query.trim());
  
  return results.map((result) => result.item);
}

/**
 * Get post suggestions for autocomplete
 */
export async function getSearchSuggestions(query: string): Promise<string[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const posts = await getCachedPosts();
  const lowerQuery = query.toLowerCase().trim();
  const suggestions: string[] = [];

  for (const post of posts) {
    if (post.title.toLowerCase().includes(lowerQuery)) {
      suggestions.push(post.title);
    }
  }

  for (const post of posts) {
    for (const tag of post.tags) {
      if (tag.toLowerCase().includes(lowerQuery)) {
        suggestions.push(`#${tag}`);
      }
    }
  }

  return [...new Set(suggestions)].slice(0, 5);
}
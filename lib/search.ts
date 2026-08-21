import Fuse from 'fuse.js';
import { getAllPosts } from './mdx';
import type { PostMetadata } from '@/types/post';

// Get all posts and cache them
let postsCache: PostMetadata[] | null = null;

async function getPosts() {
  if (!postsCache) {
    postsCache = await getAllPosts();
  }
  return postsCache;
}

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

let fuseInstance: Fuse<PostMetadata> | null = null;

async function getFuse() {
  const posts = await getPosts();
  if (!fuseInstance) {
    fuseInstance = new Fuse(posts, fuseOptions);
  }
  return fuseInstance;
}

/**
 * Search posts by query
 */
export async function searchPosts(query: string): Promise<PostMetadata[]> {
  if (!query || query.trim().length < 2) {
    const posts = await getPosts();
    return posts.slice(0, 10);
  }

  const fuse = await getFuse();
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

  const posts = await getPosts();
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
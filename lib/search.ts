import Fuse from 'fuse.js';
import { getAllPosts } from './mdx';
import type { Post } from '@/types/post';

// Get all posts once and cache them
let postsCache: Omit<Post, 'content'>[] | null = null;

function getPosts() {
  if (!postsCache) {
    postsCache = getAllPosts();
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
  threshold: 0.3, // Lower = more strict, higher = more fuzzy
  includeScore: true,
  minMatchCharLength: 2,
};

let fuseInstance: Fuse<Omit<Post, 'content'>> | null = null;

function getFuse() {
  if (!fuseInstance) {
    const posts = getPosts();
    fuseInstance = new Fuse(posts, fuseOptions);
  }
  return fuseInstance;
}

/**
 * Search posts by query
 */
export function searchPosts(query: string): Omit<Post, 'content'>[] {
  if (!query || query.trim().length < 2) {
    return getPosts().slice(0, 10); // Return recent posts if no query
  }

  const fuse = getFuse();
  const results = fuse.search(query.trim());
  
  // Return only the items, sorted by relevance
  return results.map((result) => result.item);
}

/**
 * Get post suggestions for autocomplete
 */
export function getSearchSuggestions(query: string): string[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const posts = getPosts();
  const lowerQuery = query.toLowerCase().trim();
  const suggestions: string[] = [];

  // Check titles
  for (const post of posts) {
    if (post.title.toLowerCase().includes(lowerQuery)) {
      suggestions.push(post.title);
    }
  }

  // Check tags
  for (const post of posts) {
    for (const tag of post.tags) {
      if (tag.toLowerCase().includes(lowerQuery)) {
        suggestions.push(`#${tag}`);
      }
    }
  }

  // Limit suggestions
  return [...new Set(suggestions)].slice(0, 5);
}
import { connectToDatabase } from '@/lib/mongodb';
import { Author, Post, Comment, Subscriber, Tag, Category } from '@/lib/models';

// This file is for server-side use only
// Import it in API routes, server components, and server actions

export { connectToDatabase, Author, Post, Comment, Subscriber, Tag, Category };

/**
 * Create a new user (server only)
 */
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  bio?: string;
  role?: 'admin' | 'author' | 'contributor';
}) {
  await connectToDatabase();
  
  const user = await Author.create({
    name: data.name,
    email: data.email,
    password: data.password,
    bio: data.bio || `Hello! I'm ${data.name}. I write about tech.`,
    role: data.role || 'admin',
  });
  
  return user;
}

/**
 * Find a user by email (server only)
 */
export async function findUserByEmail(email: string) {
  await connectToDatabase();
  return Author.findOne({ email });
}

/**
 * Check if a user exists (server only)
 */
export async function userExists(email: string) {
  await connectToDatabase();
  const user = await Author.findOne({ email });
  return !!user;
}
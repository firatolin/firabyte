import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the Prisma adapter
const adapter = new PrismaPg(pool);

// Create PrismaClient with the adapter
const prisma = new PrismaClient({ adapter });

async function migratePosts() {
  const postsDir = path.join(process.cwd(), 'content/posts');
  
  if (!fs.existsSync(postsDir)) {
    console.log('No posts directory found');
    return;
  }

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'));

  if (files.length === 0) {
    console.log('No MDX files found in content/posts');
    return;
  }

  console.log(`Found ${files.length} MDX files to migrate`);

  for (const file of files) {
    try {
      const slug = file.replace(/\.mdx$/, '');
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const { data, content: mdxContent } = matter(content);

      // Check if post already exists
      const existing = await prisma.post.findUnique({
        where: { slug },
      });

      if (existing) {
        console.log(`Skipping ${slug} - already exists`);
        continue;
      }

      // Find author (use the first admin user)
      const author = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
      });

      if (!author) {
        console.log(`No admin author found for ${slug}`);
        continue;
      }

      const readTime = readingTime(mdxContent);
      const status = data.status === 'published' ? 'PUBLISHED' : 'DRAFT';
      const publishedAt = data.date ? new Date(data.date) : new Date();

      await prisma.post.create({
        data: {
          slug,
          title: data.title || slug,
          excerpt: data.excerpt || '',
          content: mdxContent,
          category: data.category || 'General',
          tags: data.tags || [],
          coverImage: data.coverImage || '',
          authorId: author.id,
          readingTime: Math.ceil(readTime.minutes),
          status: status,
          publishedAt: status === 'PUBLISHED' ? publishedAt : null,
        },
      });

      console.log(`✅ Migrated ${slug}`);
    } catch (error) {
      console.error(`Error migrating ${file}:`, error);
    }
  }

  console.log('Migration complete!');
}

migratePosts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
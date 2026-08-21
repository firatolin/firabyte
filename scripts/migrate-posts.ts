import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const prisma = new PrismaClient();

async function migratePosts() {
  const postsDir = path.join(process.cwd(), 'content/posts');
  
  if (!fs.existsSync(postsDir)) {
    console.log('No posts directory found');
    return;
  }

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'));

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

      // Find author
      const author = await prisma.user.findFirst({
        where: { email: 'firatolesayas@gmail.com' },
      });

      if (!author) {
        console.log(`No author found for ${slug}`);
        continue;
      }

      const readTime = readingTime(mdxContent);

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
          status: data.status === 'published' ? 'PUBLISHED' : 'DRAFT',
          publishedAt: data.date ? new Date(data.date) : new Date(),
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
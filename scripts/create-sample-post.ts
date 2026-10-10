import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import readingTime from 'reading-time';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const dbUrl = new URL(process.env.DATABASE_URL || '');
const pool = new Pool({
  host: dbUrl.hostname,
  port: dbUrl.port ? parseInt(dbUrl.port, 10) : 5432,
  database: dbUrl.pathname.slice(1),
  user: dbUrl.username,
  password: dbUrl.password,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function createSamplePost() {
  const author = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!author) {
    console.log('No admin user found');
    return;
  }

  const content = `# Welcome to Firabyte

This is a sample post to demonstrate the blog functionality.

## Features

- **Markdown support** - Write posts in Markdown/MDX
- **Syntax highlighting** - Code blocks with syntax highlighting
- **Table of contents** - Auto-generated from headings
- **Reading time** - Estimated reading time calculation

## Code Example

\`\`\`typescript
function hello(name: string) {
  return \`Hello, \${name}!\`;
}

console.log(hello('World'));
\`\`\`

## Conclusion

This is just a sample post. You can create more posts from the admin dashboard.`;

  const readTime = readingTime(content);
  const slug = 'welcome-to-firabyte';

  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) {
    console.log('Post already exists');
    return;
  }

  const post = await prisma.post.create({
    data: {
      title: 'Welcome to Firabyte',
      slug,
      excerpt: 'A sample post demonstrating the blog features including Markdown support, syntax highlighting, and more.',
      content,
      category: 'General',
      tags: ['welcome', 'demo', 'markdown'],
      coverImage: '',
      authorId: author.id,
      readingTime: Math.ceil(readTime.minutes),
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  console.log('Created sample post:', post.slug);
}

createSamplePost()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
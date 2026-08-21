import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostsByTag } from '@/lib/mdx';
import { format } from 'date-fns';
import { FaUser, FaCalendarAlt, FaClock } from 'react-icons/fa';

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const tags = [...new Set(posts.flatMap((post) => post.tags.map((t) => t.toLowerCase())))];
  
  return tags.map((slug) => ({
    slug,
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const resolvedParams = await params;
  const tagSlug = resolvedParams.slug;
  
  const tagPosts = await getPostsByTag(tagSlug);
  
  if (tagPosts.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-serif font-bold">#{tagSlug}</h1>
        <p className="text-muted-foreground mt-2">
          {tagPosts.length} {tagPosts.length === 1 ? 'post' : 'posts'}
        </p>
      </header>

      <div className="space-y-10">
        {tagPosts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/posts/${post.slug}`} className="block">
              <h2 className="text-2xl font-serif font-bold group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <FaUser className="h-3.5 w-3.5" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCalendarAlt className="h-3.5 w-3.5" />
                  {format(new Date(post.date), 'MMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaClock className="h-3.5 w-3.5" />
                  {post.readingTime} min read
                </span>
                <span className="text-xs bg-accent px-2.5 py-0.5 rounded-full text-accent-foreground">
                  {post.category}
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
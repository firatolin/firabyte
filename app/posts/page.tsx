import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/mdx';
import { format } from 'date-fns';
import { FaUser, FaCalendarAlt, FaClock } from 'react-icons/fa';

export default async function PostsPage() {
  const posts = await getAllPosts();

  if (posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-4xl font-serif font-bold mb-4">No posts yet</h1>
        <p className="text-muted-foreground">Check back soon for new content!</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-serif font-bold">All Posts</h1>
        <p className="text-muted-foreground mt-2">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>
      </header>

      <div className="space-y-12">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/posts/${post.slug}`} className="block">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Cover Image */}
                {post.coverImage && (
                  <div className="md:w-48 shrink-0 relative h-32 md:h-40 rounded-lg overflow-hidden bg-accent/10">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 192px"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-serif font-bold group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
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
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
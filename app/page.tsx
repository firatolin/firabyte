import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/mdx';
import { format } from 'date-fns';
import { FaUser, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { WorkPopup } from '@/components/shared/WorkPopup';
import { PostCardSkeleton } from '@/components/ui/LoadingSkeleton';
import type { PostMetadata } from '@/types/post';

async function HomeContent() {
  const posts: PostMetadata[] = await getAllPosts();
  const featuredPost = posts[0] || null;
  const recentPosts = posts.slice(1, 4);

  return (
    <div className="space-y-16 px-4 sm:px-0">
      {/* Hero Section */}
      <section className="py-8 md:py-16">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-foreground">
          Tech insights for
          <span className="block text-primary">modern developers</span>
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl">
          Building the future of technology, one post at a time.
          Exploring software, AI, cloud, and everything in between.
        </p>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
            Featured Post
          </h2>
          <article className="group">
            <Link href={`/posts/${featuredPost.slug}`} className="block">
              {featuredPost.coverImage && (
                <div className="mb-6 relative w-full h-[200px] md:h-[300px] rounded-xl overflow-hidden">
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                    sizes="(max-width: 768px) 100vw, 1200px"
                  />
                </div>
              )}
              <h3 className="text-2xl sm:text-3xl font-serif font-bold group-hover:text-primary transition-colors">
                {featuredPost.title}
              </h3>
              <p className="text-muted-foreground mt-3 text-base sm:text-lg leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <FaUser className="h-3.5 w-3.5" />
                  {featuredPost.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCalendarAlt className="h-3.5 w-3.5" />
                  {format(new Date(featuredPost.date), 'MMMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaClock className="h-3.5 w-3.5" />
                  {featuredPost.readingTime} min read
                </span>
                <span className="text-xs bg-accent px-2.5 py-0.5 rounded-full text-accent-foreground">
                  {featuredPost.category}
                </span>
              </div>
              <div className="mt-4 text-sm font-medium text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Read more →
              </div>
            </Link>
          </article>
        </section>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="border-t border-border pt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
            Recent Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {recentPosts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/posts/${post.slug}`} className="block">
                  {post.coverImage && (
                    <div className="mb-3 relative w-full h-40 rounded-lg overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <h3 className="text-lg sm:text-xl font-serif font-bold group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FaUser className="h-3 w-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="h-3 w-3" />
                      {format(new Date(post.date), 'MMM d')}
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <WorkPopup />
      <Suspense fallback={<PostCardSkeleton count={3} />}>
        <HomeContent />
      </Suspense>
    </>
  );
}
import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';
import { format } from 'date-fns';
import { Calendar, Clock, User } from 'lucide-react';

export default function Home() {
  const posts = getAllPosts();
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 4);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-8 md:py-16">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground">
          Tech insights for
          <span className="block text-primary">modern developers</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
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
              <h3 className="text-3xl font-serif font-bold group-hover:text-primary transition-colors">
                {featuredPost.title}
              </h3>
              <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {featuredPost.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(featuredPost.date), 'MMMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/posts/${post.slug}`} className="block">
                  <h3 className="text-xl font-serif font-bold group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(post.date), 'MMM d')}
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
            >
              View all posts →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
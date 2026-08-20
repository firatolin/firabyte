'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Tag, User } from 'lucide-react';
import { format } from 'date-fns';
import { ReactNode } from 'react';

interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  category: string;
  author: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface PostPageProps {
  source: MDXRemoteSerializeResult;
  frontmatter: PostFrontmatter;
  readingTime: number;
  toc: TocItem[];
}

// MDX components to render
const components = {
  pre: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <pre 
      className="my-6 overflow-x-auto rounded-lg bg-gray-900 dark:bg-gray-950 p-4 text-sm text-gray-100 dark:text-gray-200" 
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }: { className?: string; children: ReactNode; [key: string]: unknown }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code 
          className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm text-gray-800 dark:text-gray-200" 
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

export function PostPage({ source, frontmatter, readingTime, toc }: PostPageProps) {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground">
          {frontmatter.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {frontmatter.author}
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {format(new Date(frontmatter.date), 'MMMM d, yyyy')}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {readingTime} min read
          </span>
          <span className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            {frontmatter.category}
          </span>
        </div>

        {/* Cover Image - Using next/image with Cloudinary */}
        {frontmatter.coverImage && (
          <div className="mt-8 relative w-full h-[200px] sm:h-[300px] lg:h-[400px] rounded-xl overflow-hidden">
            <Image
              src={frontmatter.coverImage}
              alt={frontmatter.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        )}
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="flex-1 prose prose-gray dark:prose-invert prose-headings:font-serif prose-headings:font-bold prose-h1:text-3xl sm:prose-h1:text-4xl prose-h2:text-2xl sm:prose-h2:text-3xl prose-h3:text-xl sm:prose-h3:text-2xl prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100 max-w-none">
          <MDXRemote {...source} components={components} />
        </div>

        {/* Table of Contents */}
        {toc.length > 0 && (
          <aside className="lg:w-56 shrink-0">
            <div className="sticky top-8">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                On this page
              </h4>
              <nav className="space-y-2">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-sm hover:text-foreground transition-colors ${
                      item.level === 2 ? 'pl-0 font-medium' : 'pl-4 text-muted-foreground'
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>

      {/* Tags */}
      {frontmatter.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {frontmatter.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag.toLowerCase()}`}
                className="px-3 py-1.5 bg-accent/50 text-accent-foreground rounded-full text-xs hover:bg-accent transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
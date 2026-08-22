import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlug, getPostSlugs, serializeMdx } from '@/lib/mdx';
import { PostPageWrapper } from '@/components/posts/PostPageWrapper';
import { Comments } from '@/components/posts/Comments';
import { JsonLd } from '@/components/SEO/JsonLd';
import { CommentsSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Suspense } from 'react';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getPostSlugs();
    const validSlugs: string[] = [];
    for (const slug of slugs) {
      try {
        const post = await getPostBySlug(slug);
        if (post.title && post.content) {
          validSlugs.push(slug);
        }
      } catch (error) {
        console.warn(`Skipping invalid post: ${slug}`, error);
      }
    }
    return validSlugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const post = await getPostBySlug(resolvedParams.slug);
    
    const ogImage = `/og?title=${encodeURIComponent(post.title)}&excerpt=${encodeURIComponent(post.excerpt)}`;
    const baseUrl = process.env.NEXTAUTH_URL || 'https://firabyte.com';
    
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.date,
        tags: post.tags,
        url: `${baseUrl}/posts/${post.slug}`,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: [ogImage],
      },
    };
  } catch (error) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    };
  }
}

export default async function PostPageWrapperServer({ params }: PostPageProps) {
  const resolvedParams = await params;
  
  let post;
  try {
    post = await getPostBySlug(resolvedParams.slug);
  } catch (error) {
    notFound();
  }

  if (!post.title || !post.content) {
    notFound();
  }

  let mdxSource;
  try {
    mdxSource = await serializeMdx(post.content);
  } catch (error) {
    console.error('Error serializing MDX:', error);
    notFound();
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'https://firabyte.com';

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Firabyte',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/posts/${post.slug}`,
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
  };

  return (
    <ErrorBoundary>
      <JsonLd data={jsonLdData} />
      <PostPageWrapper
        source={mdxSource}
        frontmatter={{
          title: post.title,
          date: post.date,
          excerpt: post.excerpt,
          coverImage: post.coverImage || '',
          tags: post.tags,
          category: post.category,
          author: post.author,
        }}
        readingTime={post.readingTime}
        toc={post.toc}
      />
      <Suspense fallback={<CommentsSkeleton />}>
        <Comments postSlug={resolvedParams.slug} />
      </Suspense>
    </ErrorBoundary>
  );
}
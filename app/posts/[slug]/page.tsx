import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlug, getPostSlugs, serializeMdx } from '@/lib/mdx';
import { PostPage } from '@/components/posts/PostPage';
import { Comments } from '@/components/posts/Comments';
import { JsonLd } from '@/components/SEO/JsonLd';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  
  const ogImage = `/og/${post.slug}?title=${encodeURIComponent(post.title)}&excerpt=${encodeURIComponent(post.excerpt)}`;
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
}

export default async function PostPageWrapper({ params }: PostPageProps) {
  const resolvedParams = await params;
  
  let post;
  try {
    post = getPostBySlug(resolvedParams.slug);
  } catch (error) {
    notFound();
  }

  // Debug: Log the cover image
  console.log('Post coverImage:', post.coverImage);

  let mdxSource;
  try {
    mdxSource = await serializeMdx(post.content);
  } catch (error) {
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
    <>
      <JsonLd data={jsonLdData} />
      <PostPage
        source={mdxSource}
        frontmatter={{
          title: post.title,
          date: post.date,
          excerpt: post.excerpt,
          coverImage: post.coverImage,
          tags: post.tags,
          category: post.category,
          author: post.author,
        }}
        readingTime={post.readingTime}
        toc={post.toc}
      />
      <Comments postSlug={resolvedParams.slug} />
    </>
  );
}
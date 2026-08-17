import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlug, getPostSlugs, serializeMdx } from '@/lib/mdx';
import { PostPage } from '@/components/posts/PostPage';
import { Comments } from '@/components/posts/Comments';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all posts
export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for each post
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  
  const ogImage = `/og/${post.slug}?title=${encodeURIComponent(post.title)}&excerpt=${encodeURIComponent(post.excerpt)}`;
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
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

// Post page component
export default async function PostPageWrapper({ params }: PostPageProps) {
  const resolvedParams = await params;
  
  let post;
  try {
    post = getPostBySlug(resolvedParams.slug);
  } catch (error) {
    notFound();
  }

  let mdxSource;
  try {
    mdxSource = await serializeMdx(post.content);
  } catch (error) {
    notFound();
  }

  return (
    <>
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
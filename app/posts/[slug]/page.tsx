import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlug, getPostSlugs, serializeMdx } from '@/lib/mdx';
import { PostPage } from '@/components/posts/PostPage';

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
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

// Post page component
export default async function PostPageWrapper({ params }: PostPageProps) {
  const resolvedParams = await params;
  
  // Get the post data outside of try/catch
  let post;
  try {
    post = getPostBySlug(resolvedParams.slug);
  } catch (error) {
    notFound();
  }

  // Serialize MDX outside of try/catch
  let mdxSource;
  try {
    mdxSource = await serializeMdx(post.content);
  } catch (error) {
    notFound();
  }

  // Render the component
  return (
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
  );
}
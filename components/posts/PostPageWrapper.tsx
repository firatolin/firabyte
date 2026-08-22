'use client';

import dynamic from 'next/dynamic';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { PostPageSkeleton } from '@/components/ui/LoadingSkeleton';

// Dynamically import PostPage with no SSR
const PostPage = dynamic(
  () => import('@/components/posts/PostPage').then((mod) => mod.PostPage),
  {
    ssr: false,
    loading: () => <PostPageSkeleton />,
  }
);

interface PostPageWrapperProps {
  source: MDXRemoteSerializeResult;
  frontmatter: {
    title: string;
    date: string;
    excerpt: string;
    coverImage?: string;
    tags: string[];
    category: string;
    author: string;
  };
  readingTime: number;
  toc: { id: string; text: string; level: number }[];
}

export function PostPageWrapper({ source, frontmatter, readingTime, toc }: PostPageWrapperProps) {
  return (
    <PostPage
      source={source}
      frontmatter={frontmatter}
      readingTime={readingTime}
      toc={toc}
    />
  );
}
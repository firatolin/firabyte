'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  readingTime: number;
}

export default function ManagePostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authorized
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    if (status === 'authenticated' && session?.user?.email !== 'firatolesayas@gmail.com') {
      router.push('/');
      return;
    }

    // Fetch posts
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchPosts();
    }
  }, [status, session, router]);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.slug !== slug));
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      alert('Failed to delete post');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Manage Posts</h1>
          <p className="text-muted-foreground mt-1">
            {posts.length} posts total
          </p>
        </div>
        <Link
          href="/manage-posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <FaPlus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium">Title</th>
              <th className="text-left p-4 text-sm font-medium">Date</th>
              <th className="text-left p-4 text-sm font-medium">Category</th>
              <th className="text-left p-4 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-8 text-muted-foreground">
                  No posts yet. Create your first post!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.slug} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <span className="font-medium">{post.title}</span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{post.date}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-accent rounded-full text-xs">
                      {post.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                        aria-label="View"
                      >
                        <FaEye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/manage-posts/edit/${post.slug}`}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                        aria-label="Edit"
                      >
                        <FaEdit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.slug, post.title)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                        aria-label="Delete"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-accent/20 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> Your posts are stored as MDX files in <code className="px-1.5 py-0.5 bg-background rounded font-mono text-xs">content/posts/</code>
        </p>
      </div>
    </div>
  );
}
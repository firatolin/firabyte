import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostsByCategory } from '@/lib/mdx';
import { format } from 'date-fns';
import { FaUser, FaCalendarAlt, FaClock } from 'react-icons/fa';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const categories = [...new Set(posts.map((post) => post.category.toLowerCase()))];
  
  return categories.map((slug) => ({
    slug: slug.replace(/\s+/g, '-'), // Replace spaces with dashes
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.slug;
  
  // Find the category name from the slug
  const posts = await getAllPosts();
  const allCategories = [...new Set(posts.map((post) => post.category.toLowerCase()))];
  const categoryName = allCategories.find(
    (cat) => cat.replace(/\s+/g, '-') === categorySlug
  );
  
  if (!categoryName) {
    notFound();
  }
  
  const categoryPosts = await getPostsByCategory(categoryName);
  
  if (categoryPosts.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-serif font-bold">
          Category: {categoryPosts[0]?.category || categoryName}
        </h1>
        <p className="text-muted-foreground mt-2">
          {categoryPosts.length} {categoryPosts.length === 1 ? 'post' : 'posts'}
        </p>
      </header>

      <div className="space-y-10">
        {categoryPosts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/posts/${post.slug}`} className="block">
              <h2 className="text-2xl font-serif font-bold group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
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
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
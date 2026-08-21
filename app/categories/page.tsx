import Link from 'next/link';
import { getAllCategories } from '@/lib/mdx';

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-serif font-bold">Categories</h1>
        <p className="text-muted-foreground mt-2">
          Browse posts by category
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group p-6 border border-border rounded-lg hover:border-primary transition-colors"
          >
            <h2 className="text-xl font-serif font-bold group-hover:text-primary transition-colors">
              {category.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {category.count} {category.count === 1 ? 'post' : 'posts'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
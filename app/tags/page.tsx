import Link from 'next/link';
import { getAllTags } from '@/lib/mdx';

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-serif font-bold">Tags</h1>
        <p className="text-muted-foreground mt-2">
          Browse posts by tag
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link
            key={tag.slug}
            href={`/tags/${tag.slug}`}
            className="group px-4 py-2 bg-accent/50 rounded-full hover:bg-accent transition-colors"
          >
            <span className="text-sm font-medium group-hover:text-primary transition-colors">
              #{tag.name}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              ({tag.count})
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
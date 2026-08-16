'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { FaSearch, FaTimes, FaUser, FaCalendarAlt, FaClock } from 'react-icons/fa';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams?.get('q') || '';
  
  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  interface Post {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    tags: string[];
    author: string;
    readingTime: number;
  }

  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam);
    }
  }, [queryParam]);

  async function performSearch(searchQuery: string) {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setResults([]);
      setHasSearched(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.results || []);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      performSearch(query.trim());
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    router.push('/search');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-serif font-bold mb-4">Search</h1>
      <p className="text-muted-foreground mb-8">
        Find posts by title, content, or tags
      </p>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for articles..."
            className="w-full px-4 py-3 pl-11 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="mt-3 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">Searching...</div>
        </div>
      )}

      {hasSearched && !isLoading && (
        <>
          {results.length === 0 ? (
            <div className="text-center py-12 border border-border rounded-lg">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your search terms or browse all posts.
              </p>
              <Link
                href="/posts"
                className="inline-block mt-4 text-sm text-primary hover:underline"
              >
                View all posts →
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Found {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
              <div className="space-y-8">
                {results.map((post) => (
                  <article key={post.slug} className="group border-b border-border pb-8 last:border-0">
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
                        <span className="text-xs bg-accent px-2.5 py-0.5 rounded-full text-accent-foreground">
                          {post.category}
                        </span>
                      </div>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs text-muted-foreground">
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  </article>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto py-12 text-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
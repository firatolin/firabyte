import { NextRequest, NextResponse } from 'next/server';
import { searchPosts, getSearchSuggestions } from '@/lib/search';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const suggestions = searchParams.get('suggestions') === 'true';

  try {
    if (suggestions) {
      const results = await getSearchSuggestions(query);
      return NextResponse.json({ suggestions: results });
    }

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        results: [], 
        count: 0,
        query 
      });
    }

    const results = await searchPosts(query);
    return NextResponse.json({ 
      results, 
      count: results.length,
      query 
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
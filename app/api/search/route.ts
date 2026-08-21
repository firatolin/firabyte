import { NextRequest, NextResponse } from 'next/server';
import { searchPosts } from '@/lib/search';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';

  try {
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
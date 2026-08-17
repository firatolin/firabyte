import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getAllPosts } from '@/lib/mdx';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.email !== 'firatolesayas@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const posts = getAllPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.email !== 'firatolesayas@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, excerpt, content, category, tags, slug, author, coverImage, status } = body;

    if (!title || !excerpt || !content || !category || !slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const date = new Date().toISOString().split('T')[0];
    const tagsArray = tags ? tags.split(',').map((t: string) => t.trim()) : [];
    
    // Build frontmatter with coverImage if it exists
    let frontmatter = `---
title: "${title}"
date: "${date}"
excerpt: "${excerpt}"
tags: [${tagsArray.map((t: string) => `"${t}"`).join(', ')}]
category: "${category}"
author: "${author || 'Firatol Esayas Tefera'}"
status: "${status || 'draft'}"
`;

    // Add coverImage if it exists
    if (coverImage) {
      frontmatter += `coverImage: "${coverImage}"\n`;
    }

    frontmatter += `---\n\n${content}`;

    const filePath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, frontmatter, 'utf8');

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getPostBySlug } from '@/lib/mdx';
import fs from 'fs';
import path from 'path';

// GET a single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.email !== 'firatolesayas@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const post = getPostBySlug(slug);
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
}

// PUT (update) a post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.email !== 'firatolesayas@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const body = await request.json();
    const { title, excerpt, content, category, tags, author } = body;

    if (!title || !excerpt || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the original post to keep the date
    const originalPost = getPostBySlug(slug);
    
    const tagsArray = tags ? tags.split(',').map((t: string) => t.trim()) : [];
    
    const frontmatter = `---
title: "${title}"
date: "${originalPost.date}"
excerpt: "${excerpt}"
tags: [${tagsArray.map((t: string) => `"${t}"`).join(', ')}]
category: "${category}"
author: "${author || 'Firatol Esayas Tefera'}"
---

${content}`;

    const filePath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    fs.writeFileSync(filePath, frontmatter, 'utf8');

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.email !== 'firatolesayas@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const filePath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    fs.unlinkSync(filePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
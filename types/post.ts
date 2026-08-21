export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  category: string;
  author: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
  readingTime: number;
  toc: TocItem[];
}

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  category: string;
  author: string;
  readingTime: number;
}
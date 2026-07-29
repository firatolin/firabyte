// Database types (matching models)
export interface PostType {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    author: AuthorType | string;
    tags: string[];
    category: string;
    status: 'draft' | 'published' | 'scheduled';
    publishedAt?: Date;
    scheduledFor?: Date;
    readingTime: number;
    viewCount: number;
    likes: number;
    comments: CommentType[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface AuthorType {
    _id: string;
    name: string;
    email: string;
    bio: string;
    avatar?: string;
    socialLinks: {
      github?: string;
      twitter?: string;
      linkedin?: string;
      website?: string;
    };
    role: 'admin' | 'author' | 'contributor';
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CommentType {
    _id: string;
    postId: string;
    authorId?: string;
    authorName: string;
    authorEmail: string;
    authorWebsite?: string;
    content: string;
    parentId?: string;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface SubscriberType {
    _id: string;
    email: string;
    name?: string;
    status: 'active' | 'unsubscribed';
    subscribedAt: Date;
    unsubscribedAt?: Date;
  }
  
  export interface TagType {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    postCount: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CategoryType {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    postCount: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // API response types
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }
  
  // Pagination
  export interface PaginatedResponse<T> {
    posts: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
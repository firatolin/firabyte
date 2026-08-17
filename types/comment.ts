export interface CommentAuthor {
  name: string;
  avatar?: string | null;
}

export interface CommentData {
  id: string;
  content: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
  isApproved: boolean;
  likes: number;
  author: CommentAuthor | null;
  replies: CommentData[];
  parentId: string | null;
  postSlug: string;
}

export interface CreateCommentInput {
  content: string;
  parentId?: string | null;
  authorName?: string;
  authorEmail?: string;
}

export interface CommentResponse {
  comments: CommentData[];
}
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { FaUser, FaReply, FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import type { CommentData } from '@/types/comment';

interface CommentsProps {
  postSlug: string;
}

interface CommentFormData {
  content: string;
  parentId?: string | null;
  authorName?: string;
  authorEmail?: string;
}

interface CommentsResponse {
  comments: CommentData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function Comments({ postSlug }: CommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [error, setError] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComments, setTotalComments] = useState(0);

  // Fetch comments on mount and when postSlug or page changes
  const fetchComments = useCallback(async (page = 1) => {
    try {
      const response = await fetch(`/api/posts/${postSlug}/comments?page=${page}&limit=20`);
      if (response.ok) {
        const data: CommentsResponse = await response.json();
        setComments(data.comments || []);
        setTotalPages(data.totalPages || 1);
        setTotalComments(data.total || 0);
        setCurrentPage(data.page || 1);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [postSlug]);

  useEffect(() => {
    let isActive = true;

    const loadComments = async () => {
      if (!isActive) return;
      setIsLoading(true);
      await fetchComments(1);
      if (isActive) setIsLoading(false);
    };

    loadComments();

    return () => {
      isActive = false;
    };
  }, [postSlug, fetchComments]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setIsLoading(true);
    fetchComments(newPage).then(() => setIsLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    setError('');
    setIsSubmitting(true);

    try {
      const formData: CommentFormData = {
        content: trimmedContent,
        parentId: replyTo?.id || null,
      };

      if (!session) {
        if (!guestName.trim() || !guestEmail.trim()) {
          setError('Name and email are required');
          setIsSubmitting(false);
          return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(guestEmail.trim())) {
          setError('Invalid email format');
          setIsSubmitting(false);
          return;
        }
        
        formData.authorName = guestName.trim();
        formData.authorEmail = guestEmail.trim();
      }

      const response = await fetch(`/api/posts/${postSlug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setComments((prev) => [data.comment, ...prev]);
        setTotalComments((prev) => prev + 1);
        setContent('');
        setReplyTo(null);
        setGuestName('');
        setGuestEmail('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to post comment');
      }
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId: string, authorName: string) => {
    setReplyTo({ id: commentId, name: authorName });
    setContent(`@${authorName} `);
    document.getElementById('comment-input')?.focus();
  };

  const cancelReply = () => {
    setReplyTo(null);
    setContent('');
  };

  const handleLike = async (commentId: string, currentLikes: number, currentlyLiked: boolean) => {
    // Optimistic update
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: currentlyLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId
                ? { ...reply, likes: currentlyLiked ? reply.likes - 1 : reply.likes + 1 }
                : reply
            ),
          };
        }
        return comment;
      })
    );

    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        // Revert on failure
        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === commentId) {
              return { ...comment, likes: currentLikes };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === commentId ? { ...reply, likes: currentLikes } : reply
                ),
              };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      // Revert on error
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, likes: currentLikes };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === commentId ? { ...reply, likes: currentLikes } : reply
              ),
            };
          }
          return comment;
        })
      );
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Loading comments...
      </div>
    );
  }

  return (
    <div className="mt-16 border-t border-border pt-8">
      <h3 className="text-2xl font-serif font-bold mb-6">
        Comments ({totalComments})
      </h3>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4">
          {!session && (
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your name *"
                className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                required
              />
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Your email *"
                className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                required
              />
            </div>
          )}

          {replyTo && (
            <div className="flex items-center justify-between text-sm bg-accent/20 px-4 py-2 rounded-lg">
              <span className="text-muted-foreground">
                Replying to <strong>{replyTo.name}</strong>
              </span>
              <button
                type="button"
                onClick={cancelReply}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          <textarea
            id="comment-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={session ? 'Write a comment...' : 'Write a comment... (sign in for better experience)'}
            rows={4}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-y"
            required
          />

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>

          {!session && (
            <p className="text-xs text-muted-foreground">
              By commenting, you agree to our privacy policy.
            </p>
          )}
        </div>
      </form>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          <>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onLike={handleLike}
              />
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-3 py-1 text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  onReply,
  onLike,
}: {
  comment: CommentData;
  onReply: (id: string, name: string) => void;
  onLike: (id: string, likes: number, liked: boolean) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes || 0);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;
    setLikeCount(newCount);
    onLike(comment.id, likeCount, liked);
  };

  return (
    <div className="border-l-2 border-border pl-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
          <FaUser className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-sm">
              {comment.author?.name || comment.authorName}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(comment.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
          <p className="text-sm leading-relaxed mt-1">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {liked ? (
                <FaHeart className="h-3 w-3 text-red-500" />
              ) : (
                <FaRegHeart className="h-3 w-3" />
              )}
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>
            <button
              onClick={() => onReply(comment.id, comment.author?.name || comment.authorName)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <FaReply className="h-3 w-3" />
              Reply
            </button>
          </div>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 mt-4 space-y-4 border-l-2 border-border/50 pl-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-accent/50 flex items-center justify-center shrink-0">
                <FaUser className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-sm">
                    {reply.author?.name || reply.authorName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(reply.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mt-1">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
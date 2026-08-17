'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { FaUser, FaReply, FaHeart, FaRegHeart } from 'react-icons/fa';
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

  // Fetch comments on mount and when postSlug changes
  useEffect(() => {
    let isActive = true;

    const fetchComments = async () => {
      if (!isActive) return;

      try {
        const response = await fetch(`/api/posts/${postSlug}/comments`);
        if (response.ok && isActive) {
          const data = await response.json();
          setComments(data.comments || []);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchComments();

    return () => {
      isActive = false;
    };
  }, [postSlug]);

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
        Comments ({comments.length})
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
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
            />
          ))
        )}
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  onReply,
}: {
  comment: CommentData;
  onReply: (id: string, name: string) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes || 0);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
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
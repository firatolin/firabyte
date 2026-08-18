'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

export function PostCardSkeleton({ count = 1 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col md:flex-row gap-6 border-b border-border pb-8">
          <div className="md:w-48 shrink-0">
            <Skeleton height={160} className="rounded-lg" />
          </div>
          <div className="flex-1 space-y-3">
            <Skeleton height={32} width="80%" />
            <Skeleton height={20} count={2} />
            <div className="flex gap-4">
              <Skeleton height={16} width={80} />
              <Skeleton height={16} width={80} />
              <Skeleton height={16} width={60} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PostPageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12">
        <Skeleton height={48} width="90%" className="mb-4" />
        <Skeleton height={24} width="60%" className="mb-6" />
        <Skeleton height={200} className="rounded-xl" />
      </div>
      <div className="space-y-4">
        <Skeleton height={24} count={3} />
        <Skeleton height={24} width="70%" />
        <Skeleton height={24} count={2} />
      </div>
    </div>
  );
}

export function CommentsSkeleton() {
  return (
    <div className="mt-16 border-t border-border pt-8">
      <Skeleton height={32} width={200} className="mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton circle height={40} width={40} />
            <div className="flex-1 space-y-2">
              <Skeleton height={16} width={150} />
              <Skeleton height={20} count={2} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border-b border-border pb-6">
          <Skeleton height={28} width="70%" className="mb-2" />
          <Skeleton height={18} count={2} />
          <div className="flex gap-4 mt-2">
            <Skeleton height={14} width={60} />
            <Skeleton height={14} width={60} />
          </div>
        </div>
      ))}
    </div>
  );
}
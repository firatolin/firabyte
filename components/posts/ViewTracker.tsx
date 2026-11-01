'use client';

import { useEffect } from 'react';

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // Fire-and-forget view tracking; never block rendering
    fetch(`/api/views/${slug}`, { method: 'POST' }).catch(() => {});
  }, [slug]);

  return null;
}
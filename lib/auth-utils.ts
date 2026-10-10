import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import type { Session } from 'next-auth';

/**
 * Check if the current session belongs to an admin user
 */
export async function requireAdmin(): Promise<{ session: Session } | NextResponse> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }
  
  return { session };
}

/**
 * Get the current session (for protected routes that need user info)
 */
export async function getAuthSession() {
  return getServerSession(authOptions);
}
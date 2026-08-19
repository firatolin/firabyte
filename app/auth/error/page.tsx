'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { FaExclamationTriangle, FaEnvelope } from 'react-icons/fa';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'OAuthAccountNotLinked':
        return {
          title: 'Account Already Exists',
          message: 'An account with this email already exists. Please sign in with your email and password instead.',
          action: {
            text: 'Sign in with Email',
            href: '/auth/signin',
          },
        };
      case 'OAuthCreateAccount':
        return {
          title: 'Could Not Create Account',
          message: 'There was an issue creating your account. Please try again.',
          action: {
            text: 'Try Again',
            href: '/auth/signin',
          },
        };
      default:
        return {
          title: 'Authentication Error',
          message: error || 'Something went wrong. Please try again.',
          action: {
            text: 'Go to Sign In',
            href: '/auth/signin',
          },
        };
    }
  };

  const { title, message, action } = getErrorMessage();

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
            <FaExclamationTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-serif font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">{message}</p>
        </div>

        <div className="space-y-4">
          <Link
            href={action.href}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <FaEnvelope className="h-4 w-4" />
            {action.text}
          </Link>

          <Link
            href="/"
            className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {error === 'OAuthAccountNotLinked' && (
          <div className="mt-6 p-4 bg-accent/20 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground text-center">
              💡 Tip: If you already have an account, use your email and password to sign in.
              If you forgot your password, you can reset it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
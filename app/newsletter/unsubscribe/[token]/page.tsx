import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';

interface UnsubscribePageProps {
  params: Promise<{ token: string }>;
}

export default async function UnsubscribePage({ params }: UnsubscribePageProps) {
  const resolvedParams = await params;
  const { token } = resolvedParams;

  const subscriber = await prisma.subscriber.findUnique({
    where: { token },
  });

  if (!subscriber) {
    notFound();
  }

  const isUnsubscribed = subscriber.status === 'UNSUBSCRIBED';

  return (
    <div className="max-w-md mx-auto py-20 text-center">
      {isUnsubscribed ? (
        <>
          <div className="text-4xl mb-4"></div>
          <h1 className="text-2xl font-serif font-bold mb-2">You&apos;ve Been Unsubscribed</h1>
          <p className="text-muted-foreground mb-6">
            You will no longer receive emails from Firabyte.
          </p>
          <Link
            href="/"
            className="text-primary hover:underline"
          >
            ← Back to Home
          </Link>
        </>
      ) : (
        <>
          <div className="text-4xl mb-4">📧</div>
          <h1 className="text-2xl font-serif font-bold mb-2">Confirm Unsubscribe</h1>
          <p className="text-muted-foreground mb-6">
            Are you sure you want to unsubscribe from Firabyte newsletter?
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href={`/newsletter/unsubscribe/${token}/confirm`}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Yes, Unsubscribe
            </Link>
            <Link
              href="/"
              className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
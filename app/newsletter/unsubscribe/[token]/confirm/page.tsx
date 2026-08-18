import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';

interface ConfirmUnsubscribePageProps {
  params: Promise<{ token: string }>;
}

export default async function ConfirmUnsubscribePage({ params }: ConfirmUnsubscribePageProps) {
  const resolvedParams = await params;
  const { token } = resolvedParams;

  const subscriber = await prisma.subscriber.findUnique({
    where: { token },
  });

  if (!subscriber) {
    redirect('/');
  }

  await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: {
      status: 'UNSUBSCRIBED',
      unsubscribedAt: new Date(),
    },
  });

  return (
    <div className="max-w-md mx-auto py-20 text-center">
      <div className="text-4xl mb-4"></div>
      <h1 className="text-2xl font-serif font-bold mb-2">You&apos;ve Been Unsubscribed</h1>
      <p className="text-muted-foreground mb-6">
        You will no longer receive emails from Firabyte.
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        If this was a mistake, you can{' '}
        <Link
          href="/"
          className="text-primary hover:underline"
        >
          subscribe again
        </Link>
        .
      </p>
      <Link
        href="/"
        className="text-primary hover:underline"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
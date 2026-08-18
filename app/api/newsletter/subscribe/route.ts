import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { randomUUID } from 'crypto';
import { sendWelcomeEmail } from '@/lib/email-templates';

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = subscribeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, name } = result.data;

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.status === 'ACTIVE') {
        return NextResponse.json(
          { error: 'You are already subscribed!' },
          { status: 409 }
        );
      } else {
        await prisma.subscriber.update({
          where: { email },
          data: {
            status: 'ACTIVE',
            subscribedAt: new Date(),
            unsubscribedAt: null,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'You have been resubscribed!',
        });
      }
    }

    // Create new subscriber
    const token = randomUUID();
    await prisma.subscriber.create({
      data: {
        email,
        name: name || '',
        token: token,
        status: 'ACTIVE',
      },
    });

    // Send welcome email
    try {
      await sendWelcomeEmail({
        email,
        name,
        token,
      });
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
      // Don't fail subscription if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully! Check your email.',
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
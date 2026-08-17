import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { randomUUID } from 'crypto';

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema
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
        // Reactivate subscriber
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

    // Create new subscriber with token
    const token = randomUUID();
    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        name: name || '',
        token: token,
        status: 'ACTIVE',
      },
    });

    // Send welcome email
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Firabyte <newsletter@firabyte.tech>',
          to: email,
          subject: 'Welcome to Firabyte Newsletter!',
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="font-size: 24px; font-weight: bold; color: #0A1128;">Welcome to Firabyte!</h1>
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                Thanks for subscribing to our newsletter. You'll receive the latest tech insights, tutorials, and updates.
              </p>
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                Stay tuned for amazing content!
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 14px; color: #666;">
                You can <a href="${process.env.NEXTAUTH_URL}/newsletter/unsubscribe/${token}" style="color: #0A1128;">unsubscribe</a> at any time.
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
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
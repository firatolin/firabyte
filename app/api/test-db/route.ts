import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test the database connection by counting users
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      message: '✅ Database connected successfully!',
      data: {
        userCount,
        database: 'PostgreSQL (Neon)',
        orm: 'Prisma',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '❌ Failed to connect to database',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
// /app/api/learning-sessions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId, setId, mode, totalWords } = await request.json();

    const session = await prisma.learningSession.create({
      data: {
        userId,
        setId,
        mode,
        totalWords,
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error creating learning session:', error);
    return NextResponse.json(
      { error: 'Failed to create learning session' },
      { status: 500 }
    );
  }
}

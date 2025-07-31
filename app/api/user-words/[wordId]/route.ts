// /app/api/user-words/[wordId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { wordId: string };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { wordId } = params;
    const { userId, isCorrect, masteryLevel } = await request.json();

    // Update or create user word record
    const userWord = await prisma.userWord.upsert({
      where: {
        userId_wordId: {
          userId,
          wordId,
        },
      },
      update: {
        timesSeen: { increment: 1 },
        timesCorrect: isCorrect ? { increment: 1 } : undefined,
        masteryLevel,
        lastReviewed: new Date(),
        isLearned: masteryLevel >= 80,
        nextReview: new Date(Date.now() + (masteryLevel >= 80 ? 7 : 3) * 24 * 60 * 60 * 1000),
      },
      create: {
        userId,
        wordId,
        timesSeen: 1,
        timesCorrect: isCorrect ? 1 : 0,
        masteryLevel,
        lastReviewed: new Date(),
        isLearned: masteryLevel >= 80,
        nextReview: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json(userWord);
  } catch (error) {
    console.error('Error updating user word:', error);
    return NextResponse.json(
      { error: 'Failed to update user word' },
      { status: 500 }
    );
  }
}

// /app/api/vocabulary-progress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: NextRequest) {
  try {
    const { userId, setId, completedWords, accuracyRate, timeSpent } = await request.json();

    const progress = await prisma.vocabularyProgress.upsert({
      where: {
        userId_setId: {
          userId,
          setId,
        },
      },
      update: {
        completedWords: { increment: completedWords },
        accuracyRate,
        timeSpent: { increment: timeSpent },
        lastStudied: new Date(),
      },
      create: {
        userId,
        setId,
        completedWords,
        accuracyRate,
        timeSpent,
        lastStudied: new Date(),
      },
    });

    // Update daily learning record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.dailyLearning.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        wordsLearned: { increment: completedWords },
        timeSpent: { increment: timeSpent },
        sessionsCompleted: { increment: 1 },
        accuracy: accuracyRate,
      },
      create: {
        userId,
        date: today,
        wordsLearned: completedWords,
        timeSpent,
        sessionsCompleted: 1,
        accuracy: accuracyRate,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating vocabulary progress:', error);
    return NextResponse.json(
      { error: 'Failed to update vocabulary progress' },
      { status: 500 }
    );
  }
}
// /app/api/learning-stats/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { userId: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = params;

    // Get or create learning stats
    let learningStats = await prisma.learningStats.findUnique({
      where: { userId },
    });

    if (!learningStats) {
      learningStats = await prisma.learningStats.create({
        data: { userId },
      });
    }

    // Get additional computed stats
    const [totalWordsResult, dailyLearningToday] = await Promise.all([
      prisma.userWord.aggregate({
        where: { userId },
        _count: { id: true },
        _sum: { masteryLevel: true },
      }),
      prisma.dailyLearning.findUnique({
        where: {
          userId_date: {
            userId,
            date: new Date(),
          },
        },
      }),
    ]);

    const totalWords = totalWordsResult._count.id || 0;
    const avgMasteryLevel = totalWords > 0 
      ? Math.round((totalWordsResult._sum.masteryLevel || 0) / totalWords) 
      : 0;

    const stats = {
      totalWords: learningStats.vocabularyLearned,
      wordsLearned: totalWords,
      dailyStreak: learningStats.currentVocabStreak,
      weeklyGoal: learningStats.weeklyVocabGoal,
      weeklyProgress: learningStats.weeklyVocabProgress,
      masteryScore: avgMasteryLevel,
      timeSpent: learningStats.totalVocabularyTime,
      accuracy: learningStats.overallAccuracy,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching learning stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learning stats' },
      { status: 500 }
    );
  }
}


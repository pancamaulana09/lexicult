// /lib/prisma.ts
import { PrismaClient } from '@/lib/generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Utility functions for common operations
export class VocabularyService {
  // Get vocabulary sets with user progress
  static async getVocabularySetsForUser(userId: string) {
    return prisma.vocabularySet.findMany({
      where: {
        isPublished: true,
      },
      include: {
        words: {
          include: {
            userWords: {
              where: { userId },
            },
          },
        },
        userProgress: {
          where: { userId },
        },
        _count: {
          select: {
            words: true,
          },
        },
      },
      orderBy: [
        { isPremium: 'asc' },
        { rating: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  // Get user's learning statistics
  static async getUserLearningStats(userId: string) {
    const stats = await prisma.learningStats.findUnique({
      where: { userId },
    });

    if (!stats) {
      return prisma.learningStats.create({
        data: { userId },
      });
    }

    return stats;
  }

  // Create learning session
  static async createLearningSession(data: {
    userId: string;
    setId: string;
    mode: string;
    totalWords: number;
  }) {
    return prisma.learningSession.create({
      data,
    });
  }

  // Update user word progress
  static async updateUserWordProgress(
    userId: string,
    wordId: string,
    isCorrect: boolean,
    masteryLevel: number
  ) {
    return prisma.userWord.upsert({
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
        nextReview: new Date(
          Date.now() + (masteryLevel >= 80 ? 7 : 3) * 24 * 60 * 60 * 1000
        ),
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
  }

  // Toggle word favorite status
  static async toggleWordFavorite(userId: string, wordId: string) {
    const currentUserWord = await prisma.userWord.findUnique({
      where: {
        userId_wordId: {
          userId,
          wordId,
        },
      },
    });

    return prisma.userWord.upsert({
      where: {
        userId_wordId: {
          userId,
          wordId,
        },
      },
      update: {
        isFavorite: !currentUserWord?.isFavorite,
      },
      create: {
        userId,
        wordId,
        isFavorite: true,
      },
    });
  }

  // Complete learning session
  static async completeLearningSession(
    sessionId: string,
    correctAnswers: number,
    completedWords: number,
    accuracyRate: number,
    timeSpent: number
  ) {
    return prisma.learningSession.update({
      where: { id: sessionId },
      data: {
        correctAnswers,
        completedWords,
        accuracyRate,
        timeSpent,
        isCompleted: true,
        completedAt: new Date(),
      },
    });
  }

  // Update vocabulary set progress
  static async updateVocabularyProgress(
    userId: string,
    setId: string,
    completedWords: number,
    accuracyRate: number,
    timeSpent: number
  ) {
    // Get total words in set
    const vocabularySet = await prisma.vocabularySet.findUnique({
      where: { id: setId },
      include: {
        _count: {
          select: {
            words: true,
          },
        },
      },
    });

    if (!vocabularySet) {
      throw new Error('Vocabulary set not found');
    }

    const totalWords = vocabularySet._count.words;
    const isCompleted = completedWords >= totalWords;

    return prisma.vocabularyProgress.upsert({
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
        isCompleted,
        lastStudied: new Date(),
      },
      create: {
        userId,
        setId,
        completedWords,
        totalWords,
        accuracyRate,
        timeSpent,
        isCompleted,
        lastStudied: new Date(),
      },
    });
  }

  // Update daily learning statistics
  static async updateDailyLearning(
    userId: string,
    wordsLearned: number,
    timeSpent: number,
    accuracy: number
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.dailyLearning.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        wordsLearned: { increment: wordsLearned },
        timeSpent: { increment: timeSpent },
        sessionsCompleted: { increment: 1 },
        accuracy,
      },
      create: {
        userId,
        date: today,
        wordsLearned,
        timeSpent,
        sessionsCompleted: 1,
        accuracy,
      },
    });
  }

  // Get words due for review (spaced repetition)
  static async getWordsForReview(userId: string, limit = 20) {
    return prisma.userWord.findMany({
      where: {
        userId,
        nextReview: {
          lte: new Date(),
        },
      },
      include: {
        word: {
          include: {
            vocabularySet: true,
          },
        },
      },
      orderBy: {
        nextReview: 'asc',
      },
      take: limit,
    });
  }

  // Get user's favorite words
  static async getFavoriteWords(userId: string) {
    return prisma.userWord.findMany({
      where: {
        userId,
        isFavorite: true,
      },
      include: {
        word: {
          include: {
            vocabularySet: true,
          },
        },
      },
      orderBy: {
        lastReviewed: 'desc',
      },
    });
  }

  // Get learning streak information
  static async calculateLearningStreak(userId: string) {
    const dailyLearningRecords = await prisma.dailyLearning.findMany({
      where: {
        userId,
        wordsLearned: {
          gt: 0,
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: 365, // Check last year
    });

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < dailyLearningRecords.length; i++) {
      const recordDate = new Date(dailyLearningRecords[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);

      if (recordDate.getTime() === expectedDate.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    return currentStreak;
  }

  // Get weekly progress
  static async getWeeklyProgress(userId: string) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weeklyLearning = await prisma.dailyLearning.findMany({
      where: {
        userId,
        date: {
          gte: weekStart,
        },
      },
    });

    const totalWordsLearned = weeklyLearning.reduce(
      (sum, day) => sum + day.wordsLearned,
      0
    );

    const totalTimeSpent = weeklyLearning.reduce(
      (sum, day) => sum + day.timeSpent,
      0
    );

    const avgAccuracy = weeklyLearning.length > 0
      ? weeklyLearning.reduce((sum, day) => sum + day.accuracy, 0) / weeklyLearning.length
      : 0;

    return {
      wordsLearned: totalWordsLearned,
      timeSpent: totalTimeSpent,
      accuracy: avgAccuracy,
      daysActive: weeklyLearning.length,
    };
  }
}

// Export types for use in components
export type {
  VocabularySet,
  VocabularyWord,
  UserWord,
  LearningSession,
  SessionAnswer,
  VocabularyProgress,
  LearningStats,
  DailyLearning,
} from '@/lib/generated/prisma';
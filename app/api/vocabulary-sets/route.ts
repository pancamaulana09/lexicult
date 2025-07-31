// /app/api/vocabulary-sets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const vocabularySets = await prisma.vocabularySet.findMany({
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
      },
      orderBy: [
        { isPremium: 'asc' },
        { rating: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // Transform data to match frontend interface
    const transformedSets = vocabularySets.map(set => {
      const userProgress = set.userProgress[0];
      const wordsWithUserData = set.words.map(word => {
        const userWord = word.userWords[0];
        return {
          id: word.id,
          word: word.word,
          translation: word.translation,
          pronunciation: word.pronunciation,
          partOfSpeech: word.partOfSpeech,
          difficulty: word.difficulty,
          definition: word.definition,
          examples: word.examples,
          synonyms: word.synonyms,
          antonyms: word.antonyms,
          audioUrl: word.audioUrl,
          imageUrl: word.imageUrl,
          tags: word.tags,
          isFavorite: userWord?.isFavorite || false,
          isLearned: userWord?.isLearned || false,
          masteryLevel: userWord?.masteryLevel || 0,
          timesSeen: userWord?.timesSeen || 0,
          timesCorrect: userWord?.timesCorrect || 0,
          lastReviewed: userWord?.lastReviewed || null,
        };
      });

      return {
        id: set.id,
        title: set.title,
        description: set.description,
        category: set.category,
        level: set.level,
        wordCount: set.words.length,
        completedWords: userProgress?.completedWords || 0,
        estimatedTime: set.estimatedTime,
        thumbnail: set.thumbnail,
        author: set.author,
        rating: set.rating,
        isPremium: set.isPremium,
        isUnlocked: !set.isPremium, // Add premium logic here
        words: wordsWithUserData,
      };
    });

    return NextResponse.json(transformedSets);
  } catch (error) {
    console.error('Error fetching vocabulary sets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vocabulary sets' },
      { status: 500 }
    );
  }
}








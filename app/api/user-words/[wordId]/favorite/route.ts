// /app/api/user-words/[wordId]/favorite/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { wordId: string };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { wordId } = params;
    const { userId } = await request.json();

    // Get current favorite status
    const currentUserWord = await prisma.userWord.findUnique({
      where: {
        userId_wordId: {
          userId,
          wordId,
        },
      },
    });

    const userWord = await prisma.userWord.upsert({
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

    return NextResponse.json(userWord);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json(
      { error: 'Failed to toggle favorite' },
      { status: 500 }
    );
  }
}
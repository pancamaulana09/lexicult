// app/api/stories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const search = searchParams.get('search');

    // Dynamic where clause
    const where: Record<string, any> = {};

    if (category && category !== 'All') {
      where.category = category;
    }

    if (level && level !== 'All') {
      where.level = level;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }

    const stories = await prisma.story.findMany({
      where,
      include: {
        bookmarks: userId
          ? {
              where: { userId },
              select: { userId: true }
            }
          : false,
        progressRecords: userId
          ? {
              where: { userId },
              select: { progress: true, isCompleted: true }
            }
          : false
      },
      orderBy: [
        { rating: 'desc' },
        { totalReads: 'desc' }
      ]
    });

    return NextResponse.json({ stories }, { status: 200 });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

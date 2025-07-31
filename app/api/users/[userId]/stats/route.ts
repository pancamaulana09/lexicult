// app/api/users/[userId]/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Get or create learning stats
    let stats = await prisma.learningStats.findUnique({
      where: { userId }
    });

    if (!stats) {
      stats = await prisma.learningStats.create({
        data: { userId }
      });
    }

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching learning stats:', error);
    return NextResponse.json({ error: 'Failed to fetch learning stats' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
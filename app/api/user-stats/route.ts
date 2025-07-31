// app/api/user-stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    console.log('Fetching stats for userId:', userId);

    // Get or create learning stats
    let stats = await prisma.learningStats.findUnique({
      where: { userId }
    });

    if (!stats) {
      console.log('Creating new stats for user:', userId);
      stats = await prisma.learningStats.create({
        data: { userId }
      });
    }

    console.log('Stats found/created:', stats);
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error in user-stats API:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch learning stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

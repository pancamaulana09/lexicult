// app/api/test-db/route.ts (for debugging database connection)
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Database connection test result:', result);
    
    // Test if tables exist
    const userCount = await prisma.user.count();
    const storyCount = await prisma.story.count();
    const statsCount = await prisma.learningStats.count();
    
    console.log('Table counts:', { userCount, storyCount, statsCount });
    
    return NextResponse.json({ 
      success: true,
      connection: 'OK',
      counts: { userCount, storyCount, statsCount },
      testQuery: result
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
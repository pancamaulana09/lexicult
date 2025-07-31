// /app/api/session-answers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const answerData = await request.json();

    const answer = await prisma.sessionAnswer.create({
      data: answerData,
    });

    return NextResponse.json(answer);
  } catch (error) {
    console.error('Error creating session answer:', error);
    return NextResponse.json(
      { error: 'Failed to create session answer' },
      { status: 500 }
    );
  }
}

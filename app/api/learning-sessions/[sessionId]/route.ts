// /app/api/learning-sessions/[sessionId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { sessionId: string };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { sessionId } = params;
    const updateData = await request.json();

    const session = await prisma.learningSession.update({
      where: { id: sessionId },
      data: updateData,
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error updating learning session:', error);
    return NextResponse.json(
      { error: 'Failed to update learning session' },
      { status: 500 }
    );
  }
}

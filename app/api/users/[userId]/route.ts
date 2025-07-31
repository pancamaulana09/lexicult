// app/api/users/[userId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true
      }
    });

    // if (!user) {
    //   return NextResponse.json({ error: 'User not found' }, { status: 404 });
    // }
    console.log(params)
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

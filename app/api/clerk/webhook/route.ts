// app/api/clerk/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = body.data;

    const email = email_addresses?.[0]?.email_address ?? 'unknown@noemail.com';

    try {
      await prisma.user.upsert({
        where: { id },
        update: {
          email,
          name: `${first_name ?? ''} ${last_name ?? ''}`.trim(),
          avatarUrl: image_url,
        },
        create: {
          id,
          email,
          name: `${first_name ?? ''} ${last_name ?? ''}`.trim(),
          avatarUrl: image_url,
        },
      });

      return NextResponse.json({ success: true });
    } catch (err) {
      console.error('Error syncing user:', err);
      return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

// pages/api/bookmarks/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '../../../lib/prisma';
import { findOrCreateUser } from '../../../lib/syncUser';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId: clerkId } = getAuth(req);
  if (!clerkId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { storyId } = req.body;
  if (!storyId) {
    return res.status(400).json({ error: 'storyId is required' });
  }

  try {
    const localUser = await findOrCreateUser();
    const bookmarkId = { userId: localUser.id, storyId };

    const existingBookmark = await prisma.bookmark.findUnique({
      where: { userId_storyId: bookmarkId },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({ where: { userId_storyId: bookmarkId } });
      res.status(200).json({ message: 'Bookmark removed' });
    } else {
      await prisma.bookmark.create({ data: bookmarkId });
      res.status(201).json({ message: 'Bookmark added' });
    }
  } catch (error) {
    console.error("Failed to toggle bookmark:", error);
    res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
}
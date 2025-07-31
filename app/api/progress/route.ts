import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '../../../lib/prisma';
import { findOrCreateUser } from '../../../lib/syncUser';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { storyId, progress, isCompleted } = req.body;
    if (!storyId || progress === undefined) {
      return res.status(400).json({ error: 'Missing storyId or progress' });
    }
    console.log("🧩 clerkId from getAuth:", clerkId);
    const localUser = await findOrCreateUser(clerkId);
    console.log("✅ Local user synced:", localUser.id);

    const uniqueProgressId = { userId: localUser.id, storyId };

    const previousProgress = await prisma.storyProgress.findUnique({
      where: { userId_storyId: uniqueProgressId },
    });

    const wasAlreadyCompleted = previousProgress?.isCompleted ?? false;

    const result = await prisma.$transaction(async (tx) => {
      const updatedProgress = await tx.storyProgress.upsert({
        where: { userId_storyId: uniqueProgressId },
        update: { progress, isCompleted },
        create: { userId: localUser.id, storyId, progress, isCompleted },
      });

      if (isCompleted && !wasAlreadyCompleted) {
        const story = await tx.story.findUnique({ where: { id: storyId } });
        if (!story) throw new Error(`Story not found with ID: ${storyId}`);

        await Promise.all([
          tx.learningStats.upsert({
            where: { userId: localUser.id },
            update: {
              storiesRead: { increment: 1 },
              totalReadingTime: { increment: story.duration },
            },
            create: {
              userId: localUser.id,
              storiesRead: 1,
              totalReadingTime: story.duration,
              currentReadingStreak: 1,
              vocabularyLearned: 0,
              vocabularySetsCompleted: 0,
              totalVocabularyTime: 0,
              currentVocabStreak: 0,
              weeklyVocabGoal: 50,
              weeklyVocabProgress: 0,
              comprehensionScore: 0,
              overallAccuracy: 0,
              masteryScore: 0,
            },
          }),
          tx.story.update({
            where: { id: storyId },
            data: { totalReads: { increment: 1 } },
          }),
        ]);
      }

      return updatedProgress;
    });

    return res.status(200).json({ message: 'Progress updated', record: result });

  }catch (error: any) {
  console.error("🔥 Fatal API error:", error);
  try {
    return res.status(500).json({ error: error.message || 'Unknown server error' });
  } catch (jsonErr) {
    console.error("❌ Failed to send error response:", jsonErr);
    res.statusCode = 500;
    res.end("Server crashed before responding");
  }
}
}

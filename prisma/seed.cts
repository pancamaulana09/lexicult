import { PrismaClient } from '@/lib/generated/prisma';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Users
  const user = await prisma.user.create({
    data: {
      email: 'akira@example.com',
      name: 'Akira',
      avatarUrl: 'https://i.pravatar.cc/300',
    },
  });

  // 2. Create Stories
  const story = await prisma.story.create({
    data: {
      title: 'The Curious Fox',
      description: 'A short story about a curious fox exploring the woods.',
      level: 'Beginner',
      duration: 5,
      category: 'Nature',
      thumbnail: 'https://source.unsplash.com/random/300x200?forest',
      language: 'English',
      publishedDate: new Date(),
      tags: ['animals', 'forest', 'beginner'],
    },
  });

  // 3. Create Vocabulary Set
  const vocabSet = await prisma.vocabularySet.create({
    data: {
      title: 'Basic Animals',
      description: 'Learn the names of common animals in English.',
      category: 'Nature',
      level: 'Beginner',
      estimatedTime: 10,
      author: 'LexiBot',
      isPublished: true,
      isPremium: false,
    },
  });

  // 4. Add Vocabulary Words
  const word = await prisma.vocabularyWord.create({
    data: {
      word: 'Fox',
      translation: 'Rubah',
      definition: 'A small to medium-sized omnivorous mammal.',
      partOfSpeech: 'Noun',
      difficulty: 'Easy',
      examples: ['The fox ran through the forest.', 'Foxes are clever animals.'],
      synonyms: ['vulpine'],
      antonyms: ['wolf'],
      setId: vocabSet.id,
    },
  });

  // 5. User Progress and Word Interaction
  await prisma.vocabularyProgress.create({
    data: {
      userId: user.id,
      setId: vocabSet.id,
      completedWords: 1,
      totalWords: 1,
      accuracyRate: 100.0,
      isCompleted: true,
    },
  });

  await prisma.userWord.create({
    data: {
      userId: user.id,
      wordId: word.id,
      isFavorite: true,
      isLearned: true,
      masteryLevel: 90,
      timesSeen: 2,
      timesCorrect: 2,
    },
  });

  // 6. Learning Session and Answers
  const session = await prisma.learningSession.create({
    data: {
      userId: user.id,
      setId: vocabSet.id,
      mode: 'Flashcard',
      totalWords: 1,
      correctAnswers: 1,
      completedWords: 1,
      accuracyRate: 100,
      isCompleted: true,
    },
  });

  await prisma.sessionAnswer.create({
    data: {
      sessionId: session.id,
      wordId: word.id,
      userAnswer: 'Fox',
      correctAnswer: 'Fox',
      isCorrect: true,
    },
  });

  // 7. Learning Stats
  await prisma.learningStats.create({
    data: {
      userId: user.id,
      storiesRead: 1,
      totalReadingTime: 5,
      vocabularyLearned: 1,
      vocabularySetsCompleted: 1,
      totalVocabularyTime: 10,
      comprehensionScore: 85,
      overallAccuracy: 100,
      masteryScore: 90,
    },
  });

  // 8. Daily Tracking
  await prisma.dailyLearning.create({
    data: {
      userId: user.id,
      date: new Date(),
      wordsLearned: 1,
      timeSpent: 10,
      sessionsCompleted: 1,
      accuracy: 100,
      storiesRead: 1,
      readingTime: 5,
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

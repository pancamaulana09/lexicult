// lib/seed.ts - Script to populate database with sample data
import { PrismaClient, StoryLevel, Language } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create sample user
    const user = await prisma.user.upsert({
      where: { email: 'demo@example.com' },
      update: {},
      create: {
        id: 'demo-user-id',
        email: 'demo@example.com',
        name: 'Demo User',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      }
    });

    console.log('✅ Created user:', user.name);

    // Create sample stories
    const stories = [
      {
        id: '1',
        title: 'Legenda Danau Toba',
        description: 'Cerita rakyat tentang asal mula Danau Toba yang terkenal di Sumatera Utara',
        level: StoryLevel.Intermediate,
        duration: 15,
        category: 'Folklore',
        thumbnail: '/images/learning-illustrations/danau-toba.jpg',
        rating: 4.8,
        totalReads: 2847,
        audioAvailable: true,
        language: Language.Indonesian,
        publishedDate: new Date('2024-01-15'),
        tags: ['Sumatera', 'Legenda', 'Danau']
      },
      {
        id: '2',
        title: 'Si Kancil dan Buaya',
        description: 'Kisah cerdik Si Kancil yang mengakali buaya-buaya di sungai',
        level: StoryLevel.Beginner,
        duration: 8,
        category: 'Fable',
        thumbnail: '/images/learning-illustrations/kancil.jpg',
        rating: 4.9,
        totalReads: 5632,
        audioAvailable: true,
        language: Language.Indonesian,
        publishedDate: new Date('2024-01-20'),
        tags: ['Kancil', 'Hewan', 'Moral']
      },
      {
        id: '3',
        title: 'The Lost Temple',
        description: 'An adventurous story about discovering an ancient temple in the jungle',
        level: StoryLevel.Advanced,
        duration: 25,
        category: 'Adventure',
        thumbnail: '/images/learning-illustrations/temple.jpg',
        rating: 4.7,
        totalReads: 1890,
        audioAvailable: true,
        language: Language.English,
        publishedDate: new Date('2024-01-10'),
        tags: ['Adventure', 'Mystery', 'Ancient']
      },
      {
        id: '4',
        title: 'Malin Kundang',
        description: 'Cerita klasik tentang anak durhaka yang dikutuk menjadi batu',
        level: StoryLevel.Intermediate,
        duration: 12,
        category: 'Folklore',
        thumbnail: '/images/learning-illustrations/malin-kundang.jpg',
        rating: 4.6,
        totalReads: 3456,
        audioAvailable: true,
        language: Language.Indonesian,
        publishedDate: new Date('2024-01-08'),
        tags: ['Klasik', 'Moral', 'Sumatra']
      },
      {
        id: '5',
        title: 'The Brave Little Mouse',
        description: 'A heartwarming tale about courage and friendship in the forest',
        level: StoryLevel.Beginner,
        duration: 6,
        category: 'Fable',
        thumbnail: '/images/learning-illustrations/mouse.jpg',
        rating: 4.5,
        totalReads: 4821,
        audioAvailable: true,
        language: Language.English,
        publishedDate: new Date('2024-01-25'),
        tags: ['Courage', 'Friendship', 'Animals']
      },
      {
        id: '6',
        title: 'Sangkuriang',
        description: 'Legenda tentang asal mula Gunung Tangkuban Perahu di Jawa Barat',
        level: StoryLevel.Advanced,
        duration: 18,
        category: 'Folklore',
        thumbnail: '/images/learning-illustrations/sangkuriang.jpg',
        rating: 4.7,
        totalReads: 2156,
        audioAvailable: false,
        language: Language.Indonesian,
        publishedDate: new Date('2024-01-12'),
        tags: ['Jawa Barat', 'Gunung', 'Tragedi']
      }
    ];

    for (const story of stories) {
      await prisma.story.upsert({
        where: { id: story.id },
        update: {},
        create: story
      });
    }

    console.log(`✅ Created ${stories.length} stories`);

    // Create sample learning stats
    await prisma.learningStats.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        storiesRead: 47,
        totalTime: 1250,
        currentStreak: 12,
        vocabularyLearned: 234,
        comprehensionScore: 87
      }
    });

    console.log('✅ Created learning stats');

    // Create sample bookmarks
    const bookmarks = [
      { userId: user.id, storyId: '1' },
      { userId: user.id, storyId: '3' },
      { userId: user.id, storyId: '6' }
    ];

    for (const bookmark of bookmarks) {
      await prisma.bookmark.upsert({
        where: {
          userId_storyId: {
            userId: bookmark.userId,
            storyId: bookmark.storyId
          }
        },
        update: {},
        create: bookmark
      });
    }

    console.log(`✅ Created ${bookmarks.length} bookmarks`);

    // Create sample progress records
    const progressRecords = [
      { userId: user.id, storyId: '1', progress: 65, isCompleted: false },
      { userId: user.id, storyId: '2', progress: 100, isCompleted: true },
      { userId: user.id, storyId: '3', progress: 30, isCompleted: false },
      { userId: user.id, storyId: '5', progress: 100, isCompleted: true },
      { userId: user.id, storyId: '6', progress: 15, isCompleted: false }
    ];

    for (const progress of progressRecords) {
      await prisma.storyProgress.upsert({
        where: {
          userId_storyId: {
            userId: progress.userId,
            storyId: progress.storyId
          }
        },
        update: {},
        create: progress
      });
    }

    console.log(`✅ Created ${progressRecords.length} progress records`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Main execution
async function main() {
  try {
    await seedDatabase();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seed function
if (require.main === module) {
  main();
}

export { seedDatabase };
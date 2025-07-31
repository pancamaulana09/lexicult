import {
  BookOpen,
  Edit3,
  Zap,
  Award,
  Home,
  UserPlus,
  MessageSquare,
  Mic,
} from 'lucide-react';

import type { LearningModule, InteractiveFeature } from '@/types/learning';
import type { Level } from '@/types/learning';

// 🌍 CEFR Levels
export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// 📌 Sidebar Items (for user dashboard)
export const SIDEBAR_ITEMS = [
  { icon: Home, label: 'Landing Page', href: '/' },
  { icon: UserPlus, label: 'Login / Register', href: '/sign-in' },
  { icon: BookOpen, label: 'Dashboard Pengguna', href: '/dashboard' },
  { icon: MessageSquare, label: 'Modul Pembelajaran', href: '/dashboard/belajar' },
  { icon: Edit3, label: 'Cerita', href: '/dashboard/cerita' },
  { icon: Mic, label: 'Chat Latihan AI Voice', href: '/dashboard/chat-ai' },
];

// 🛠️ Admin-specific links
export const ADMIN_FEATURES = [
  { label: 'Panel Admin', href: '/dashboard/admin' },
  { label: 'Materi Management', href: '/dashboard/admin/materi' },
  { label: 'Cerita Management', href: '/dashboard/admin/cerita' },
  { label: 'Booking Management', href: '/dashboard/admin/booking' },
];

// 📚 Learning Modules (Grammar, Vocab, etc.)
export const LEARNING_MODULES: LearningModule[] = [
  {
    title: 'Grammar',
    slug: 'grammar',
    description: 'Master grammar rules and structures',
    progress: '75%',
    level: 'A1-C2',
    color: '',
    icon: BookOpen
  },
  {
    title: 'Kosakata',
    slug: 'vocabulary',
    description: 'Expand your vocabulary with interactive lessons',
    progress: '60%',
    level: 'A1-C2',
    color: '',
    icon: Edit3
  },
  {
    title: 'Latihan',
    slug: 'practice',
    description: 'Practice exercises and quizzes',
    progress: '45%',
    level: 'A1-C2',
    color: '',
    icon: Zap
  },
  {
    title: 'Quiz',
    slug: 'quiz',
    description: 'Test your knowledge with comprehensive quizzes',
    progress: '30%',
    level: 'A1-C2',
    color: '',
    icon: Award
  }
];

// 🤖 Interactive Features
export const INTERACTIVE_FEATURES: InteractiveFeature[] = [
  {
    title: 'Story Reader + Audio Player',
    slug: 'story-audio',
    description: 'Listen and read interactive stories',
    type: 'Per Level',
    color: 'bg-gray-700',
    image: '/mascot/lexicultMascot3.png',

  },
  {
    title: 'AI Chatbot',
    slug: 'ai-chatbot',
    description: 'Practice conversations with AI',
    type: 'Koreksi + Roleplay',
    color: 'bg-gray-700',
    image: '/mascot/lexicultMascot2.png',

  },
  {
    title: 'Voice Assistant',
    slug: 'voice-assistant',
    description: 'AI-powered speaking practice',
    type: 'Booking Voice AI',
    color: 'bg-gray-700',
    image: '/mascot/lexicultMascot1.png',

  }
];

// 🎯 Optional: For UI progress bars, charts, etc.
export const PROGRESS_COLORS = [
  'from-green-400 to-green-600',
  'from-blue-400 to-blue-600',
  'from-orange-400 to-orange-600',
  'from-purple-400 to-purple-600',
];

// 🏷️ Badge Color Per Level
export const LEVEL_BADGE_COLORS: Record<Level, string> = {
  A1: 'bg-green-100 text-green-800',
  A2: 'bg-green-200 text-green-900',
  B1: 'bg-yellow-100 text-yellow-800',
  B2: 'bg-yellow-200 text-yellow-900',
  C1: 'bg-blue-100 text-blue-800',
  C2: 'bg-blue-200 text-blue-900',
};

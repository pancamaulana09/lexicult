'use client'
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  Share2, 
  Bookmark, 
  Clock, 
  Star, 
  Users, 
  Trophy, 
  Filter,
  Search,
  ChevronDown,
  Mic,
  MicOff,
  HeadphonesIcon,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle2,
  Target,
  Zap,
  Brain,
  Shuffle,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  Lightbulb,
  Flag,
  Globe,
  PenTool,
  MessageSquare,
  Layers,
  BarChart3,
  Timer,
  Settings,
  Gamepad2,
  Award,
  TrendingUp,
  Activity,
  Calendar,
  BookOpen,
  Headphones,
  Camera,
  FileText,
  List,
  GridIcon
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Types
interface PracticeSession {
  id: string;
  title: string;
  description: string;
  type: 'listening' | 'speaking' | 'reading' | 'writing' | 'grammar' | 'vocabulary';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number;
  exercises: number;
  completedExercises: number;
  accuracy: number;
  category: string;
  thumbnail: string;
  isUnlocked: boolean;
  bestScore: number;
  timesAttempted: number;
  lastAttempted?: Date;
  tags: string[];
  skills: string[];
}

interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'listening' | 'speaking' | 'reading-comprehension' | 'grammar' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  audioUrl?: string;
  imageUrl?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
}

interface ActiveSession {
  sessionId: string;
  currentExerciseIndex: number;
  exercises: Exercise[];
  startTime: Date;
  answers: { [key: string]: string | string[] };
  score: number;
  timeSpent: number;
  mistakes: number;
}

interface PracticeStats {
  totalSessions: number;
  sessionsCompleted: number;
  averageAccuracy: number;
  totalTime: number;
  currentStreak: number;
  longestStreak: number;
  skillsImproved: number;
  pointsEarned: number;
  rank: string;
  nextRankPoints: number;
}

// Utility functions
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'listening': return HeadphonesIcon;
    case 'speaking': return Mic;
    case 'reading': return BookOpen;
    case 'writing': return PenTool;
    case 'grammar': return FileText;
    case 'vocabulary': return List;
    default: return Activity;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'listening': return 'blue';
    case 'speaking': return 'green';
    case 'reading': return 'purple';
    case 'writing': return 'orange';
    case 'grammar': return 'red';
    case 'vocabulary': return 'indigo';
    default: return 'gray';
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    case 'Hard': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
  }
};

// Header Component
const PracticeHeader = ({ practiceStats }: { practiceStats: PracticeStats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
            🎯 Modul Latihan
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Asah kemampuan bahasa Anda dengan latihan interaktif dan menantang
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Laporan Detail
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Pengaturan
          </Button>
        </div>
      </div>

      <StatsGrid stats={practiceStats} />
    </motion.div>
  );
};

// Stats Grid Component
const StatsGrid = ({ stats }: { stats: PracticeStats }) => {
  const statsData = [
    { label: 'Total Sesi', value: stats.totalSessions.toString(), icon: Activity, color: 'blue' },
    { label: 'Selesai', value: stats.sessionsCompleted.toString(), icon: CheckCircle2, color: 'green' },
    { label: 'Akurasi Rata-rata', value: `${stats.averageAccuracy}%`, icon: Target, color: 'purple' },
    { label: 'Waktu Total', value: `${Math.floor(stats.totalTime / 60)}h`, icon: Clock, color: 'orange' },
    { label: 'Streak Saat Ini', value: stats.currentStreak.toString(), icon: Zap, color: 'yellow' },
    { label: 'Streak Terbaik', value: stats.longestStreak.toString(), icon: Trophy, color: 'red' },
    { label: 'Poin', value: stats.pointsEarned.toLocaleString(), icon: Star, color: 'indigo' },
    { label: 'Peringkat', value: stats.rank.split(' ')[0], icon: Award, color: 'pink' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="p-4 text-center hover:shadow-lg transition-shadow">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/20 mb-2`}>
              <stat.icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
            </div>
            <div className="text-lg font-bold text-slate-800 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {stat.label}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

// Navigation Tabs Component
const NavigationTabs = ({ activeTab, setActiveTab, isMuted, setIsMuted }: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}) => {
  const tabs = [
    { id: 'sessions', label: 'Sesi Latihan', icon: Gamepad2 },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'achievements', label: 'Pencapaian', icon: Trophy },
    { id: 'history', label: 'Riwayat', icon: Calendar }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-1 bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm">
            <Shuffle className="h-4 w-4 mr-2" />
            Acak
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Search and Filters Component
const SearchAndFilters = ({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedCategory,
  setSelectedCategory
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}) => {
  const practiceTypes = ['All', 'listening', 'speaking', 'reading', 'writing', 'grammar', 'vocabulary'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const categories = ['All', 'Daily Life', 'Business', 'Academic', 'News & Media', 'Pronunciation', 'Grammar'];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari sesi latihan berdasarkan judul, kategori, atau tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
        >
          {practiceTypes.map(type => (
            <option key={type} value={type}>
              {type === 'All' ? 'Semua Jenis' : type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
        >
          {difficulties.map(difficulty => (
            <option key={difficulty} value={difficulty}>
              {difficulty === 'All' ? 'Semua Level' : difficulty}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'All' ? 'Semua Kategori' : category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// Practice Session Card Component
const PracticeSessionCard = ({ 
  session, 
  index, 
  onStartSession 
}: { 
  session: PracticeSession; 
  index: number; 
  onStartSession: (sessionId: string) => void;
}) => {
  const TypeIcon = getTypeIcon(session.type);
  const typeColor = getTypeColor(session.type);

  return (
    <motion.div
      key={session.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        {/* Header */}
        <div className={`relative h-32 bg-gradient-to-br from-${typeColor}-500 to-${typeColor}-600 overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-4 left-4">
            <Badge className={getDifficultyColor(session.difficulty)}>
              {session.difficulty}
            </Badge>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <div className={`bg-${typeColor}-600 text-white p-2 rounded-full`}>
              <TypeIcon className="h-4 w-4" />
            </div>
            {!session.isUnlocked && (
              <div className="bg-yellow-500 text-white p-2 rounded-full">
                <Flag className="h-4 w-4" />
              </div>
            )}
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white text-xl font-bold mb-1 line-clamp-2">
              {session.title}
            </h3>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <Timer className="h-3 w-3" />
                {session.duration} menit
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {session.exercises} soal
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
            {session.description}
          </p>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">Progress</span>
              <span className="text-xs text-slate-500">
                {session.completedExercises}/{session.exercises}
              </span>
            </div>
            <Progress 
              value={(session.completedExercises / session.exercises) * 100} 
              className="h-2" 
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-slate-800 dark:text-white">
                {session.bestScore}%
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Skor Terbaik
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-slate-800 dark:text-white">
                {session.timesAttempted}x
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Dicoba
              </div>
            </div>
          </div>

          {/* Category and Skills */}
          <div className="mb-4">
            <Badge variant="secondary" className="text-xs mb-2">
              {session.category}
            </Badge>
            <div className="flex flex-wrap gap-1">
              {session.skills.slice(0, 2).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Last Attempted */}
          {session.lastAttempted && (
            <div className="text-xs text-slate-500 mb-4">
              Terakhir: {session.lastAttempted.toLocaleDateString('id-ID')}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              className="w-full" 
              size="sm"
              onClick={() => onStartSession(session.id)}
              disabled={!session.isUnlocked}
            >
              {session.completedExercises > 0 ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Lanjutkan Latihan
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Mulai Latihan
                </>
              )}
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Exercise Renderer Component
const ExerciseRenderer = ({ 
  activeSession, 
  onAnswer 
}: { 
  activeSession: ActiveSession; 
  onAnswer: (answer: string | string[]) => void;
}) => {
  const exercise = activeSession.exercises[activeSession.currentExerciseIndex];
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  if (!exercise) return null;

  switch (exercise.type) {
    case 'multiple-choice':
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">{exercise.question}</h3>
            {exercise.audioUrl && (
              <Button variant="outline" className="mb-4">
                <Volume2 className="h-4 w-4 mr-2" />
                Play Audio
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {exercise.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                  selectedAnswer === option
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selectedAnswer === option
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {selectedAnswer === option && (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={() => onAnswer(selectedAnswer)}
            disabled={!selectedAnswer}
            className="w-full"
          >
            Next Question
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      );

    case 'fill-blank':
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">{exercise.question}</h3>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Type your answer here..."
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              className="text-center text-lg"
            />
          </div>

          <Button
            onClick={() => onAnswer(selectedAnswer)}
            disabled={!selectedAnswer.trim()}
            className="w-full"
          >
            Submit Answer
            <CheckCircle2 className="h-4 w-4 ml-2" />
          </Button>
        </div>
      );

    default:
      return (
        <div className="text-center">
          <p className="text-slate-500">Exercise type not implemented yet.</p>
        </div>
      );
  }
};

// Quick Practice Section Component
const QuickPracticeSection = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="mt-12"
  >
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Latihan Cepat</h2>
          <p className="text-purple-100 mb-4">
            Latihan singkat 5 menit untuk mengasah kemampuan setiap hari
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <Zap className="h-4 w-4 mr-2" />
              Latihan Kilat
            </Button>
            <Button
              variant="secondary"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <Brain className="h-4 w-4 mr-2" />
              Challenge Harian
            </Button>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center w-32 h-32 bg-white/10 rounded-full">
          <Target className="h-16 w-16 text-white/80" />
        </div>
      </div>
    </div>
  </motion.div>
);

// Recommendations Component
const RecommendationsSection = () => {
  const recommendations = [
    {
      title: 'Perbaiki Kelemahan',
      description: 'Fokus pada area yang perlu ditingkatkan',
      icon: TrendingUp,
      color: 'red',
      action: 'Mulai Perbaikan'
    },
    {
      title: 'Pertahankan Streak',
      description: 'Jangan putuskan streak 7 hari Anda',
      icon: Zap,
      color: 'yellow',
      action: 'Latihan Hari Ini'
    },
    {
      title: 'Skill Baru',
      description: 'Coba kemampuan yang belum pernah dipelajari',
      icon: Lightbulb,
      color: 'blue',
      action: 'Jelajahi'
    },
    {
      title: 'Review Materi',
      description: 'Ulang materi yang sudah dipelajari',
      icon: RefreshCw,
      color: 'green',
      action: 'Mulai Review'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Rekomendasi Untuk Anda
        </h2>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${item.color}-100 dark:bg-${item.color}-900/20 mb-4`}>
                <item.icon className={`h-6 w-6 text-${item.color}-600 dark:text-${item.color}-400`} />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {item.description}
              </p>
              <Button size="sm" variant="outline" className="w-full">
                {item.action}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Main Practice Module Component
export default function PracticeModule() {
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<PracticeSession[]>([]);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('sessions');
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [showSessionDialog, setShowSessionDialog] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [practiceStats] = useState<PracticeStats>({
    totalSessions: 127,
    sessionsCompleted: 89,
    averageAccuracy: 87,
    totalTime: 1840,
    currentStreak: 7,
    longestStreak: 21,
    skillsImproved: 12,
    pointsEarned: 8450,
    rank: 'Advanced Learner',
    nextRankPoints: 1550
  });

  // Mock data initialization
  useEffect(() => {
    const mockPracticeSessions: PracticeSession[] = [
      {
        id: '1',
        title: 'Listening Comprehension - Daily Conversations',
        description: 'Practice understanding everyday conversations in various contexts',
        type: 'listening',
        difficulty: 'Medium',
        duration: 15,
        exercises: 10,
        completedExercises: 7,
        accuracy: 85,
        category: 'Daily Life',
        thumbnail: '/images/learning-illustrations/listening.jpg',
        isUnlocked: true,
        bestScore: 92,
        timesAttempted: 5,
        lastAttempted: new Date('2024-01-25'),
        tags: ['Audio', 'Conversation', 'Comprehension'],
        skills: ['Listening', 'Vocabulary']
      },
      {
        id: '2',
        title: 'Speaking Practice - Pronunciation Focus',
        description: 'Improve your pronunciation with guided speaking exercises',
        type: 'speaking',
        difficulty: 'Hard',
        duration: 20,
        exercises: 8,
        completedExercises: 3,
        accuracy: 72,
        category: 'Pronunciation',
        thumbnail: '/images/learning-illustrations/speaking.jpg',
        isUnlocked: true,
        bestScore: 78,
        timesAttempted: 3,
        lastAttempted: new Date('2024-01-24'),
        tags: ['Speaking', 'Pronunciation', 'Fluency'],
        skills: ['Speaking', 'Pronunciation']
      },
      {
        id: '3',
        title: 'Reading Comprehension - News Articles',
        description: 'Read and understand news articles with comprehension questions',
        type: 'reading',
        difficulty: 'Hard',
        duration: 25,
        exercises: 12,
        completedExercises: 12,
        accuracy: 94,
        category: 'News & Media',
        thumbnail: '/images/learning-illustrations/reading.jpg',
        isUnlocked: true,
        bestScore: 96,
        timesAttempted: 2,
        lastAttempted: new Date('2024-01-23'),
        tags: ['Reading', 'News', 'Analysis'],
        skills: ['Reading', 'Critical Thinking']
      },
      {
        id: '4',
        title: 'Grammar Essentials - Tenses Practice',
        description: 'Master English tenses with interactive exercises',
        type: 'grammar',
        difficulty: 'Medium',
        duration: 18,
        exercises: 15,
        completedExercises: 0,
        accuracy: 0,
        category: 'Grammar',
        thumbnail: '/images/learning-illustrations/grammar.jpg',
        isUnlocked: true,
        bestScore: 0,
        timesAttempted: 0,
        tags: ['Grammar', 'Tenses', 'Structure'],
        skills: ['Grammar', 'Writing']
      },
      {
        id: '5',
        title: 'Writing Skills - Email Composition',
        description: 'Learn to write professional and personal emails effectively',
        type: 'writing',
        difficulty: 'Easy',
        duration: 30,
        exercises: 6,
        completedExercises: 4,
        accuracy: 88,
        category: 'Business',
        thumbnail: '/images/learning-illustrations/writing.jpg',
        isUnlocked: false,
        bestScore: 90,
        timesAttempted: 1,
        tags: ['Writing', 'Email', 'Professional'],
        skills: ['Writing', 'Communication']
      },
      {
        id: '6',
        title: 'Vocabulary Building - Academic Words',
        description: 'Expand your academic vocabulary with context-based learning',
        type: 'vocabulary',
        difficulty: 'Hard',
        duration: 22,
        exercises: 20,
        completedExercises: 15,
        accuracy: 79,
        category: 'Academic',
        thumbnail: '/images/learning-illustrations/vocabulary.jpg',
        isUnlocked: true,
        bestScore: 85,
        timesAttempted: 4,
        lastAttempted: new Date('2024-01-22'),
        tags: ['Vocabulary', 'Academic', 'Context'],
        skills: ['Vocabulary', 'Reading']
      }
    ];

    setPracticeSessions(mockPracticeSessions);
    setFilteredSessions(mockPracticeSessions);
  }, []);

  // Filter practice sessions
  useEffect(() => {
    let filtered = practiceSessions;

    if (selectedType !== 'All') {
      filtered = filtered.filter(session => session.type === selectedType);
    }

    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(session => session.difficulty === selectedDifficulty);
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(session => session.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(session =>
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredSessions(filtered);
  }, [practiceSessions, selectedType, selectedDifficulty, selectedCategory, searchQuery]);

  const startPracticeSession = useCallback((sessionId: string) => {
    const session = practiceSessions.find(s => s.id === sessionId);
    if (!session || !session.isUnlocked) return;

    // Mock exercises for the session
    const mockExercises: Exercise[] = [
      {
        id: '1',
        type: 'multiple-choice',
        question: 'What is the correct pronunciation of "pronunciation"?',
        options: ['/prəˌnʌnsiˈeɪʃən/', '/proʊˌnʌnsiˈeɪʃən/', '/prəˌnaʊnsiˈeɪʃən/', '/proʊˌnaʊnsiˈeɪʃən/'],
        correctAnswer: '/prəˌnʌnsiˈeɪʃən/',
        explanation: 'The correct pronunciation emphasizes the "nun" syllable.',
        difficulty: 'Medium',
        points: 10
      },
      {
        id: '2',
        type: 'fill-blank',
        question: 'Complete the sentence: "I have been _____ English for three years."',
        correctAnswer: 'studying',
        explanation: 'Present perfect continuous tense is used for actions that started in the past and continue to the present.',
        difficulty: 'Easy',
        points: 8
      }
    ];

    const newActiveSession: ActiveSession = {
      sessionId,
      currentExerciseIndex: 0,
      exercises: mockExercises,
      startTime: new Date(),
      answers: {},
      score: 0,
      timeSpent: 0,
      mistakes: 0
    };

    setActiveSession(newActiveSession);
    setShowSessionDialog(true);
  }, [practiceSessions]);

  const handleAnswer = useCallback((answer: string | string[]) => {
    if (!activeSession) return;

    const currentExercise = activeSession.exercises[activeSession.currentExerciseIndex];
    const isCorrect = Array.isArray(answer) 
      ? JSON.stringify(answer.sort()) === JSON.stringify((currentExercise.correctAnswer as string[]).sort())
      : answer === currentExercise.correctAnswer;

    const updatedSession = {
      ...activeSession,
      answers: {
        ...activeSession.answers,
        [currentExercise.id]: answer
      },
      score: isCorrect ? activeSession.score + currentExercise.points : activeSession.score,
      mistakes: !isCorrect ? activeSession.mistakes + 1 : activeSession.mistakes
    };

    // Move to next exercise or complete session
    if (updatedSession.currentExerciseIndex < updatedSession.exercises.length - 1) {
      updatedSession.currentExerciseIndex += 1;
      setActiveSession(updatedSession);
    } else {
      // Session completed
      setShowSessionDialog(false);
      setActiveSession(null);
      // Here you would typically save the results and update statistics
    }
  }, [activeSession]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedDifficulty('All');
    setSelectedCategory('All');
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <PracticeHeader practiceStats={practiceStats} />
        
        <NavigationTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
        />

        <SearchAndFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Practice Sessions Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredSessions.map((session, index) => (
              <PracticeSessionCard
                key={session.id}
                session={session}
                index={index}
                onStartSession={startPracticeSession}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredSessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Gamepad2 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Tidak ada sesi latihan ditemukan
            </h3>
            <p className="text-slate-500 dark:text-slate-500 mb-6">
              Coba ubah filter pencarian atau kata kunci Anda
            </p>
            <Button onClick={resetFilters} variant="outline">
              Reset Filter
            </Button>
          </motion.div>
        )}

        <QuickPracticeSection />
        <RecommendationsSection />

        {/* Practice Session Dialog */}
        {showSessionDialog && activeSession && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-auto rounded-lg bg-white p-6 shadow-xl dark:bg-slate-900">
              {/* Session Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Sesi Latihan
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <span>
                      Soal {activeSession.currentExerciseIndex + 1} dari {activeSession.exercises.length}
                    </span>
                    <span>•</span>
                    <span>Skor: {activeSession.score} poin</span>
                    <span>•</span>
                    <span>Kesalahan: {activeSession.mistakes}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowSessionDialog(false);
                    setActiveSession(null);
                  }}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <Progress 
                  value={((activeSession.currentExerciseIndex) / activeSession.exercises.length) * 100} 
                  className="h-3" 
                />
              </div>

              {/* Exercise Content */}
              <div className="mb-6">
                <ExerciseRenderer 
                  activeSession={activeSession}
                  onAnswer={handleAnswer}
                />
              </div>

              {/* Session Controls */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  {activeSession.exercises[activeSession.currentExerciseIndex]?.type === 'speaking' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsRecording(!isRecording)}
                      className={isRecording ? 'bg-red-100 text-red-600' : ''}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
                
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {Math.floor((Date.now() - activeSession.startTime.getTime()) / 1000 / 60)} menit
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
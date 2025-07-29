'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  BookOpen, 
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
  HeadphonesIcon,
  Eye,
  MessageCircle,
  RotateCcw,
  CheckCircle2,
  Target,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import { Tabs } from '@/components/ui/tabs';

interface Story {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  category: string;
  author: string;
  authorAvatar: string;
  thumbnail: string;
  rating: number;
  totalReads: number;
  isBookmarked: boolean;
  isCompleted: boolean;
  progress: number;
  language: 'Indonesian' | 'English';
  audioAvailable: boolean;
  tags: string[];
  publishedDate: string;
}

interface LearningStats {
  storiesRead: number;
  totalTime: number;
  currentStreak: number;
  vocabularyLearned: number;
  comprehensionScore: number;
}

export default function CeritaDashboard() {
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [learningStats, setLearningStats] = useState<LearningStats>({
    storiesRead: 47,
    totalTime: 1250,
    currentStreak: 12,
    vocabularyLearned: 234,
    comprehensionScore: 87
  });

  // Mock data
  useEffect(() => {
    const mockStories: Story[] = [
      {
        id: '1',
        title: 'Legenda Danau Toba',
        description: 'Cerita rakyat tentang asal mula Danau Toba yang terkenal di Sumatera Utara',
        level: 'Intermediate',
        duration: 15,
        category: 'Folklore',
        author: 'Ahmad Syukri',
        authorAvatar: '/images/profile-avatars/author1.jpg',
        thumbnail: '/images/learning-illustrations/danau-toba.jpg',
        rating: 4.8,
        totalReads: 2847,
        isBookmarked: true,
        isCompleted: false,
        progress: 65,
        language: 'Indonesian',
        audioAvailable: true,
        tags: ['Sumatera', 'Legenda', 'Danau'],
        publishedDate: '2024-01-15'
      },
      {
        id: '2',
        title: 'Si Kancil dan Buaya',
        description: 'Kisah cerdik Si Kancil yang mengakali buaya-buaya di sungai',
        level: 'Beginner',
        duration: 8,
        category: 'Fable',
        author: 'Siti Nurhaliza',
        authorAvatar: '/images/profile-avatars/author2.jpg',
        thumbnail: '/images/learning-illustrations/kancil.jpg',
        rating: 4.9,
        totalReads: 5632,
        isBookmarked: false,
        isCompleted: true,
        progress: 100,
        language: 'Indonesian',
        audioAvailable: true,
        tags: ['Kancil', 'Hewan', 'Moral'],
        publishedDate: '2024-01-20'
      },
      {
        id: '3',
        title: 'The Lost Temple',
        description: 'An adventurous story about discovering an ancient temple in the jungle',
        level: 'Advanced',
        duration: 25,
        category: 'Adventure',
        author: 'John Mitchell',
        authorAvatar: '/images/profile-avatars/author3.jpg',
        thumbnail: '/images/learning-illustrations/temple.jpg',
        rating: 4.7,
        totalReads: 1890,
        isBookmarked: true,
        isCompleted: false,
        progress: 30,
        language: 'English',
        audioAvailable: true,
        tags: ['Adventure', 'Mystery', 'Ancient'],
        publishedDate: '2024-01-10'
      },
      {
        id: '4',
        title: 'Malin Kundang',
        description: 'Cerita klasik tentang anak durhaka yang dikutuk menjadi batu',
        level: 'Intermediate',
        duration: 12,
        category: 'Folklore',
        author: 'Dewi Sartika',
        authorAvatar: '/images/profile-avatars/author4.jpg',
        thumbnail: '/images/learning-illustrations/malin-kundang.jpg',
        rating: 4.6,
        totalReads: 3456,
        isBookmarked: false,
        isCompleted: false,
        progress: 0,
        language: 'Indonesian',
        audioAvailable: true,
        tags: ['Klasik', 'Moral', 'Sumatra'],
        publishedDate: '2024-01-08'
      }
    ];

    setStories(mockStories);
    setFilteredStories(mockStories);
  }, []);

  // Filter stories
  useEffect(() => {
    let filtered = stories;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(story => story.category === selectedCategory);
    }

    if (selectedLevel !== 'All') {
      filtered = filtered.filter(story => story.level === selectedLevel);
    }

    if (searchQuery) {
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredStories(filtered);
  }, [stories, selectedCategory, selectedLevel, searchQuery]);

  const categories = ['All', 'Folklore', 'Fable', 'Adventure', 'Mystery', 'Historical'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleBookmark = (storyId: string) => {
    setStories(prev => prev.map(story =>
      story.id === storyId ? { ...story, isBookmarked: !story.isBookmarked } : story
    ));
  };

  const handlePlay = (storyId: string) => {
    setIsPlaying(isPlaying === storyId ? null : storyId);
  };

  return (
    <div className="min-h-screen dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
                📚 Cerita Interaktif
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Belajar bahasa melalui cerita yang menarik dan interaktif
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Bagikan
              </Button>
              <Button variant="outline" size="sm">
                <Target className="h-4 w-4 mr-2" />
                Target Harian
              </Button>
            </div>
          </div>

          {/* Learning Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Cerita Dibaca', value: learningStats.storiesRead, icon: Book, color: 'blue' },
              { label: 'Waktu Belajar', value: `${Math.floor(learningStats.totalTime / 60)}h ${learningStats.totalTime % 60}m`, icon: Clock, color: 'green' },
              { label: 'Streak Hari', value: learningStats.currentStreak, icon: Zap, color: 'orange' },
              { label: 'Kosakata Baru', value: learningStats.vocabularyLearned, icon: BookOpen, color: 'purple' },
              { label: 'Pemahaman', value: `${learningStats.comprehensionScore}%`, icon: Trophy, color: 'yellow' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 text-center hover:shadow-lg transition-shadow">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/20 mb-3`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1 bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
              {[
                { id: 'explore', label: 'Jelajahi', icon: Search },
                { id: 'bookmarks', label: 'Tersimpan', icon: Bookmark },
                { id: 'completed', label: 'Selesai', icon: CheckCircle2 },
                { id: 'listening', label: 'Audio', icon: HeadphonesIcon }
              ].map((tab) => (
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

            {/* Audio Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className="flex items-center gap-2"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                {isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari cerita berdasarkan judul, deskripsi, atau tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stories Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getLevelColor(story.level)} text-white border-0`}>
                        {story.level}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => handleBookmark(story.id)}
                        className={`p-2 rounded-full transition-colors ${
                          story.isBookmarked
                            ? 'bg-yellow-500 text-white'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                      {story.audioAvailable && (
                        <button
                          onClick={() => handlePlay(story.id)}
                          className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                        >
                          {isPlaying === story.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="text-white text-xl font-bold mb-1">
                        {story.title}
                      </div>
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <Clock className="h-3 w-3" />
                        {story.duration} menit
                        <Users className="h-3 w-3 ml-2" />
                        {story.totalReads.toLocaleString()}
                      </div>
                    </div>
                    {story.isCompleted && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-green-500 rounded-full p-3">
                          <CheckCircle2 className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-full h-full flex items-center justify-center text-xs text-white font-medium">
                          {story.author.charAt(0)}
                        </div>
                      </Avatar>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {story.author}
                      </span>
                      <div className="ml-auto flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {story.rating}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                      {story.description}
                    </p>

                    {/* Progress Bar */}
                    {story.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-500">Progress</span>
                          <span className="text-xs text-slate-500">{story.progress}%</span>
                        </div>
                        <Progress value={story.progress} className="h-1" />
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {story.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1" 
                        size="sm"
                        variant={story.isCompleted ? "outline" : "default"}
                      >
                        {story.isCompleted ? (
                          <>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Baca Ulang
                          </>
                        ) : story.progress > 0 ? (
                          <>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Lanjutkan
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Mulai Baca
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredStories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Book className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Tidak ada cerita ditemukan
            </h3>
            <p className="text-slate-500 dark:text-slate-500 mb-6">
              Coba ubah filter pencarian atau kata kunci Anda
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLevel('All');
              }}
              variant="outline"
            >
              Reset Filter
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
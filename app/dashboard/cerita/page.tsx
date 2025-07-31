  'use client';

  import { useState, useEffect } from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { useUser, useAuth, SignInButton, SignOutButton, UserButton } from '@clerk/nextjs';
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
    Headphones,
    Eye,
    MessageCircle,
    RotateCcw,
    CheckCircle2,
    Target,
    Zap,
    Loader2,
    LogIn,
    Settings
  } from 'lucide-react';

  // Types matching your Prisma schema
  interface Story {
    id: string;
    title: string;
    description: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: number;
    category: string;
    thumbnail: string;
    rating: number;
    totalReads: number;
    audioAvailable: boolean;
    language: 'Indonesian' | 'English' | 'German';
    publishedDate: string;
    tags: string[];
    // Relations
    bookmarks?: { userId: string }[];
    progressRecords?: { progress: number; isCompleted: boolean }[];
  }

  interface LearningStats {
    storiesRead: number;
    totalTime: number;
    currentStreak: number;
    vocabularyLearned: number;
    comprehensionScore: number;
  }

  export default function CeritaDashboard() {
    // Clerk hooks
    const { user, isLoaded: userLoaded } = useUser();
    const { isSignedIn, getToken } = useAuth();

    // State
    const [stories, setStories] = useState<Story[]>([]);
    const [filteredStories, setFilteredStories] = useState<Story[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedLevel, setSelectedLevel] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isPlaying, setIsPlaying] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('explore');
    const [learningStats, setLearningStats] = useState<LearningStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // API Functions with Clerk auth
    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
      const token = await getToken();
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    };

    const fetchStories = async () => {
      try {
        const response = await fetchWithAuth(
          `/api/stories?category=${selectedCategory}&level=${selectedLevel}&search=${searchQuery}`
        );
        if (!response.ok) throw new Error('Failed to fetch stories');
        const data = await response.json();
        return data.stories;
      } catch (error) {
        console.error('Error fetching stories:', error);
        throw error;
      }
    };

    const fetchLearningStats = async () => {
      try {
        const response = await fetchWithAuth('/api/users/stats');
        if (!response.ok) throw new Error('Failed to fetch learning stats');
        const data = await response.json();
        return data.stats;
      } catch (error) {
        console.error('Error fetching learning stats:', error);
        throw error;
      }
    };
    const toggleBookmark = async (storyId: string) => {
  try {
    const response = await fetchWithAuth('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ storyId }),
    });

    if (!response.ok) throw new Error('Failed to toggle bookmark');

    setStories(prev =>
      prev.map(story => {
        if (story.id === storyId) {
          const isBookmarked = story.bookmarks?.some(b => b.userId === user?.id);
          return {
            ...story,
            bookmarks: isBookmarked
              ? story.bookmarks?.filter(b => b.userId !== user?.id)
              : [...(story.bookmarks || []), { userId: user?.id || '' }],
          };
        }
        return story;
      })
    );
  } catch (err) {
    console.error('Error toggling bookmark:', err);
    setError('Failed to update bookmark');
  }
};



const updateProgress = async (
  storyId: string,
  progress: number,
  isCompleted: boolean = false
) => {
  try {
    const response = await fetchWithAuth('/api/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storyId,
        progress,
        isCompleted,
      }),
    });

    if (!response.ok) {
  const text = await response.text(); // <-- try raw first
  console.error("❌ Raw error response:", text);
  try {
    const errJson = JSON.parse(text);
    throw new Error(errJson?.error || 'Server error without message');
  } catch (err) {
    throw new Error(`Server responded with non-JSON error: ${text}`);
  }
}


    // ✅ Refresh updated story list
    const updatedStories = await fetchStories();
    setStories(updatedStories);

  } catch (error: any) {
    console.error('⚠️ Error updating progress:', error?.message || error);
    setError(error?.message || 'Failed to update progress');
  }
};

    // Mock data for demo when not authenticated
    const getMockStories = (): Story[] => [
      {
        id: '1',
        title: 'Sangkuriang',
        description: 'Legenda tentang seorang pemuda yang jatuh cinta pada ibunya sendiri tanpa mengetahuinya.',
        level: 'Intermediate',
        duration: 15,
        category: 'Folklore',
        thumbnail: '/api/placeholder/400/300',
        rating: 4.8,
        totalReads: 1250,
        audioAvailable: true,
        language: 'Indonesian',
        publishedDate: '2024-01-15',
        tags: ['Legenda', 'Jawa Barat', 'Cinta', 'Tradisional'],
        bookmarks: [],
        progressRecords: []
      },
      {
        id: '2',
        title: 'The Clever Mouse Deer',
        description: 'A smart mouse deer outsmarts a crocodile to cross the river safely.',
        level: 'Beginner',
        duration: 8,
        category: 'Fable',
        thumbnail: '/api/placeholder/400/300',
        rating: 4.5,
        totalReads: 890,
        audioAvailable: true,
        language: 'English',
        publishedDate: '2024-01-10',
        tags: ['Animals', 'Wisdom', 'Indonesian Folklore'],
        bookmarks: [],
        progressRecords: []
      },
      {
        id: '3',
        title: 'Malin Kundang',
        description: 'Kisah anak durhaka yang dikutuk menjadi batu karena tidak mengakui ibunya.',
        level: 'Advanced',
        duration: 20,
        category: 'Folklore',
        thumbnail: '/api/placeholder/400/300',
        rating: 4.9,
        totalReads: 2100,
        audioAvailable: false,
        language: 'Indonesian',
        publishedDate: '2024-01-12',
        tags: ['Moral', 'Sumatera', 'Keluarga', 'Kutukan'],
        bookmarks: [],
        progressRecords: []
      }
    ];

    const getMockStats = (): LearningStats => ({
      storiesRead: 12,
      totalTime: 180,
      currentStreak: 5,
      vocabularyLearned: 45,
      comprehensionScore: 85
    });

    // Load initial data
    useEffect(() => {
      const loadInitialData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          if (isSignedIn && userLoaded) {
            // Load real data for authenticated users
            const [storiesData, statsData] = await Promise.all([
              fetchStories(),
              fetchLearningStats()
            ]);
            
            setStories(storiesData);
            setLearningStats(statsData);
          } else {
            // Load mock data for demo
            setStories(getMockStories());
            setLearningStats(getMockStats());
          }
        } catch (error) {
          console.error('Error loading data:', error);
          // Fallback to mock data on error
          setStories(getMockStories());
          setLearningStats(getMockStats());
          setError(error instanceof Error ? error.message : 'Failed to load data');
        } finally {
          setLoading(false);
        }
      };

      if (userLoaded) {
        loadInitialData();
      }
    }, [isSignedIn, userLoaded]);

    // Filter stories based on active tab and filters
    useEffect(() => {
      let filtered = [...stories];

      // Apply tab filters
      switch (activeTab) {
        case 'bookmarks':
          filtered = filtered.filter(story => 
            story.bookmarks?.some(b => b.userId === user?.id)
          );
          break;
        case 'completed':
          filtered = filtered.filter(story => 
            story.progressRecords?.[0]?.isCompleted === true
          );
          break;
        case 'listening':
          filtered = filtered.filter(story => story.audioAvailable);
          break;
      }

      // Apply category filter
      if (selectedCategory !== 'All') {
        filtered = filtered.filter(story => story.category === selectedCategory);
      }

      // Apply level filter
      if (selectedLevel !== 'All') {
        filtered = filtered.filter(story => story.level === selectedLevel);
      }

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(story =>
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      setFilteredStories(filtered);
    }, [stories, activeTab, selectedCategory, selectedLevel, searchQuery, user?.id]);

    // Refresh stories when filters change (only for authenticated users)
    useEffect(() => {
      if (!isSignedIn) return;

      const refreshStories = async () => {
        try {
          const updatedStories = await fetchStories();
          setStories(updatedStories);
        } catch (error) {
          console.error('Error refreshing stories:', error);
        }
      };

      refreshStories();
    }, [selectedCategory, selectedLevel, searchQuery, isSignedIn]);

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

    const handlePlay = (storyId: string) => {
      setIsPlaying(isPlaying === storyId ? null : storyId);
    };

    const getStoryProgress = (story: Story) => {
      return story.progressRecords?.[0]?.progress || 0;
    };

    const isStoryCompleted = (story: Story) => {
      return story.progressRecords?.[0]?.isCompleted || false;
    };

    const isStoryBookmarked = (story: Story) => {
      return story.bookmarks?.some(b => b.userId === user?.id) || false;
    };

    // Show loading state while Clerk is initializing
    if (!userLoaded || loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-lg text-slate-600 dark:text-slate-400">Loading your stories...</p>
          </div>
        </div>
      );
    }

    // Show sign-in prompt for unauthenticated users
    if (!isSignedIn) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700"
            >
              <div className="text-6xl mb-6">📚</div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                Cerita Interaktif
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Belajar bahasa melalui cerita yang menarik dan interaktif. 
                Masuk untuk mengakses semua fitur dan melacak progress Anda.
              </p>
              
              {/* Demo Preview */}
              <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Preview Mode</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Anda dapat melihat beberapa cerita contoh di bawah, namun untuk fitur lengkap seperti bookmark, progress tracking, dan audio, silakan masuk terlebih dahulu.
                </p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  Lihat Demo →
                </button>
              </div>

              <SignInButton mode="modal">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Masuk untuk Mulai Belajar
                </button>
              </SignInButton>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                Dengan masuk, Anda menyetujui syarat dan ketentuan kami
              </p>
            </motion.div>
          </div>
        </div>
      );
    }

    if (error && isSignedIn) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-4">
              <p className="font-medium">Error loading data</p>
              <p className="text-sm">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen  dark:to-slate-800 p-6">
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
                {user && (
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                    Welcome back, {user.firstName || user.emailAddresses[0].emailAddress}!
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                {isSignedIn ? (
                  <>
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <Share2 className="h-4 w-4" />
                      Bagikan
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <Target className="h-4 w-4" />
                      Target Harian
                    </button>
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "h-10 w-10"
                        }
                      }}
                    />
                  </>
                ) : (
                  <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full text-sm">
                    Preview Mode
                  </div>
                )}
              </div>
            </div>

            {/* Learning Stats */}
            {learningStats && (
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
                    <div className="p-4 text-center hover:shadow-lg transition-shadow bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/20 mb-3`}>
                        <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                      </div>
                      <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
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
                  { id: 'listening', label: 'Audio', icon: Headphones }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    disabled={!isSignedIn && tab.id !== 'explore'}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                    } ${!isSignedIn && tab.id !== 'explore' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                    {!isSignedIn && tab.id !== 'explore' && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded">Pro</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  disabled={!isSignedIn}
                  className={`flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                    !isSignedIn ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  {isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari cerita berdasarkan judul, deskripsi, atau tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              {filteredStories.map((story, index) => {
                const progress = getStoryProgress(story);
                const isCompleted = isStoryCompleted(story);
                const isBookmarked = isStoryBookmarked(story);

                return (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <div className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700">
                      {/* Thumbnail */}
                      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute top-4 left-4">
                          <span className={`${getLevelColor(story.level)} text-white border-0 px-2 py-1 rounded text-xs font-medium`}>
                            {story.level}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={() => isSignedIn ? toggleBookmark(story.id) : null}
                            disabled={!isSignedIn}
                            className={`p-2 rounded-full transition-colors ${
                              isBookmarked && isSignedIn
                                ? 'bg-yellow-500 text-white'
                                : 'bg-white/20 text-white hover:bg-white/30'
                            } ${!isSignedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={!isSignedIn ? 'Masuk untuk bookmark' : ''}
                          >
                            <Bookmark className="h-4 w-4" />
                          </button>
                          {story.audioAvailable && (
                            <button
                              onClick={() => isSignedIn ? handlePlay(story.id) : null}
                              disabled={!isSignedIn}
                              className={`p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors ${
                                !isSignedIn ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              title={!isSignedIn ? 'Masuk untuk audio' : ''}
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
                        {isCompleted && isSignedIn && (
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="bg-green-500 rounded-full p-3">
                              <CheckCircle2 className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        )}
                        {!isSignedIn && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="text-center text-white">
                              <LogIn className="h-8 w-8 mx-auto mb-2" />
                              <p className="text-sm">Masuk untuk akses penuh</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-medium">
                            {story.title.charAt(0)}
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {story.language}
                          </span>
                          <div className="ml-auto flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {story.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                          {story.description}
                        </p>

                        {/* Progress Bar */}
                        {progress > 0 && isSignedIn && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-slate-500">Progress</span>
                              <span className="text-xs text-slate-500">{progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1">
                              <div 
                                className="bg-blue-500 h-1 rounded-full transition-all duration-300" 
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {story.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {isSignedIn ? (
                            <button 
                              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isCompleted 
                                  ? 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                  : 'bg-blue-500 text-white hover:bg-blue-600'
                              }`}
                              onClick={() => updateProgress(story.id, progress > 0 ? progress : 10, false)}
                            >
                              {isCompleted ? (
                                <>
                                  <RotateCcw className="inline h-4 w-4 mr-2" />
                                  Baca Ulang
                                </>
                              ) : progress > 0 ? (
                                <>
                                  <BookOpen className="inline h-4 w-4 mr-2" />
                                  Lanjutkan
                                </>
                              ) : (
                                <>
                                  <Play className="inline h-4 w-4 mr-2" />
                                  Mulai Baca
                                </>
                              )}
                            </button>
                          ) : (
                            <SignInButton mode="modal">
                              <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                                <LogIn className="inline h-4 w-4 mr-2" />
                                Masuk untuk Baca
                              </button>
                            </SignInButton>
                          )}
                          <button 
                            className={`px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                              !isSignedIn ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={!isSignedIn}
                            title={!isSignedIn ? 'Masuk untuk komentar' : ''}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Demo limitation notice */}
                        {!isSignedIn && (
                          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-600 dark:text-blue-400 text-center">
                            Masuk untuk akses fitur lengkap: bookmark, progress tracking, audio, dan lebih banyak cerita
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                }}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Reset Filter
              </button>
            </motion.div>
          )}

          {/* Call to Action for Non-authenticated Users */}
          {!isSignedIn && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 text-center"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">
                  Siap untuk Memulai Perjalanan Belajar Anda?
                </h2>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Bergabunglah dengan ribuan pelajar lainnya dan nikmati fitur lengkap seperti progress tracking, 
                  bookmark, audio narasi, dan akses ke lebih dari 100+ cerita interaktif.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <SignInButton mode="modal">
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
                      <LogIn className="h-5 w-5" />
                      Mulai Gratis Sekarang
                    </button>
                  </SignInButton>
                  <div className="flex items-center gap-4 text-blue-100 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      100+ Cerita
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Progress Tracking
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Audio Narasi
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer for authenticated users */}
          {isSignedIn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 text-center text-slate-500 dark:text-slate-400"
            >
              <p className="text-sm">
                Terus belajar dan raih target harian Anda! 🎯
              </p>
              <div className="mt-4 flex justify-center gap-6 text-xs">
                <button 
                  onClick={() => setActiveTab('explore')}
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Jelajahi Lebih Banyak
                </button>
                <button className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                  Laporan Progress
                </button>
                <button className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                  Pengaturan
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }
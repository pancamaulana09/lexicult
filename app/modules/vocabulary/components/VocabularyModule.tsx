'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef, useTransition } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import LearningStatsPanel from './LearningStatsPanel';
import TabsSelector from './TabsSelector';
import FilterSearchBar from './FilterSearchBar';
import VocabularySetGrid from './VocabularySetGrid';
import LearningSessionDialog from './LearningSessionDialog';

// Types based on Prisma schema
interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  pronunciation: string | null;
  partOfSpeech: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  definition: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  audioUrl: string | null;
  imageUrl: string | null;
  tags: string[];
  // User-specific data from UserWord relation
  isFavorite: boolean;
  isLearned: boolean;
  masteryLevel: number;
  timesSeen: number;
  timesCorrect: number;
  lastReviewed: Date | null;
}

interface VocabularySet {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  estimatedTime: number;
  thumbnail: string | null;
  author: string;
  rating: number;
  isPremium: boolean;
  // Computed fields
  wordCount: number;
  completedWords: number;
  isUnlocked: boolean;
  words: VocabularyWord[];
}

interface LearningSession {
  id?: string;
  mode: 'Flashcard' | 'Quiz' | 'Spelling' | 'Listening' | 'Matching';
  currentIndex: number;
  totalWords: number;
  correctAnswers: number;
  startTime: Date;
  words: VocabularyWord[];
  setId: string;
}

interface LearningStats {
  totalWords: number;
  wordsLearned: number;
  dailyStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  masteryScore: number;
  timeSpent: number;
  accuracy: number;
}

interface VocabularyModuleProps {
  userId: string;
}

export default function VocabularyModule({ userId }: VocabularyModuleProps) {
  // State
  const [vocabularySets, setVocabularySets] = useState<VocabularySet[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('sets');
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);
  const [showSessionDialog, setShowSessionDialog] = useState<boolean>(false);
  const [learningStats, setLearningStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Performance optimizations
  const [isPending, startTransition] = useTransition();
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, any>>(new Map());
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Memoized filtered sets with optimized filtering
  const filteredSets = useMemo(() => {
    let filtered = vocabularySets;
    
    // Early return if no filters applied
    if (selectedCategory === 'All' && selectedLevel === 'All' && !searchQuery.trim()) {
      return filtered;
    }
    
    // Apply filters efficiently
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(set => set.category === selectedCategory);
    }
    
    if (selectedLevel !== 'All') {
      filtered = filtered.filter(set => set.level === selectedLevel);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(set => {
        // Use more efficient string matching
        const title = set.title.toLowerCase();
        const description = set.description.toLowerCase();
        const category = set.category.toLowerCase();
        
        return title.includes(query) || 
               description.includes(query) || 
               category.includes(query);
      });
    }
    
    return filtered;
  }, [vocabularySets, selectedCategory, selectedLevel, searchQuery]);

  // Optimized debounced search
  const debouncedSetSearchQuery = useCallback((query: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      startTransition(() => {
        setSearchQuery(query);
      });
    }, 300);
  }, []);

  // Cached API calls with abort controller
  const makeApiCall = useCallback(async (url: string, options: RequestInit = {}) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    // Check cache first
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    if (cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey);
    }

    try {
      const response = await fetch(url, {
        ...options,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      // Cache successful responses for 5 minutes
      cacheRef.current.set(cacheKey, data);
      setTimeout(() => cacheRef.current.delete(cacheKey), 5 * 60 * 1000);
      
      return data;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('Request cancelled');
      }
      throw err;
    }
  }, []);

  // Optimized fetch learning stats
  const fetchLearningStats = useCallback(async () => {
    try {
      const stats = await makeApiCall(`/api/learning-stats/${userId}`);
      setLearningStats(stats);
    } catch (err: any) {
      if (err.message !== 'Request cancelled') {
        console.error('Error fetching learning stats:', err);
        setError('Failed to load learning statistics');
      }
    }
  }, [userId, makeApiCall]);

  // Optimized fetch vocabulary sets
  const fetchVocabularySets = useCallback(async () => {
    try {
      setLoading(true);
      const sets = await makeApiCall(`/api/vocabulary-sets?userId=${userId}`);
      setVocabularySets(sets);
    } catch (err: any) {
      if (err.message !== 'Request cancelled') {
        console.error('Error fetching vocabulary sets:', err);
        setError('Failed to load vocabulary sets');
      }
    } finally {
      setLoading(false);
    }
  }, [userId, makeApiCall]);

  // Batch API calls on mount
  useEffect(() => {
    if (!userId) return;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Batch both API calls
        await Promise.allSettled([
          fetchLearningStats(),
          fetchVocabularySets()
        ]);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load data');
      }
    };

    loadInitialData();

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [userId, fetchLearningStats, fetchVocabularySets]);

  // Optimized session handling with batch updates
  const startLearningSession = useCallback(async (setId: string, mode: LearningSession['mode']) => {
    try {
      const vocabSet = vocabularySets.find(set => set.id === setId);
      if (!vocabSet?.words.length) return;

      const sessionData = await makeApiCall('/api/learning-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          setId,
          mode,
          totalWords: vocabSet.words.length,
        }),
      });

      const session: LearningSession = {
        id: sessionData.id,
        mode,
        currentIndex: 0,
        totalWords: vocabSet.words.length,
        correctAnswers: 0,
        startTime: new Date(),
        words: vocabSet.words,
        setId,
      };

      setCurrentSession(session);
      setShowSessionDialog(true);
    } catch (err: any) {
      if (err.message !== 'Request cancelled') {
        console.error('Error starting learning session:', err);
        setError('Failed to start learning session');
      }
    }
  }, [vocabularySets, userId, makeApiCall]);

  // Batch answer processing
  const handleSessionAnswer = useCallback(async (isCorrect: boolean) => {
    if (!currentSession) return;

    try {
      const currentWord = currentSession.words[currentSession.currentIndex];
      
      // Batch API calls
      const apiCalls = [
        makeApiCall('/api/session-answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: currentSession.id,
            wordId: currentWord.id,
            isCorrect,
            userAnswer: '',
            correctAnswer: currentWord.translation,
            timeSpent: 0,
          }),
        }),
        makeApiCall(`/api/user-words/${currentWord.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            isCorrect,
            masteryLevel: isCorrect 
              ? Math.min(currentWord.masteryLevel + 5, 100) 
              : Math.max(currentWord.masteryLevel - 2, 0),
          }),
        })
      ];

      await Promise.allSettled(apiCalls);

      const updatedSession = {
        ...currentSession,
        correctAnswers: isCorrect ? currentSession.correctAnswers + 1 : currentSession.correctAnswers,
        currentIndex: currentSession.currentIndex + 1,
      };

      if (updatedSession.currentIndex >= updatedSession.totalWords) {
        await completeSession(updatedSession);
        setShowSessionDialog(false);
        setCurrentSession(null);
        
        // Batch refresh calls
        await Promise.allSettled([fetchLearningStats(), fetchVocabularySets()]);
      } else {
        setCurrentSession(updatedSession);
      }
    } catch (err: any) {
      if (err.message !== 'Request cancelled') {
        console.error('Error handling session answer:', err);
        setError('Failed to record answer');
      }
    }
  }, [currentSession, userId, makeApiCall, fetchLearningStats, fetchVocabularySets]);

  // Optimized session completion
  const completeSession = useCallback(async (session: LearningSession) => {
    try {
      const accuracyRate = (session.correctAnswers / session.totalWords) * 100;
      const timeSpent = Math.floor((Date.now() - session.startTime.getTime()) / 1000);

      // Batch completion calls
      const completionCalls = [
        makeApiCall(`/api/learning-sessions/${session.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            correctAnswers: session.correctAnswers,
            completedWords: session.totalWords,
            accuracyRate,
            timeSpent,
            isCompleted: true,
            completedAt: new Date(),
          }),
        }),
        makeApiCall('/api/vocabulary-progress', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            setId: session.setId,
            completedWords: session.correctAnswers,
            accuracyRate,
            timeSpent: Math.floor(timeSpent / 60),
          }),
        })
      ];

      await Promise.allSettled(completionCalls);
    } catch (err: any) {
      if (err.message !== 'Request cancelled') {
        console.error('Error completing session:', err);
      }
    }
  }, [userId, makeApiCall]);

  // Optimized favorite toggle with optimistic updates
  const toggleFavorite = useCallback(async (wordId: string) => {
    try {
      // Optimistic update
      setVocabularySets(prev => prev.map(set => ({
        ...set,
        words: set.words.map(word => 
          word.id === wordId 
            ? { ...word, isFavorite: !word.isFavorite }
            : word
        )
      })));

      // Background API call
      await makeApiCall(`/api/user-words/${wordId}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      
    } catch (err: any) {
      // Revert optimistic update on error
      setVocabularySets(prev => prev.map(set => ({
        ...set,
        words: set.words.map(word => 
          word.id === wordId 
            ? { ...word, isFavorite: !word.isFavorite }
            : word
        )
      })));
      
      if (err.message !== 'Request cancelled') {
        console.error('Error toggling favorite:', err);
        setError('Failed to update favorite status');
      }
    }
  }, [userId, makeApiCall]);

  // Error retry handler
  const handleRetry = useCallback(() => {
    setError(null);
    Promise.allSettled([fetchVocabularySets(), fetchLearningStats()]);
  }, [fetchVocabularySets, fetchLearningStats]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400">Loading vocabulary sets...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-xl font-semibold text-red-600 mb-2">Oops! Something went wrong</p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Learning stats */}
        {learningStats && <LearningStatsPanel stats={learningStats} />}

        {/* Tabs */}
        <TabsSelector activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Filter + Search */}
        <FilterSearchBar
          searchQuery={searchQuery}
          setSearchQuery={debouncedSetSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
        />

        {/* Loading indicator for transitions */}
        {isPending && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Vocabulary sets grid */}
        <VocabularySetGrid
          vocabularySets={filteredSets}
          startLearningSession={startLearningSession}
          onToggleFavorite={toggleFavorite}
        />

        {/* Empty state */}
        {filteredSets.length === 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📚</div>
            <p className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Tidak ada set kosakata ditemukan
            </p>
            <p className="text-slate-500 dark:text-slate-500 mb-6">
              Coba ubah filter pencarian atau kata kunci Anda.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLevel('All');
              }}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-gray-700 transition-colors"
            >
              Reset Filter
            </button>
          </motion.div>
        )}

        {/* Learning session dialog */}
        <LearningSessionDialog
          open={showSessionDialog}
          onOpenChange={setShowSessionDialog}
          currentSession={currentSession}
          handleSessionAnswer={handleSessionAnswer}
        />
      </div>
    </div>
  );
}
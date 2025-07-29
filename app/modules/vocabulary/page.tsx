'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import LearningStatsPanel from './components/LearningStatsPanel';
import TabsSelector from './components/TabsSelector';
import FilterSearchBar from './components/FilterSearchBar';
import VocabularySetGrid from './components/VocabularySetGrid';
import LearningSessionDialog from './components/LearningSessionDialog';

// Mock types, you can move or import them
interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  partOfSpeech: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  definition: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  audioUrl?: string;
  imageUrl?: string;
  isFavorite: boolean;
  isLearned: boolean;
  masteryLevel: number; // 0-100
  timesSeen: number;
  timesCorrect: number;
  lastReviewed?: Date;
  tags: string[];
}

interface VocabularySet {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  wordCount: number;
  completedWords: number;
  estimatedTime: number;
  thumbnail: string;
  author: string;
  rating: number;
  isUnlocked: boolean;
  words: VocabularyWord[];
}

interface LearningSession {
  mode: 'flashcard' | 'quiz' | 'spelling' | 'listening' | 'matching';
  currentIndex: number;
  totalWords: number;
  correctAnswers: number;
  startTime: Date;
  words: VocabularyWord[];
}

interface LearningStats {
  totalWords: number;
  wordsLearned: number;
  dailyStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  masteryScore: number;
  timeSpent: number; // in minutes
  accuracy: number; // %
}

export default function VocabularyModule() {
  // State
  const [vocabularySets, setVocabularySets] = useState<VocabularySet[]>([]);
  const [filteredSets, setFilteredSets] = useState<VocabularySet[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('sets');
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);
  const [showSessionDialog, setShowSessionDialog] = useState<boolean>(false);

  // Mock learning stats data
  const [learningStats] = useState<LearningStats>({
    totalWords: 1247,
    wordsLearned: 834,
    dailyStreak: 12,
    weeklyGoal: 50,
    weeklyProgress: 37,
    masteryScore: 78,
    timeSpent: 2340,
    accuracy: 85,
  });

  // Load mock vocabulary sets on mount
  useEffect(() => {
    const mockVocabularySets: VocabularySet[] = [
      {
        id: '1',
        title: 'Kosakata Sehari-hari',
        description: 'Kata-kata yang sering digunakan dalam percakapan sehari-hari',
        category: 'Daily Life',
        level: 'Beginner',
        wordCount: 50,
        completedWords: 32,
        estimatedTime: 25,
        thumbnail: '/images/learning-illustrations/daily-life.jpg',
        author: 'Tim Lexicult',
        rating: 4.8,
        isUnlocked: true,
        words: [
          {
            id: '1-1',
            word: 'Rumah',
            translation: 'House',
            pronunciation: '/ru·mah/',
            partOfSpeech: 'Noun',
            difficulty: 'Easy',
            category: 'Daily Life',
            definition: 'Bangunan tempat tinggal manusia',
            examples: ['Rumah saya dekat dengan sekolah', 'Dia memiliki rumah yang besar'],
            synonyms: ['Tempat tinggal', 'Kediaman'],
            antonyms: [],
            isFavorite: true,
            isLearned: true,
            masteryLevel: 95,
            timesSeen: 12,
            timesCorrect: 11,
            lastReviewed: new Date('2024-01-20'),
            tags: ['Building', 'Home'],
          },
          // more words...
        ],
      },
      // More sets here...
    ];
    setVocabularySets(mockVocabularySets);
    setFilteredSets(mockVocabularySets);
  }, []);

  // Filtering logic
  useEffect(() => {
    let filtered = vocabularySets;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(set => set.category === selectedCategory);
    }
    if (selectedLevel !== 'All') {
      filtered = filtered.filter(set => set.level === selectedLevel);
    }
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        set =>
          set.title.toLowerCase().includes(query) ||
          set.description.toLowerCase().includes(query) ||
          set.category.toLowerCase().includes(query)
      );
    }
    setFilteredSets(filtered);
  }, [vocabularySets, selectedCategory, selectedLevel, searchQuery]);

  // Start learning session handler
  const startLearningSession = (setId: string, mode: LearningSession['mode']) => {
    const vocabSet = vocabularySets.find(set => set.id === setId);
    if (!vocabSet || vocabSet.words.length === 0) return;

    const session: LearningSession = {
      mode,
      currentIndex: 0,
      totalWords: vocabSet.words.length,
      correctAnswers: 0,
      startTime: new Date(),
      words: vocabSet.words,
    };
    setCurrentSession(session);
    setShowSessionDialog(true);
  };

  // Handle answer in session
  const handleSessionAnswer = (isCorrect: boolean) => {
    if (!currentSession) return;
    const updatedSession = {
      ...currentSession,
      correctAnswers: isCorrect ? currentSession.correctAnswers + 1 : currentSession.correctAnswers,
      currentIndex: currentSession.currentIndex + 1,
    };

    if (updatedSession.currentIndex >= updatedSession.totalWords) {
      // Session completed
      setShowSessionDialog(false);
      setCurrentSession(null);
      // Add success notification or update stats here
    } else {
      setCurrentSession(updatedSession);
    }
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Learning stats */}
        <LearningStatsPanel stats={learningStats} />

        {/* Tabs */}
        <TabsSelector activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Filter + Search */}
        <FilterSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
        />

        {/* Vocabulary sets grid */}
        <VocabularySetGrid
          vocabularySets={filteredSets}
          startLearningSession={startLearningSession}
        />

        {/* Empty state */}
        {filteredSets.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
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
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-gray-700"
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

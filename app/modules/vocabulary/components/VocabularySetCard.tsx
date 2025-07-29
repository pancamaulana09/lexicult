import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Book, Clock, Star, RefreshCw, Play, Flag, Layers, Brain, Target } from 'lucide-react';

interface Props {
  vocabularySet: VocabularySet;
  startLearningSession: (setId: string, mode: string) => void;
}

const learningModes = [
  { id: 'flashcard', name: 'Kartu Flash', icon: Layers, description: 'Belajar dengan kartu bolak-balik' },
  { id: 'quiz', name: 'Kuis', icon: Brain, description: 'Tes pemahaman dengan pertanyaan' },
  { id: 'spelling', name: 'Ejaan', icon: Star, description: 'Latihan menulis kata dengan benar' },
  { id: 'listening', name: 'Mendengar', icon: Target, description: 'Latihan mendengar dan memahami' },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner':
      return 'bg-green-500';
    case 'Intermediate':
      return 'bg-yellow-500';
    case 'Advanced':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export default function VocabularySetCard({ vocabularySet: set, startLearningSession }: Props) {
  const progressPercent = (set.completedWords / set.wordCount) * 100;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      {/* Header Image Section */}
      <div className="relative h-32 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-4 left-4">
          <Badge className={`${getLevelColor(set.level)} text-white border-0`}>{set.level}</Badge>
        </div>
        <div className="absolute top-4 right-4">
          {!set.isUnlocked && (
            <div className="bg-yellow-500 text-white p-2 rounded-full">
              <Flag className="h-4 w-4" />
            </div>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-bold mb-1 truncate">{set.title}</h3>
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <Book className="h-3 w-3" />
              {set.wordCount} kata
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {set.estimatedTime} menit
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-6 w-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-full h-full flex items-center justify-center text-xs text-white font-medium">
              {set.author.charAt(0)}
            </div>
          </Avatar>
          <span className="text-sm text-slate-600 dark:text-slate-400">{set.author}</span>
          <div className="ml-auto flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-sm text-slate-600 dark:text-slate-400">{set.rating}</span>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{set.description}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Progress</span>
            <span className="text-xs text-slate-500">
              {set.completedWords}/{set.wordCount}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <Badge variant="secondary" className="text-xs">
            {set.category}
          </Badge>
        </div>

        {/* Learning Modes */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mode Pembelajaran:</h4>
          <div className="grid grid-cols-2 gap-2">
            {learningModes.map(mode => (
              <Button
                key={mode.id}
                variant="outline"
                size="sm"
                onClick={() => startLearningSession(set.id, mode.id)}
                disabled={!set.isUnlocked}
                className="flex items-center gap-1 text-xs"
              >
                <mode.icon className="h-3 w-3" />
                {mode.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Start Button */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button className="w-full" size="sm" disabled={!set.isUnlocked}>
            {set.completedWords > 0 ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Lanjutkan Belajar
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Mulai Belajar
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

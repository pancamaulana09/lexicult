import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Book, CheckCircle2, Zap, Target, Trophy, Clock, Heart } from 'lucide-react';

interface Props {
  stats: {
    totalWords: number;
    wordsLearned: number;
    dailyStreak: number;
    weeklyGoal: number;
    weeklyProgress: number;
    masteryScore: number;
    timeSpent: number;
    accuracy: number;
  };
}

export default function LearningStatsPanel({ stats }: Props) {
  const items = [
    { label: 'Total Kata', value: stats.totalWords.toLocaleString(), icon: Book, color: 'blue' },
    { label: 'Dikuasai', value: stats.wordsLearned.toLocaleString(), icon: CheckCircle2, color: 'green' },
    { label: 'Streak Hari', value: stats.dailyStreak, icon: Zap, color: 'orange' },
    { label: 'Target Minggu', value: `${stats.weeklyProgress}/${stats.weeklyGoal}`, icon: Target, color: 'purple' },
    { label: 'Penguasaan', value: `${stats.masteryScore}%`, icon: Trophy, color: 'yellow' },
    { label: 'Waktu Belajar', value: `${Math.floor(stats.timeSpent / 60)}h`, icon: Clock, color: 'indigo' },
    { label: 'Akurasi', value: `${stats.accuracy}%`, icon: Target, color: 'pink' },
    { label: 'Favorit', value: '47', icon: Heart, color: 'red' }, // Hardcoded for now
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
      {items.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Card className="p-4 text-center hover:shadow-lg transition-shadow">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/20 mb-2`}>
              <stat.icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
            </div>
            <div className="text-lg font-bold text-slate-800 dark:text-white mb-1">{stat.value}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { LEARNING_MODULES } from '@/lib/constants';
import clsx from 'clsx';
import React from 'react';
import { useRouter } from 'next/navigation';

interface LearningModulesProps {
  isDarkMode: boolean;
  themeClasses: {
    card: string;
    border: string;
  };
}

interface LearningModuleCardProps {
  title: string;
  slug: string;
  description: string;
  icon: React.ElementType;
  color: string;
  progress: string;
  level: string;
  isDarkMode: boolean;
  themeClasses: {
    card: string;
    border: string;
  };
  delay: number;
  onClick: () => void;
}

const cardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1 + 0.2,
      duration: 0.35,
      ease: [0.33, 1, 0.68, 1],
    },
  }),
  hover: {
    y: -5,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

const LearningModuleCard: React.FC<LearningModuleCardProps> = React.memo(
  ({
    title,
    description,
    icon: Icon,
    color,
    progress,
    level,
    isDarkMode,
    themeClasses,
    delay,
    onClick,
  }) => {
    return (
      <motion.div
        onClick={onClick}
        className={clsx(
          themeClasses.card,
          'cursor-pointer select-none backdrop-blur-sm rounded-lg p-3 lg:p-4 border transition-all hover:shadow-md active:scale-[0.98]',
          themeClasses.border
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        custom={delay}
      >
        <div
          className={clsx(
            'w-10 h-10 lg:w-12 lg:h-12 rounded-lg mb-3 flex items-center justify-center bg-gradient-to-r',
            color
          )}
        >
          <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
        </div>

        <h3 className="font-semibold text-sm mb-2">{title}</h3>
        <p
          className={clsx(
            'text-xs mb-3 leading-relaxed',
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          )}
        >
          {description}
        </p>

        <div className="flex justify-between items-center text-xs mb-2">
          <span>{level}</span>
          <span className=" text-white px-2 py-1 rounded">{progress}</span>
        </div>

        <div
          className={clsx(
            'w-full rounded-full h-2',
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          )}
        >
          <div
            className="bg-gradient-to-r from-[#4b1002] via-[#bb4114] to-[#ffd1b3]
 h-2 rounded-full transition-all"
            style={{ width: progress }}
          />
        </div>
      </motion.div>
    );
  }
);
LearningModuleCard.displayName = 'LearningModuleCard';

export const LearningModules: React.FC<LearningModulesProps> = ({
  isDarkMode,
  themeClasses,
}) => {
  const router = useRouter();

  return (
    <section className="mb-6">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-lg lg:text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 lg:w-6 lg:h-6" />
          Learning Modules
        </h2>
        <button
          onClick={() => router.push('/modules')}
          className="text-[#bb4114] text-xs lg:text-sm hover:underline transition-all"
        >
          View all
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {LEARNING_MODULES.map((module, index) => (
          <LearningModuleCard
            key={module.slug}
            title={module.title}
            slug={module.slug}
            description={module.description}
            icon={module.icon}
            color={module.color}
            progress={module.progress}
            level={module.level}
            isDarkMode={isDarkMode}
            themeClasses={themeClasses}
            delay={index}
            onClick={() => router.push(`/modules/${module.slug}`)}
          />
        ))}
      </div>
    </section>
  );
};

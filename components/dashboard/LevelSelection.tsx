'use client';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { LEVELS } from '@/lib/constants';
import { Level } from '@/types';

interface LevelSelectionProps {
  selectedLevel: Level;
  setSelectedLevel: (level: Level) => void;
}

export const LevelSelection: React.FC<LevelSelectionProps> = ({
  selectedLevel,
  setSelectedLevel,
}) => {
  return (
    <motion.div
      className="relative border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-8 mb-4 lg:mb-6 overflow-hidden bg-black/20"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* 🔥 Background Image Layer */}
      <Image
        src="/bg.jpg" // 💡 change path to your actual background image
        alt="Decorative Background"
        fill
        className="object-cover opacity-40 z-0"
        priority
      />

      <div className="relative z-10 text-white">
        <h1 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-4">
          CHOOSE YOUR<br />
          LEARNING LEVEL
        </h1>
        <p className="text-sm lg:text-lg mb-4 lg:mb-6 opacity-90">
          Select your proficiency level<br />
          and start your language<br />
          learning journey today
        </p>

        <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-4">
          {LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                selectedLevel === level
                  ? 'bg-[#bb4114] text-white'
                  : 'bg-white/20 text-white hover:bg-[#6c44fc]/30'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <motion.button
          className="bg-[#bb4114] text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg font-semibold flex items-center text-sm lg:text-base"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
          Start Learning {selectedLevel}
        </motion.button>
      </div>

      {/* ✨ Mascot image with animation */}
      <motion.div
        className="absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 z-20"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="w-58 h-28 lg:w-80 lg:h-80 flex items-center justify-center">
          <Image
            src="/mascot/lexicultMascot.png"
            alt="Lexicult Mascot"
            width={560}
            height={560}
            className="object-contain"
            priority
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

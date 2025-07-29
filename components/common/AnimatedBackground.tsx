// components/common/AnimatedBackground.tsx
'use client'
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  isDarkMode: boolean;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ isDarkMode }) => {
  return (
    <div className="absolute inset-0 opacity-20">
      <motion.div 
        className={`absolute top-10 left-10 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-300'} rounded-full blur-xl`}
        animate={{ x: [0, 50, 0], y: [0, 25, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div 
        className={`absolute top-1/2 right-10 sm:right-20 w-12 sm:w-16 lg:w-24 h-12 sm:h-16 lg:h-24 ${isDarkMode ? 'bg-purple-400' : 'bg-purple-300'} rounded-full blur-xl`}
        animate={{ x: [0, -40, 0], y: [0, -15, 0] }}
        transition={{ duration: 15, repeat: Infinity, delay: 5 }}
      />
      <motion.div 
        className={`absolute bottom-20 left-1/3 w-14 sm:w-20 lg:w-28 h-14 sm:h-20 lg:h-28 ${isDarkMode ? 'bg-cyan-400' : 'bg-cyan-300'} rounded-full blur-xl`}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, delay: 10 }}
      />
    </div>
  );
};

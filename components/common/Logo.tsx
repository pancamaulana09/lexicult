// components/common/Logo.tsx
'use client'
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

interface LogoProps {
  isDarkMode: boolean;
}

export const Logo: React.FC<LogoProps> = ({ isDarkMode }) => {
  return (
    <div className="flex items-center mb-6 lg:mb-8">
      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Globe className="w-5 h-5 lg:w-6 lg:h-6" />
        </motion.div>
      </div>
      <div className="ml-3">
        <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          LEXICULT
        </div>
        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Language Learning
        </div>
      </div>
    </div>
  );
};

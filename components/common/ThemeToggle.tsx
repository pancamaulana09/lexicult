// components/common/ThemeToggle.tsx
'use client'
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  themeClasses: any;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  isDarkMode, 
  toggleTheme, 
  themeClasses 
}) => {
  return (
    <motion.button
      onClick={toggleTheme}
      className={`p-2 rounded-lg ${themeClasses.hover} transition-all`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </motion.button>
  );
};

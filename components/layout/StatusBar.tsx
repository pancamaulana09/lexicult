// components/layout/StatusBar.tsx
'use client'
import { motion } from 'framer-motion';
import { Volume2, Settings, Calendar, Globe } from 'lucide-react';
import { Level } from '@/types';

interface StatusBarProps {
  themeClasses: any;
  isDarkMode: boolean;
  selectedLevel: Level;
}

export const StatusBar: React.FC<StatusBarProps> = ({ 
  themeClasses, 
  isDarkMode,
  selectedLevel 
}) => {
  return (
    <motion.div 
      className={`${themeClasses.card} backdrop-blur-sm border-t ${themeClasses.border} p-4`}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 lg:space-x-6 overflow-x-auto">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#bb4114] rounded-full flex items-center justify-center">
              <Globe className="w-3 h-3 lg:w-4 lg:h-4" />
            </div>
            <span className="text-xs lg:text-sm">LEXICULT SESSION</span>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-xs lg:text-sm">Current Level: {selectedLevel}</span>
          </div>
          <div className="text-xs lg:text-sm flex-shrink-0 hidden sm:block">Study Time: 2h 15m</div>
          <div className="text-xs lg:text-sm flex-shrink-0 hidden md:block">Daily Goal: 85%</div>
          <div className="text-xs lg:text-sm flex-shrink-0 hidden lg:block">Streak: 12 days</div>
          <div className="text-xs lg:text-sm text-green-400 flex-shrink-0">Active Session</div>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          <Volume2 className={`w-4 h-4 lg:w-5 lg:h-5 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} cursor-pointer transition-colors`} />
          <Settings className={`w-4 h-4 lg:w-5 lg:h-5 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} cursor-pointer transition-colors`} />
          <motion.div 
            className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
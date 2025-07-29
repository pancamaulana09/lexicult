// components/chat/SearchBar.tsx
'use client'
import { Search } from 'lucide-react';

interface SearchBarProps {
  themeClasses: any;
  isDarkMode: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  themeClasses, 
  isDarkMode 
}) => {
  return (
    <div className="mt-4">
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 lg:w-4 lg:h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        <input 
          type="text" 
          placeholder="Search study partners..." 
          className={`w-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'} rounded-lg pl-8 lg:pl-10 pr-4 py-2 text-sm border ${isDarkMode ? 'border-white/20 focus:border-blue-500' : 'border-gray-300 focus:border-blue-500'} outline-none transition-colors`}
        />
      </div>
    </div>
  );
};
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Props {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedLevel: string;
  setSelectedLevel: (val: string) => void;
}

const categories = ['All', 'Daily Life', 'Business', 'Academic', 'Travel', 'Technology', 'Health'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function FilterSearchBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLevel,
  setSelectedLevel,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Cari set kosakata berdasarkan judul, kategori, atau deskripsi..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <select
        value={selectedCategory}
        onChange={e => setSelectedCategory(e.target.value)}
        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select
        value={selectedLevel}
        onChange={e => setSelectedLevel(e.target.value)}
        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
      >
        {levels.map(level => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
    </div>
  );
}

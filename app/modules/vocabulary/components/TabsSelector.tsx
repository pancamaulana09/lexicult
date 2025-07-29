import React from 'react';
import { Heart, CheckCircle2, RefreshCw, Layers } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs: Tab[] = [
  { id: 'sets', label: 'Set Kosakata', icon: Layers },
  { id: 'favorites', label: 'Favorit', icon: Heart },
  { id: 'learned', label: 'Dikuasai', icon: CheckCircle2 },
  { id: 'review', label: 'Ulasan', icon: RefreshCw },
];

export default function TabsSelector({ activeTab, setActiveTab }: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex space-x-1 bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

'use client'

import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { useSidebar } from '@/hooks/useSidebar';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatusBar } from '@/components/layout/StatusBar';
import { ModuleCard } from '@/components/learning/ModuleCard';
import { LessonCard } from '@/components/learning/LessonCard';
import { ProgressBar } from '@/components/learning/ProgressBar';
import { LevelBadge } from '@/components/learning/LevelBadge';
import { ActivityTracker } from '@/components/learning/ActivityTracker';
import type { Level } from '@/types';

export default function LearningPage() {
  const [selectedLevel, setSelectedLevel] = useState<Level>('A1');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  
  const { isDarkMode, toggleTheme, themeClasses } = useTheme();
  const { isMobile } = useResponsive();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} relative overflow-hidden transition-all duration-300`}>
      <AnimatedBackground isDarkMode={isDarkMode} />
      
      <div className="relative z-10 flex h-screen">
        <Sidebar 
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
          themeClasses={themeClasses}
          isDarkMode={isDarkMode}
          toggleSidebar={toggleSidebar}
          closeSidebar={closeSidebar}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <Header 
            themeClasses={themeClasses}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            toggleSidebar={toggleSidebar}
          />

          <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold">Learning Modules</h1>
                  <LevelBadge level={selectedLevel} />
                </div>
                
                <ProgressBar 
                  progress={65} 
                  level={selectedLevel}
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Activity Tracker */}
              <div className="mb-8">
                <ActivityTracker 
                  isDarkMode={isDarkMode}
                  themeClasses={themeClasses}
                />
              </div>

              {/* Module Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <ModuleCard 
                  title="Cultural Basics"
                  description="Learn fundamental cultural concepts and greetings"
                  progress={80}
                  lessons={12}
                  duration="2 hours"
                  difficulty="Beginner"
                  isDarkMode={isDarkMode}
                  onClick={() => setSelectedModule('cultural-basics')}
                />
                
                <ModuleCard 
                  title="Daily Conversations"
                  description="Master everyday dialogues and expressions"
                  progress={45}
                  lessons={18}
                  duration="3 hours"
                  difficulty="Intermediate"
                  isDarkMode={isDarkMode}
                  onClick={() => setSelectedModule('daily-conversations')}
                />
                
                <ModuleCard 
                  title="Professional Context"
                  description="Business language and formal communication"
                  progress={20}
                  lessons={15}
                  duration="2.5 hours"
                  difficulty="Advanced"
                  isDarkMode={isDarkMode}
                  onClick={() => setSelectedModule('professional-context')}
                />
              </div>

              {/* Recent Lessons */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <LessonCard 
                    title="Greetings Around the World"
                    module="Cultural Basics"
                    progress={75}
                    duration="15 min"
                    type="Interactive"
                    isDarkMode={isDarkMode}
                  />
                  
                  <LessonCard 
                    title="Ordering Food"
                    module="Daily Conversations"
                    progress={30}
                    duration="20 min"
                    type="Practice"
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            </div>
          </div>

          <StatusBar 
            themeClasses={themeClasses}
            isDarkMode={isDarkMode}
            selectedLevel={selectedLevel}
          />
        </div>
      </div>
    </div>
  );
}
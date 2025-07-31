'use client';

import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { useSidebar } from '@/hooks/useSidebar';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { StatusBar } from '@/components/layout/StatusBar';
import { useState } from 'react';
import type { Level } from '@/types';

export default function ModulesLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('Chat');
  const [messages] = useState(3);

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

          <div className="flex-1 flex flex-col lg:flex-row min-h-0">
            {/* Main Content */}
            <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
              {children}
            </div>

            {/* Right Sidebar */}
            <RightSidebar
              themeClasses={themeClasses}
              isDarkMode={isDarkMode}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              messages={messages}
            />
          </div>

          {/* Status Bar */}
          <StatusBar
            themeClasses={themeClasses}
            isDarkMode={isDarkMode}
            selectedLevel={'A1'}
          />
        </div>
      </div>
    </div>
  );
}

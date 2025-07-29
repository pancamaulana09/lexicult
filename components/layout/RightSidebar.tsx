'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Bot, Mic, MessageSquare, Search, Headphones } from 'lucide-react'
import { VoiceBookingCard } from '@/components/dashboard/VoiceBookingCard'
import { StudyBuddies } from '@/components/chat/StudyBuddies'
import { AIAssistantCard } from '@/components/dashboard/AIAssistantCard'

interface RightSidebarProps {
  themeClasses: { card: string; border: string }
  isDarkMode: boolean
  activeTab: string
  setActiveTab: (tab: string) => void
  messages: number
}

const TAB_ITEMS = [
  { id: 'voiceBooking', label: 'Voice Booking', icon: Mic },
  { id: 'aiAssistant', label: 'AI Assistant', icon: Bot },
  { id: 'studyBuddies', label: 'Study Buddies', icon: '' }, // placeholder, replace with icon below
]

const TAB_ICONS = {
  voiceBooking: Mic,
  aiAssistant: Bot,
  studyBuddies: MessageSquare, // Using MessageSquare icon for Study Buddies tab
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  themeClasses,
  isDarkMode,
  activeTab,
  setActiveTab,
  messages,
}) => {
  return (
    <motion.aside
      className={`w-full lg:w-80 flex flex-col ${themeClasses.card} backdrop-blur-sm border-t lg:border-t-0 lg:border-l ${themeClasses.border} p-4 overflow-y-auto`}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      role="complementary"
      aria-label="Right sidebar"
    >
      {/* Tab navigation */}
      <nav
        role="tablist"
        aria-label="Right sidebar navigation"
        className="flex justify-between mb-4 border-b border-gray-300 dark:border-gray-700 pb-2"
      >
        {Object.entries(TAB_ICONS).map(([tabId, Icon]) => {
          const isActive = activeTab === tabId
          return (
            <button
              key={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tabId}-panel`}
              id={`${tabId}-tab`}
              onClick={() => setActiveTab(tabId)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                isActive
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
              {tabId === 'studyBuddies' && messages > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 ml-1 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">
                  {messages}
                </span>
              )}
              <span className="sr-only">{tabId === 'voiceBooking' ? 'Voice Booking' : tabId === 'aiAssistant' ? 'AI Assistant' : 'Study Buddies'}</span>
            </button>
          )
        })}
      </nav>

      {/* Content panels */}
      <section
        role="tabpanel"
        id="voiceBooking-panel"
        aria-labelledby="voiceBooking-tab"
        hidden={activeTab !== 'voiceBooking'}
        className={`flex-1 ${activeTab === 'voiceBooking' ? 'block' : 'hidden'}`}
      >
        <VoiceBookingCard />
      </section>

      <section
        role="tabpanel"
        id="aiAssistant-panel"
        aria-labelledby="aiAssistant-tab"
        hidden={activeTab !== 'aiAssistant'}
        className={`flex-1 ${activeTab === 'aiAssistant' ? 'block' : 'hidden'}`}
      >
        <AIAssistantCard />
      </section>

      <section
        role="tabpanel"
        id="studyBuddies-panel"
        aria-labelledby="studyBuddies-tab"
        hidden={activeTab !== 'studyBuddies'}
        className={`flex-1 ${activeTab === 'studyBuddies' ? 'block' : 'hidden'}`}
      >
        <StudyBuddies
          themeClasses={themeClasses}
          isDarkMode={isDarkMode}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          messages={messages}
        />
      </section>
    </motion.aside>
  )
}

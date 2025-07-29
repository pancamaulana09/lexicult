'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Crown, Zap, Award, Menu } from 'lucide-react'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { useUser, SignOutButton } from '@clerk/nextjs'
import Image from 'next/image'

interface HeaderProps {
  themeClasses: {
    card: string
    border: string
  }
  isDarkMode: boolean
  toggleTheme: () => void
  toggleSidebar: () => void
}

export const Header: React.FC<HeaderProps> = ({
  themeClasses,
  isDarkMode,
  toggleTheme,
  toggleSidebar,
}) => {
  const { user } = useUser()

  return (
    <motion.header
      className={`flex items-center justify-between p-4 lg:p-6  border-b ${themeClasses.card} ${themeClasses.border}`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      role="banner"
    >
      {/* Left Section: Sidebar toggle & Premium/Upgrade buttons */}
      <div className="flex items-center space-x-3 lg:space-x-5">
        {/* Sidebar toggle for mobile */}
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar menu"
          className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
          type="button"
        >
          <Menu className="w-6 h-6 text-current" />
        </button>

        {/* Premium Badge */}
        <button
          type="button"
          className="flex items-center gap-1 px-3 py-2 text-xs lg:text-sm font-semibold rounded-lg bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-md hover:brightness-110 transition"
          aria-label="Premium subscription badge"
        >
          <Crown className="w-4 h-4" />
          <span className="hidden sm:inline">Premium</span>
        </button>

        {/* Upgrade Button */}
        <button
          type="button"
          className="px-3 py-2 text-xs lg:text-sm font-semibold rounded-lg bg-green-600 text-white shadow-md hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500"
        >
          Upgrade
        </button>
      </div>

      {/* Right Section: Theme toggle, XP and level indicators, user info */}
      <div className="flex items-center space-x-4 lg:space-x-6">
        {/* Theme toggle */}
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} themeClasses={themeClasses} />

        {/* XP Indicator */}
        <div
          className={`hidden sm:flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium select-none ${
            isDarkMode ? 'bg-blue-600/25 text-blue-300' : 'bg-blue-100 text-blue-700'
          }`}
          aria-label="User experience points"
          title="Experience Points (XP)"
        >
          <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <span>1,250 XP</span>
        </div>

        {/* Level Indicator */}
        <div
          className={`hidden sm:flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium select-none ${
            isDarkMode ? 'bg-orange-600/25 text-orange-300' : 'bg-orange-100 text-orange-700'
          }`}
          aria-label="User level"
          title="Current Level"
        >
          <Award className="w-5 h-5 text-orange-400 flex-shrink-0" />
          <span>Level 12</span>
        </div>

        {/* User Info & Sign Out */}
        {user && (
          <div className="flex items-center space-x-3">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={`${user.firstName ?? 'User'} avatar`}
                width={32}
                height={32}
                className="rounded-full object-cover"
                priority
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white text-sm font-semibold select-none">
                {user.firstName ? user.firstName.charAt(0) : 'U'}
              </div>
            )}

            <span className="hidden sm:inline text-sm font-medium truncate max-w-[6rem]">
              {user.firstName}
            </span>

            <SignOutButton>
              <button
                type="button"
                className="text-red-600 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded"
                aria-label="Sign out"
              >
                Sign Out
              </button>
            </SignOutButton>
          </div>
        )}
      </div>
    </motion.header>
  )
}

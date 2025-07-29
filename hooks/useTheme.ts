'use client'
import { useState } from 'react'

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const themeClasses = {
    bg: isDarkMode 
      ? 'bg-[#191a1a]' 
      : 'bg-gradient-to-br from-white via-sky-100 to-blue-100',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    sidebar: isDarkMode ? 'bg-[#1f2121]' : 'bg-white/80',
    card: isDarkMode ? 'bg-[#1f2121]' : 'bg-white/90',
    border: isDarkMode ? 'border-white/10' : 'border-gray-300',
    hover: isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100/50',
  }

  return {
    isDarkMode,
    toggleTheme,
    themeClasses,
  }
}

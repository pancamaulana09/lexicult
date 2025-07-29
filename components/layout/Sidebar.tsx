'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { SIDEBAR_ITEMS, ADMIN_FEATURES } from '@/lib/constants';
import clsx from 'clsx';

interface SidebarProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  themeClasses: {
    sidebar: string;
    border: string;
    hover: string;
  };
  isDarkMode: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

interface SidebarItemProps {
  label: string;
  icon: React.ElementType;
  href: string;
  isActive: boolean;
  onClick?: () => void;
  delay: number;
  themeHover: string;
  isCollapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon: Icon,
  href,
  isActive,
  onClick,
  delay,
  themeHover,
  isCollapsed = false,
}) => {
  const router = useRouter();

  return (
    <motion.div
      className={clsx(
        'group relative flex items-center rounded-lg cursor-pointer transition-all duration-200',
        isCollapsed ? 'p-2 justify-center' : 'p-2 lg:p-3',
        isActive
          ? 'bg-[#bb4114]'
          : themeHover
      )}
      whileHover={{ x: isActive ? 0 : 3, scale: isActive ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay, duration: 0.3, ease: 'easeOut' }}
      onClick={() => {
        router.push(href);
        onClick?.();
      }}
    >
      <Icon className={clsx(
        'flex-shrink-0 transition-all duration-200',
        isCollapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'
      )} />
      
      {!isCollapsed && (
        <span className="text-sm font-medium truncate">{label}</span>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </motion.div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  isMobile,
  themeClasses,
  isDarkMode,
  toggleSidebar,
  closeSidebar,
}) => {
  const pathname = usePathname();
  const isCollapsed = !isSidebarOpen && !isMobile;

  return (
    <>
      {/* Sidebar Panel */}
      <motion.div
        className={clsx(
          // Base positioning
          isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative',
          // Width handling
          isMobile 
            ? 'w-64' 
            : isCollapsed 
              ? 'w-16' 
              : 'w-64',
          // Background and styling
          themeClasses.sidebar,
          'backdrop-blur-sm border-r',
          themeClasses.border,
          'flex flex-col h-full transition-all duration-300 ease-in-out',
          // Mobile transform
          isMobile && !isSidebarOpen && '-translate-x-full'
        )}
        initial={false}
        animate={{
          width: isMobile ? 256 : (isCollapsed ? 64 : 256),
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Header Section */}
        <div className={clsx(
          'flex items-center justify-between p-4 border-b',
          themeClasses.border,
          isCollapsed && !isMobile && 'justify-center'
        )}>
          {(!isCollapsed || isMobile) && (
            <Logo isDarkMode={isDarkMode} />
          )}
          
          {/* Toggle Button for Desktop */}
          {!isMobile && (
            <motion.button
              onClick={toggleSidebar}
              className={clsx(
                'p-1.5 rounded-lg transition-colors duration-200',
                themeClasses.hover,
                isCollapsed && 'absolute -right-3 top-4 bg-white dark:bg-gray-800 border shadow-md z-10'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </motion.button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto">
          <nav 
            role="navigation" 
            aria-label="Sidebar main navigation" 
            className={clsx(
              'space-y-1 p-3',
              isCollapsed && !isMobile && 'px-2'
            )}
          >
            {SIDEBAR_ITEMS.map((item, index) => (
              <SidebarItem
                key={item.label}
                label={item.label}
                icon={item.icon}
                href={item.href}
                isActive={pathname === item.href}
                delay={index * 0.05}
                onClick={isMobile ? closeSidebar : undefined}
                themeHover={themeClasses.hover}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>

          {/* Admin Section */}
          {ADMIN_FEATURES && ADMIN_FEATURES.length > 0 && (
            <div className={clsx(
              'mt-6 border-t pt-4',
              themeClasses.border,
              isCollapsed && !isMobile ? 'px-2' : 'px-3'
            )}>
              {(!isCollapsed || isMobile) && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide font-semibold px-2">
                  Admin
                </div>
              )}
              <div className="space-y-1">
                {ADMIN_FEATURES.map((feature, index) => (
                  <SidebarItem
                    key={feature.label}
                    label={feature.label}
                    icon={Settings}
                    href={feature.href}
                    isActive={pathname === feature.href}
                    delay={(SIDEBAR_ITEMS.length + index) * 0.05}
                    onClick={isMobile ? closeSidebar : undefined}
                    themeHover={themeClasses.hover}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Section */}
        {(!isCollapsed || isMobile) && (
          <div className="border-t p-4 space-y-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="space-y-1">
              <div className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition-colors">
                Learning Progress
              </div>
              <div className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition-colors">
                Terms of Use
              </div>
              <div className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition-colors">
                Privacy Policy
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};
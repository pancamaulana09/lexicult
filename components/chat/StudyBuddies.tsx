// components/chat/StudyBuddies.tsx
'use client'
import { ChatTabs } from './ChatTabs';
import { FriendsList } from './FriendsList';
import { SearchBar } from './SearchBar';

interface StudyBuddiesProps {
  themeClasses: any;
  isDarkMode: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  messages: number;
}

export const StudyBuddies: React.FC<StudyBuddiesProps> = ({ 
  themeClasses, 
  isDarkMode, 
  activeTab, 
  setActiveTab, 
  messages 
}) => {
  return (
    <div className="mb-4 lg:mb-6">
      <ChatTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        messages={messages}
        themeClasses={themeClasses}
        isDarkMode={isDarkMode}
      />
      <FriendsList 
        themeClasses={themeClasses}
        isDarkMode={isDarkMode}
      />
      <SearchBar 
        themeClasses={themeClasses}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
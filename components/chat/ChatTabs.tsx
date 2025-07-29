// components/chat/ChatTabs.tsx
'use client'

interface ChatTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  messages: number;
  themeClasses: any;
  isDarkMode: boolean;
}

export const ChatTabs: React.FC<ChatTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  messages, 
  themeClasses, 
  isDarkMode 
}) => {
  const tabs = ['Chat', 'Study Groups', 'Friends'];

  return (
    <div className="flex space-x-1 mb-4 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-2 py-2 lg:px-3 lg:py-2 text-xs lg:text-sm rounded-lg transition-all whitespace-nowrap ${
            activeTab === tab 
              ? 'bg-blue-600 text-white' 
              : `${isDarkMode ? 'text-gray-400' : 'text-gray-600'} ${themeClasses.hover}`
          }`}
        >
          {tab}
          {tab === 'Study Groups' && (
            <span className="ml-1 bg-orange-500 text-xs px-1 rounded">
              ({messages})
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
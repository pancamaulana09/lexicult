// components/chat/FriendsList.tsx
'use client'
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

interface Friend {
  name: string;
  status: 'online' | 'offline';
  activity: string;
}

interface FriendsListProps {
  themeClasses: any;
  isDarkMode: boolean;
}

export const FriendsList: React.FC<FriendsListProps> = ({ 
  themeClasses, 
  isDarkMode 
}) => {
  const friends: Friend[] = [
    { name: 'Sarah Johnson', status: 'online', activity: 'Learning Grammar A2' },
    { name: 'Mike Chen', status: 'online', activity: 'Practicing Speaking' },
    { name: 'Emma Davis', status: 'online', activity: 'Reading Stories B1' },
    { name: 'Alex Rivera', status: 'online', activity: 'Vocabulary Quiz' },
    { name: 'Lisa Wong', status: 'offline', activity: 'Last seen 2h ago' },
    { name: 'Tom Wilson', status: 'offline', activity: 'Last seen 1d ago' }
  ];

  return (
    <div className="space-y-3 max-h-64 lg:max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between">
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Study Partners
        </span>
      </div>
      
      {friends.map((friend, index) => (
        <motion.div
          key={friend.name}
          className={`flex items-center justify-between p-2 ${themeClasses.hover} rounded-lg cursor-pointer`}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 + 1 }}
        >
          <div className="flex items-center min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2 lg:mr-3 flex items-center justify-center text-xs font-bold">
                {friend.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'} ${
                friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
              }`}></div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm truncate">{friend.name}</div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                {friend.activity}
              </div>
            </div>
          </div>
          {friend.status === 'online' && (
            <MessageSquare className={`w-3 h-3 lg:w-4 lg:h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} flex-shrink-0`} />
          )}
        </motion.div>
      ))}
    </div>
  );
};
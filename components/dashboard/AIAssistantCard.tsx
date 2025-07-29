// components/dashboard/AIAssistantCard.tsx
'use client'
import { Bot } from 'lucide-react';

export const AIAssistantCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 mb-4 lg:mb-6">
      <div className="flex items-center mb-2">
        <Bot className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
        <span className="font-bold text-sm lg:text-base">AI CHATBOT</span>
      </div>
      <div className="text-sm opacity-75">
        Practice conversations with AI assistant
      </div>
    </div>
  );
};
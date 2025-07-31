'use client'

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { useSidebar } from '@/hooks/useSidebar';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { StatusBar } from '@/components/layout/StatusBar';
import { VoiceRecorder } from '@/components/voice/VoiceRecorder';
import { AudioPlayer } from '@/components/voice/AudioPlayer';
import { PronunciationFeedback } from '@/components/voice/PronunciationFeedback';
import { VoiceSettings } from '@/components/voice/VoiceSettings';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs } from '@/components/ui/tabs';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Headphones,
  MessageCircle,
  Brain,
  Trophy,
  Star,
  Target,
  CheckCircle,
  Clock
} from 'lucide-react';
import type { Level } from '@/types';

interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  feedback?: {
    pronunciation: number;
    fluency: number;
    accuracy: number;
  };
}

interface VoiceSession {
  id: string;
  topic: string;
  level: Level;
  duration: number;
  messagesCount: number;
  score: number;
  completed: boolean;
}

export default function VoiceAssistantPage() {
  const [selectedLevel, setSelectedLevel] = useState<Level>('A1');
  const [activeTab, setActiveTab] = useState('conversation');
  const [messages] = useState(3);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('Daily Conversation');
  const [sessionProgress, setSessionProgress] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI voice assistant. Let's practice English conversation together. What would you like to talk about today?",
      timestamp: new Date(),
      audioUrl: '/audio/greeting.mp3'
    }
  ]);

  const [recentSessions] = useState<VoiceSession[]>([
    {
      id: '1',
      topic: 'Restaurant Ordering',
      level: 'B1',
      duration: 15,
      messagesCount: 12,
      score: 85,
      completed: true
    },
    {
      id: '2',
      topic: 'Job Interview',
      level: 'B2',
      duration: 22,
      messagesCount: 18,
      score: 78,
      completed: true
    },
    {
      id: '3',
      topic: 'Travel Planning',
      level: 'A2',
      duration: 8,
      messagesCount: 6,
      score: 0,
      completed: false
    }
  ]);

  const { isDarkMode, toggleTheme, themeClasses } = useTheme();
  const { isMobile } = useResponsive();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

  const conversationTopics = [
    'Daily Conversation',
    'Restaurant & Food',
    'Travel & Transportation',
    'Shopping',
    'Work & Business',
    'Health & Medical',
    'Entertainment',
    'Education',
    'Technology',
    'Weather & Climate'
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Simulate adding user message
    const newMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: "Thank you for helping me practice my pronunciation!",
      timestamp: new Date(),
      feedback: {
        pronunciation: 78,
        fluency: 82,
        accuracy: 75
      }
    };
    setConversationHistory(prev => [...prev, newMessage]);
    setSessionProgress(prev => Math.min(prev + 10, 100));
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTopicChange = (topic: string) => {
    setCurrentTopic(topic);
    // Reset conversation for new topic
    setConversationHistory([
      {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Great! Let's practice ${topic.toLowerCase()}. I'll help you with vocabulary and pronunciation. Shall we begin?`,
        timestamp: new Date(),
        audioUrl: `/audio/${topic.toLowerCase().replace(' ', '-')}.mp3`
      }
    ]);
    setSessionProgress(0);
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} relative overflow-hidden transition-all duration-300`}>
      <AnimatedBackground isDarkMode={isDarkMode} />
      
      <div className="relative z-10 flex h-screen">
        
        
        <div className="flex-1 flex flex-col min-w-0">
          
          <div className="flex-1 flex flex-col lg:flex-row min-h-0">
            {/* Main Content */}
            <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
              {/* Voice Assistant Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                        <Headphones className="w-8 h-8 text-purple-600" />
                      </div>
                      Voice Assistant
                    </h1>
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Practice English conversation with AI-powered voice interaction
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                </div>

                {/* Session Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card className={`p-4 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Today's Sessions</p>
                        <p className="text-2xl font-bold text-blue-600">3</p>
                      </div>
                      <MessageCircle className="w-8 h-8 text-blue-600" />
                    </div>
                  </Card>
                  
                  <Card className={`p-4 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg. Score</p>
                        <p className="text-2xl font-bold text-green-600">82%</p>
                      </div>
                      <Trophy className="w-8 h-8 text-green-600" />
                    </div>
                  </Card>
                  
                  <Card className={`p-4 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Time</p>
                        <p className="text-2xl font-bold text-purple-600">2.5h</p>
                      </div>
                      <Clock className="w-8 h-8 text-purple-600" />
                    </div>
                  </Card>
                  
                  <Card className={`p-4 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Level</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                            {selectedLevel}
                          </Badge>
                        </div>
                      </div>
                      <Target className="w-8 h-8 text-orange-600" />
                    </div>
                  </Card>
                </div>
              </div>

              {/* Voice Conversation Interface */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Conversation Panel */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Current Conversation</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{currentTopic}</Badge>
                        <Button variant="ghost" size="sm" onClick={() => setConversationHistory([])}>
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Session Progress */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Session Progress
                        </span>
                        <span className="text-sm font-medium">{sessionProgress}%</span>
                      </div>
                      <Progress value={sessionProgress} className="h-2" />
                    </div>

                    {/* Conversation History */}
                    <div className={`max-h-96 overflow-y-auto space-y-4 mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-900/30' : 'bg-gray-50'}`}>
                      {conversationHistory.map((message) => (
                        <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                            message.type === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900 shadow-sm'
                          }`}>
                            <p className="mb-2">{message.content}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                              {message.audioUrl && (
                                <Button variant="ghost" size="sm" className="p-1 h-auto">
                                  <Volume2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                            {message.feedback && (
                              <div className="mt-2 pt-2 border-t border-opacity-20 border-white">
                                <div className="flex justify-between text-xs">
                                  <span>Pronunciation: {message.feedback.pronunciation}%</span>
                                  <span>Fluency: {message.feedback.fluency}%</span>
                                  <span>Accuracy: {message.feedback.accuracy}%</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Voice Controls */}
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsMuted(!isMuted)}
                        className={isMuted ? 'text-red-600' : ''}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      
                      <Button
                        size="lg"
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        className={`w-16 h-16 rounded-full ${
                          isRecording 
                            ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePlayPause}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    {isRecording && (
                      <div className="mt-4 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800">
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                          Recording...
                        </div>
                      </div>
                    )}
                  </Card>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                  {/* Topic Selection */}
                  <Card className={`p-4 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h3 className="font-semibold mb-3">Conversation Topics</h3>
                    <div className="space-y-2">
                      {conversationTopics.slice(0, 5).map((topic) => (
                        <Button
                          key={topic}
                          variant={currentTopic === topic ? "default" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleTopicChange(topic)}
                        >
                          {topic}
                        </Button>
                      ))}
                    </div>
                  </Card>

                  {/* Recent Sessions */}
                  <Card className={`p-4 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h3 className="font-semibold mb-3">Recent Sessions</h3>
                    <div className="space-y-3">
                      {recentSessions.map((session) => (
                        <div key={session.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{session.topic}</span>
                            {session.completed && <CheckCircle className="w-4 h-4 text-green-600" />}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{session.level} • {session.duration}min</span>
                            {session.completed && <span className="text-green-600">{session.score}%</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Voice Components */}
                  <VoiceSettings 
                    isDarkMode={isDarkMode}
                    themeClasses={themeClasses}
                  />
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            
          </div>

          {/* Status Bar */}
          
        </div>
      </div>
    </div>
  );
}
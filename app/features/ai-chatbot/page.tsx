'use client'

import React, { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react'
import {
  Send,
  Bot,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Settings,
  History,
  Sparkles,
  BookOpen,
  MessageCircle,
  Headphones,
} from 'lucide-react'
import { useAIChat } from '@/hooks/useAIChats'
import { useAuth } from '@clerk/nextjs'
import { ChatMode, QuickPrompt } from '@/types/ai-chat'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AIChatbotPageProps {
  initialMode?: ChatMode
}

const AIChatbotPage: React.FC<AIChatbotPageProps> = ({ initialMode = 'conversation' }) => {
  const { user } = useAuth()
  const {
    messages,
    isLoading,
    currentMode,
    sendMessage,
    clearChat,
    regenerateLastResponse,
    setMode,
  } = useAIChat()

  const [inputMessage, setInputMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showQuickPrompts, setShowQuickPrompts] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const chatModes: { id: ChatMode; label: string; icon: React.ReactNode; description: string }[] = [
    {
      id: 'conversation',
      label: 'Conversation',
      icon: <MessageCircle className="w-4 h-4" />,
      description: 'Practice natural conversations',
    },
    {
      id: 'grammar',
      label: 'Grammar',
      icon: <BookOpen className="w-4 h-4" />,
      description: 'Get grammar help and corrections',
    },
    {
      id: 'pronunciation',
      label: 'Pronunciation',
      icon: <Headphones className="w-4 h-4" />,
      description: 'Improve your pronunciation',
    },
    {
      id: 'vocabulary',
      label: 'Vocabulary',
      icon: <Sparkles className="w-4 h-4" />,
      description: 'Learn new words and meanings',
    },
    {
      id: 'writing',
      label: 'Writing',
      icon: <BookOpen className="w-4 h-4" />,
      description: 'Improve your writing skills',
    },
    {
      id: 'business',
      label: 'Business',
      icon: <MessageCircle className="w-4 h-4" />,
      description: 'Practice business English',
    },
  ]

  const quickPrompts: QuickPrompt[] = [
    {
      id: '1',
      text: 'Help me practice ordering food at a restaurant',
      mode: 'conversation',
      category: 'Daily Life',
      level: 'beginner',
      tags: ['restaurant', 'food', 'ordering'],
    },
    {
      id: '2',
      text: "Explain the difference between 'have been' and 'had been'",
      mode: 'grammar',
      category: 'Grammar',
      level: 'intermediate',
      tags: ['tenses', 'perfect', 'grammar'],
    },
    {
      id: '3',
      text: 'Help me pronounce difficult English sounds',
      mode: 'pronunciation',
      category: 'Pronunciation',
      level: 'intermediate',
      tags: ['sounds', 'phonics', 'pronunciation'],
    },
    {
      id: '4',
      text: 'What are some advanced business vocabulary words?',
      mode: 'vocabulary',
      category: 'Business',
      level: 'advanced',
      tags: ['business', 'vocabulary', 'professional'],
    },
    {
      id: '5',
      text: 'Help me write a professional email',
      mode: 'writing',
      category: 'Writing',
      level: 'intermediate',
      tags: ['email', 'professional', 'writing'],
    },
    {
      id: '6',
      text: 'Practice job interview conversations',
      mode: 'business',
      category: 'Professional',
      level: 'advanced',
      tags: ['interview', 'job', 'professional'],
    },
  ]

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode, setMode])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        id: 'welcome',
        type: 'bot' as const,
        content: `Hello ${user?.email?.split('@')[0] || 'there'}! I'm your AI English learning assistant. I can help you practice conversations, explain grammar, check pronunciation, and answer any questions about English. What would you like to work on today?`,
        timestamp: new Date(),
      }
      // Use state update to add welcome message if messages empty
      // but avoid causing infinite re-render, only if no messages show welcome
      // so simulate adding it once at mount
      // Since `useAIChat` manages messages, this is tricky — You may consider modifying useAIChat to accept initialMessages or add a welcome message there.
      // For now, we're not adding it programmatically here.
      // You can consider calling addMessage from useAIChat or trigger from page load.
      //
      // For example (if you have addMessage in your hook exported):
      // addMessage({ type: 'bot', content: welcomeMessage.content })
      //
      // But as addMessage isn't exposed here, leaving as comment
    }
  }, [user, messages.length])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return

    await sendMessage(inputMessage.trim(), currentMode)
    setInputMessage('')
    setShowQuickPrompts(false)
  }, [inputMessage, isLoading, sendMessage, currentMode])

  const handleQuickPrompt = useCallback(
    (prompt: QuickPrompt) => {
      setMode(prompt.mode)
      setInputMessage(prompt.text)
      inputRef.current?.focus()
      setShowQuickPrompts(false)
    },
    [setMode]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage]
  )

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        // Replace with actual speech-to-text processing API call:
        // Fake transcription here:
        setInputMessage('I would like to practice my pronunciation')
        stream.getTracks().forEach((track) => track.stop())
        setIsRecording(false)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
      setIsRecording(false)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
  }, [isRecording])

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  const speakMessage = useCallback((content: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel() // Stop ongoing speech

      const utterance = new SpeechSynthesisUtterance(content)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.lang = 'en-US'

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      speechSynthesis.speak(utterance)
    }
  }, [])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could trigger toast notification here for success
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }, [])

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }, [])

  const filteredQuickPrompts = quickPrompts.filter(
    (prompt) => currentMode === 'conversation' || prompt.mode === currentMode
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">LEXIBOT</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Your personal AI tutor for English learning
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearChat} type="button">
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear Chat
              </Button>
              <Button variant="outline" size="sm" type="button">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button variant="outline" size="sm" type="button">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Chat Mode Tabs */}
          <Tabs value={currentMode} onValueChange={(value) => setMode(value as ChatMode)}>
            <TabsList className="grid grid-cols-6 w-full">
              {chatModes.map((mode) => (
                <TabsTrigger key={mode.id} value={mode.id} className="flex items-center gap-2">
                  {mode.icon}
                  <span className="hidden sm:inline">{mode.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Prompts Sidebar */}
          {showQuickPrompts && (
            <div className="lg:col-span-1">
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Quick Prompts
                </h3>
                <div className="space-y-2">
                  {filteredQuickPrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="w-full text-left p-3 text-sm bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
                      type="button"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {prompt.level}
                        </Badge>
                      </div>
                      {prompt.text}
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Chat Area */}
          <div className={showQuickPrompts ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <Card className="flex flex-col h-[600px]">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'bot' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                      <div
                        className={`p-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        {message.content}
                      </div>

                      <div
                        className={`flex items-center gap-2 mt-1 ${
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(message.timestamp)}
                        </span>

                        {message.type === 'bot' && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => speakMessage(message.content)}
                              disabled={isSpeaking}
                              type="button"
                            >
                              {isSpeaking ? (
                                <VolumeX className="w-3 h-3" />
                              ) : (
                                <Volume2 className="w-3 h-3" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(message.content)}
                              type="button"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" type="button">
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" type="button">
                              <ThumbsDown className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t dark:border-gray-700 p-4">
                <div className="flex gap-2">
                  <Button
                    variant={isRecording ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={toggleRecording}
                    type="button"
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>

                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        isRecording
                          ? 'Recording...'
                          : `Ask me anything about English (${currentMode} mode)...`
                      }
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isRecording || isLoading}
                      aria-label="Type your message"
                    />
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    type="button"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                  Press Enter to send • Click mic to record • AI responses are for learning purposes
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIChatbotPage

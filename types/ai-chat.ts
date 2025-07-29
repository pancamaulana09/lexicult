export interface ChatMessage {
  id: string
  type: 'user' | 'bot' | 'system'
  content: string
  timestamp: Date
  mode?: ChatMode
  metadata?: {
    tokens?: number
    confidence?: number
    language?: string
    corrections?: GrammarCorrection[]
    vocabulary?: VocabularyItem[]
    pronunciation?: PronunciationFeedback
  }
}

export type ChatMode = 
  | 'conversation'
  | 'grammar'
  | 'pronunciation' 
  | 'vocabulary'
  | 'writing'
  | 'business'
  | 'academic'

export interface ChatModeConfig {
  id: ChatMode
  label: string
  icon: string
  description: string
  systemPrompt: string
  features: string[]
}

export interface GrammarCorrection {
  original: string
  corrected: string
  explanation: string
  rule: string
  confidence: number
  position: {
    start: number
    end: number
  }
}

export interface VocabularyItem {
  word: string
  definition: string
  pronunciation: string
  examples: string[]
  level: 'beginner' | 'intermediate' | 'advanced'
  partOfSpeech: string
  synonyms?: string[]
  antonyms?: string[]
}

export interface PronunciationFeedback {
  word: string
  userPronunciation: string
  correctPronunciation: string
  accuracy: number
  feedback: string
  phonemes: {
    symbol: string
    correct: boolean
    feedback?: string
  }[]
}

export interface AIResponse {
  content: string
  mode: ChatMode
  confidence: number
  suggestions?: string[]
  corrections?: GrammarCorrection[]
  vocabulary?: VocabularyItem[]
  pronunciation?: PronunciationFeedback
  followUpQuestions?: string[]
  metadata?: {
    processingTime: number
    tokens: number
    model: string
  }
}

export interface ChatSession {
  id: string
  userId: string
  title: string
  mode: ChatMode
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  metadata?: {
    totalMessages: number
    totalTokens: number
    averageResponseTime: number
    satisfactionRating?: number
  }
}

export interface QuickPrompt {
  id: string
  text: string
  mode: ChatMode
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
}

export interface ChatSettings {
  language: string
  voiceEnabled: boolean
  voiceSpeed: number
  voicePitch: number
  autoPlayResponses: boolean
  showPronunciation: boolean
  showGrammarCorrections: boolean
  showVocabularyHelp: boolean
  theme: 'light' | 'dark' | 'auto'
  fontSize: 'small' | 'medium' | 'large'
}

export interface VoiceRecording {
  id: string
  blob: Blob
  duration: number
  transcript?: string
  confidence?: number
  createdAt: Date
}

export interface ChatAnalytics {
  sessionsCount: number
  messagesCount: number
  averageSessionDuration: number
  mostUsedMode: ChatMode
  improvementAreas: string[]
  vocabularyLearned: number
  grammarPointsPracticed: number
  pronunciationAccuracy: number
}
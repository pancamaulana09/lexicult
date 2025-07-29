-- AI Chat Feature Database Schema for Lexicult App

-- Chat sessions table
CREATE TABLE chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Chat',
    mode TEXT NOT NULL DEFAULT 'conversation' CHECK (mode IN ('conversation', 'grammar', 'pronunciation', 'vocabulary', 'writing', 'business', 'academic')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Chat messages table
CREATE TABLE chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('user', 'bot', 'system')),
    content TEXT NOT NULL,
    mode TEXT DEFAULT 'conversation',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat analytics table
CREATE TABLE chat_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    mode TEXT NOT NULL,
    message_count INTEGER DEFAULT 0,
    session_duration INTEGER DEFAULT 0, -- in seconds
    tokens_used INTEGER DEFAULT 0,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User chat preferences table
CREATE TABLE chat_preferences (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    language TEXT DEFAULT 'en',
    voice_enabled BOOLEAN DEFAULT true,
    voice_speed DECIMAL DEFAULT 0.8,
    voice_pitch DECIMAL DEFAULT 1.0,
    auto_play_responses BOOLEAN DEFAULT false,
    show_pronunciation BOOLEAN DEFAULT true,
    show_grammar_corrections BOOLEAN DEFAULT true,
    show_vocabulary_help BOOLEAN DEFAULT true,
    theme TEXT DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
    font_size TEXT DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quick prompts table
CREATE TABLE quick_prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    text TEXT NOT NULL,
    mode TEXT NOT NULL,
    category TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    tags TEXT[] DEFAULT '{}',
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voice recordings table (for pronunciation practice)
CREATE TABLE voice_recordings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in milliseconds
    transcript TEXT,
    confidence DECIMAL,
    pronunciation_score DECIMAL,
    feedback JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat feedback table
CREATE TABLE chat_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    feedback_type TEXT NOT NULL CHECK (feedback_type IN ('like', 'dislike', 'report')),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grammar corrections tracking
CREATE TABLE grammar_corrections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    corrected_text TEXT NOT NULL,
    explanation TEXT NOT NULL,
    rule_type TEXT NOT NULL,
    confidence DECIMAL DEFAULT 0.0,
    user_accepted BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vocabulary learning tracking
CREATE TABLE vocabulary_learning (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    definition TEXT NOT NULL,
    pronunciation TEXT,
    part_of_speech TEXT,
    level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    examples TEXT[] DEFAULT '{}',
    synonyms TEXT[] DEFAULT '{}',
    learned_from_session UUID REFERENCES chat_sessions(id),
    mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 5),
    times_encountered INTEGER DEFAULT 1,
    last_reviewed TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User learning progress
CREATE TABLE user_learning_progress (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    total_conversations INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    grammar_points_learned INTEGER DEFAULT 0,
    vocabulary_words_learned INTEGER DEFAULT 0,
    pronunciation_exercises INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    achievements JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_
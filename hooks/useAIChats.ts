import { useState, useCallback, useRef, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  mode?: string;
  isLoading?: boolean;
}

export interface AIResponse {
  content: string;
  suggestions?: string[];
  corrections?: {
    original: string;
    corrected: string;
    explanation: string;
  }[];
  vocabulary?: {
    word: string;
    definition: string;
    examples: string[];
  }[];
}

export const useAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState('conversation');

  // Ref for latest messages to avoid stale closures in async functions
  const messagesRef = useRef<ChatMessage[]>(messages);

  // Keep AbortController ref to abort ongoing fetch on new request/unmount
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync messagesRef with messages state after every change
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Cleanup abort controller on component unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Add a new chat message to state (user or bot)
  const addMessage = useCallback(
    (message: Omit<ChatMessage, 'id' | 'timestamp'>): string => {
      const newMessage: ChatMessage = {
        ...message,
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
      return newMessage.id;
    },
    []
  );

  // Send a message to AI backend and handle response
  const sendMessage = useCallback(
    async (content: string, mode: string = currentMode): Promise<void> => {
      if (!content.trim()) return;

      // Add user message immediately
      addMessage({
        type: 'user',
        content: content.trim(),
        mode,
      });

      setIsLoading(true);

      try {
        // Abort previous fetch if still running
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        // Send last 10 messages as conversation history to backend
        const historyToSend = messagesRef.current.slice(-10);

        const response = await fetch(
          'https://chatbot-personalweb.onrender.com/webhook/22f29a1d-3096-4026-8e1a-9497fce562c5/chat',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: content,
              mode,
              history: historyToSend,
            }),
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed API Response:', response.status, errorText);
          throw new Error(`API error: ${response.status}`);
        }

        const data: AIResponse = await response.json();

        addMessage({
          type: 'bot',
          content: data.content || 'No response.',
          mode,
        });
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return; // Silently ignore aborted requests

        console.error('Error sending message:', error);

        addMessage({
          type: 'bot',
          content: 'Sorry, I encountered an error. Please try again.',
          mode,
        });
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [addMessage, currentMode]
  );

  // Clear all chat messages
  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  // Delete a specific message by ID
  const deleteMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  // Find the last user message in the current conversation
  const findLastUserMessage = () => {
    const msgs = messagesRef.current;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].type === 'user') return msgs[i];
    }
    return null;
  };

  // Regenerate AI response for the last user message
  const regenerateLastResponse = useCallback(async () => {
    const lastUserMessage = findLastUserMessage();
    if (!lastUserMessage) return;

    setMessages(prev => {
      // Find indices for last user and last bot messages
      let lastBotIndex = -1;
      let lastUserIndex = -1;
      for (let i = prev.length - 1; i >= 0; i--) {
        if (lastBotIndex === -1 && prev[i].type === 'bot') {
          lastBotIndex = i;
        }
        if (lastUserIndex === -1 && prev[i].type === 'user') {
          lastUserIndex = i;
        }
        if (lastBotIndex !== -1 && lastUserIndex !== -1) break;
      }

      // Remove last bot message that followed the last user message
      if (lastBotIndex > -1 && lastBotIndex > lastUserIndex) {
        return prev.slice(0, lastBotIndex);
      }
      return prev;
    });

    await sendMessage(lastUserMessage.content, lastUserMessage.mode || currentMode);
  }, [sendMessage, currentMode]);

  // Set current chat mode (e.g., conversation, grammar, vocabulary)
  const setMode = useCallback((mode: string) => {
    setCurrentMode(mode);
  }, []);

  return {
    messages,
    isLoading,
    currentMode,
    sendMessage,
    addMessage,
    clearChat,
    deleteMessage,
    regenerateLastResponse,
    setMode,
  };
};

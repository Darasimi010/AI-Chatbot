'use client';

import { useCallback } from 'react';
import { Conversation, Message, ConversationsState } from '../types';
import { useLocalStorage } from './useLocalStorage';

const generateId = () => Math.random().toString(36).substring(2, 15);

const defaultConversation: Conversation = {
  id: 'default',
  title: 'Welcome Chat',
  messages: [
    {
      id: '1',
      role: 'user',
      content: 'Hello! What can you help me with?',
      timestamp: Date.now() - 60000,
    },
    {
      id: '2',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can help you with a variety of tasks including:\n\n• Answering questions on various topics\n• Helping with writing and editing\n• Explaining complex concepts\n• Brainstorming ideas\n• And much more!\n\nFeel free to ask me anything!',
      timestamp: Date.now() - 30000,
    },
  ],
  createdAt: Date.now() - 60000,
  updatedAt: Date.now() - 30000,
};

export function useConversations() {
  const [conversations, setConversations] = useLocalStorage<ConversationsState>(
    'simplechat-conversations',
    [defaultConversation]
  );

  const createConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations((prev) => [newConversation, ...prev]);
    return newConversation.id;
  }, [setConversations]);

  const updateConversationTitle = useCallback((id: string, title: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === id
          ? { ...conv, title, updatedAt: Date.now() }
          : conv
      )
    );
  }, [setConversations]);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
  }, [setConversations]);

  const addMessage = useCallback((conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: generateId(),
      timestamp: Date.now(),
    };
    
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== conversationId) return conv;
        
        const isFirstUserMessage = conv.messages.length === 0 && message.role === 'user';
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          title: isFirstUserMessage ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '') : conv.title,
          updatedAt: Date.now(),
        };
      })
    );
    
    return newMessage;
  }, [setConversations]);

  const getConversation = useCallback((id: string) => {
    return conversations.find((conv) => conv.id === id);
  }, [conversations]);

  return {
    conversations,
    createConversation,
    updateConversationTitle,
    deleteConversation,
    addMessage,
    getConversation,
  };
}

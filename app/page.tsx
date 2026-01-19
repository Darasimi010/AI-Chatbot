'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import { useConversations } from './hooks/useConversations';

export default function Home() {
  const {
    conversations,
    createConversation,
    updateConversationTitle,
    deleteConversation,
    addMessage,
    getConversation,
  } = useConversations();

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted state and initial conversation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Set active conversation when conversations load
  useEffect(() => {
    if (mounted && conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [mounted, conversations, activeConversationId]);

  const activeConversation = activeConversationId ? getConversation(activeConversationId) : null;

  const handleNewConversation = () => {
    const newId = createConversation();
    setActiveConversationId(newId);
    setSidebarOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
    if (activeConversationId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) return;

    // Add user message
    addMessage(activeConversationId, { role: 'user', content });
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();

      if (response.ok) {
        addMessage(activeConversationId, { 
          role: 'assistant', 
          content: data.response 
        });
      } else {
        addMessage(activeConversationId, { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage(activeConversationId, { 
        role: 'assistant', 
        content: 'Sorry, I couldn\'t connect to the server. Please check your connection and try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="h-screen bg-gray-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-3 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-950 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => {
          setActiveConversationId(id);
          setSidebarOpen(false);
        }}
        onNewConversation={handleNewConversation}
        onEditTitle={updateConversationTitle}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center gap-4 px-4 h-16 border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-white truncate">
              {activeConversation?.title || 'SimpleChat'}
            </h1>
            {activeConversation && (
              <p className="text-xs text-gray-500">
                {activeConversation.messages.length} messages
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-gray-400 hidden sm:block">Online</span>
          </div>
        </header>

        {/* Chat messages */}
        <ChatArea conversation={activeConversation ?? null} isLoading={isLoading} />

        {/* Input */}
        {activeConversation && (
          <ChatInput 
            onSendMessage={handleSendMessage} 
            disabled={isLoading} 
          />
        )}
      </main>
    </div>
  );
}

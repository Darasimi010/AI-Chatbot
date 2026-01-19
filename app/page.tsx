'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [isPro] = useState(false); // Demo: change to true to show Pro badge

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

  // Keyboard shortcut: Ctrl+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeConversation = activeConversationId ? getConversation(activeConversationId) : null;

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleNewConversation = () => {
    const newId = createConversation();
    setActiveConversationId(newId);
    // Close sidebar on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
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
      <div className="h-screen bg-[#0f0f1a] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0f0f1a] flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => {
          setActiveConversationId(id);
          if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setSidebarOpen(false);
          }
        }}
        onNewConversation={handleNewConversation}
        onEditTitle={updateConversationTitle}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Account indicator - top right */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 z-30 flex items-center gap-3"
        >
          {/* Plan badge */}
          <div className={`
            px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5
            ${isPro 
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
              : 'bg-[#252542] text-gray-400 border border-gray-700/50'
            }
          `}>
            {isPro ? (
              <>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                Pro
              </>
            ) : (
              'Free'
            )}
          </div>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 
                          flex items-center justify-center text-white text-sm font-medium cursor-pointer
                          hover:ring-2 hover:ring-purple-400/50 transition-all">
            U
          </div>
        </motion.div>

        {/* Floating sidebar toggle when closed */}
        {!sidebarOpen && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleToggleSidebar}
            className="absolute top-4 left-4 z-30 p-2 rounded-lg bg-[#1a1a2e] hover:bg-[#252542] 
                       text-gray-400 hover:text-white transition-colors"
            title="Open sidebar (Ctrl+B)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        )}

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

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Conversation } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onEditTitle: (id: string, title: string) => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onEditTitle,
  onDeleteConversation,
  isOpen,
  onToggle,
  onClose,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditValue(conv.title);
  };

  const handleSaveEdit = () => {
    if (editingId && editValue.trim()) {
      onEditTitle(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditValue('');
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-64 bg-[#1a1a2e] flex flex-col
          lg:translate-x-0
        `}
      >
        {/* Header with branding and toggle */}
        <div className="p-4 flex items-center gap-3 border-b border-gray-700/30">
          {/* Toggle button */}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-[#252542] text-gray-400 hover:text-white transition-colors"
            title="Toggle sidebar (Ctrl+B)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo and branding */}
          <div className="flex items-center gap-2 flex-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              </svg>
            </div>
            <span className="font-semibold text-white text-sm">simplechat<span className="text-cyan-400">.ai</span></span>
          </div>
        </div>

        {/* New Chat button */}
        <div className="p-3">
          <button
            onClick={onNewConversation}
            className="w-full py-2.5 px-4 rounded-lg bg-[#252542] hover:bg-[#2d2d4a]
                       text-white font-medium flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Conversations label */}
        <div className="px-4 py-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Conversations</span>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {conversations.map((conv) => (
              <motion.div
                key={conv.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className={`
                  group relative rounded-lg cursor-pointer transition-all duration-200
                  ${activeConversationId === conv.id 
                    ? 'bg-[#252542]' 
                    : 'hover:bg-[#252542]/50'
                  }
                `}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className="p-3 pr-20 flex items-center gap-3">
                  <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  
                  {editingId === conv.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleKeyDown}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      className="flex-1 bg-[#1a1a2e] text-white text-sm rounded px-2 py-1 
                                 outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-300 truncate">
                      {conv.title}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                {editingId !== conv.id && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 
                                  opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(conv);
                      }}
                      className="p-1.5 rounded hover:bg-[#1a1a2e] text-gray-400 hover:text-white"
                      title="Edit title"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      className="p-1.5 rounded hover:bg-red-900/30 text-gray-400 hover:text-red-400"
                      title="Delete conversation"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
}

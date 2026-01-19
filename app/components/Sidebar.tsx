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
          w-72 bg-gradient-to-b from-gray-900 to-gray-950
          border-r border-gray-800/50 flex flex-col
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800/50">
          <button
            onClick={onNewConversation}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 
                       hover:from-violet-500 hover:to-indigo-500 text-white font-medium
                       flex items-center justify-center gap-2 transition-all duration-200
                       shadow-lg shadow-violet-900/30 hover:shadow-violet-800/40"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1 custom-scrollbar">
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
                    ? 'bg-gray-800/80 shadow-md' 
                    : 'hover:bg-gray-800/40'
                  }
                `}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className="p-3 pr-16">
                  {editingId === conv.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleKeyDown}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      className="w-full bg-gray-700 text-white text-sm rounded px-2 py-1 
                                 outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  ) : (
                    <>
                      <p className="text-sm text-gray-200 truncate font-medium">
                        {conv.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {conv.messages.length} messages
                      </p>
                    </>
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
                      className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                      title="Edit title"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      className="p-1.5 rounded hover:bg-red-900/50 text-gray-400 hover:text-red-400"
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

        {/* Footer */}
        <div className="p-4 border-t border-gray-800/50">
          <p className="text-xs text-gray-500 text-center">
            SimpleChat AI Assistant
          </p>
        </div>
      </motion.aside>
    </>
  );
}

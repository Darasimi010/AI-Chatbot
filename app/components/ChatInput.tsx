'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0f0f1a] px-4 py-4"
    >
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative flex items-center bg-[#1a1a2e] rounded-xl border border-gray-700/50 
                        focus-within:border-cyan-500/50 transition-colors">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask simplechat.ai anything"
            disabled={disabled}
            className="flex-1 bg-transparent text-white placeholder-gray-500 
                       outline-none px-4 py-3.5 text-sm
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <motion.button
            type="submit"
            disabled={!message.trim() || disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 w-10 h-10 mr-1.5 rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-600 
                       flex items-center justify-center text-white
                       disabled:opacity-30 disabled:cursor-not-allowed
                       hover:from-fuchsia-500 hover:to-purple-500 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

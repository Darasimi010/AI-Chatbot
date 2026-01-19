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

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-gray-800/50 bg-gray-900/50 backdrop-blur-xl px-4 py-4"
    >
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-3 bg-gray-800/50 rounded-2xl border border-gray-700/50 
                        focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20 
                        transition-all duration-200 p-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent text-white placeholder-gray-500 resize-none 
                       outline-none px-3 py-2 min-h-[44px] max-h-32 text-sm
                       disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              height: 'auto',
              overflow: message.split('\n').length > 3 ? 'auto' : 'hidden'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 128) + 'px';
            }}
          />
          <motion.button
            type="submit"
            disabled={!message.trim() || disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 
                       flex items-center justify-center text-white
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-600
                       hover:from-violet-500 hover:to-indigo-500 transition-all duration-200
                       shadow-lg shadow-violet-900/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </motion.button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </form>
    </motion.div>
  );
}

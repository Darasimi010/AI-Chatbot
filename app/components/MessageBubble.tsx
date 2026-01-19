'use client';

import { motion } from 'framer-motion';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export default function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: [0.23, 1, 0.32, 1]
      }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`
          max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3
          ${isUser 
            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-md' 
            : 'bg-gray-800/80 text-gray-100 rounded-bl-md border border-gray-700/50'
          }
        `}
      >
        {/* Avatar and role indicator */}
        <div className={`flex items-center gap-2 mb-1 ${isUser ? 'justify-end' : ''}`}>
          <div className={`
            w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
            ${isUser 
              ? 'bg-white/20 text-white order-2' 
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
            }
          `}>
            {isUser ? 'U' : 'AI'}
          </div>
          <span className={`text-xs ${isUser ? 'text-violet-200 order-1' : 'text-gray-400'}`}>
            {isUser ? 'You' : 'Assistant'}
          </span>
        </div>

        {/* Message content */}
        <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isUser ? 'text-white' : 'text-gray-200'}`}>
          {message.content}
        </div>

        {/* Timestamp */}
        <div className={`text-xs mt-2 ${isUser ? 'text-violet-200/60' : 'text-gray-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </motion.div>
  );
}

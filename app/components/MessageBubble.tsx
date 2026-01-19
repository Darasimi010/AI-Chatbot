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
      <div className={`flex items-start gap-3 max-w-[85%] md:max-w-[75%]`}>
        {/* AI Avatar */}
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 
                          flex items-center justify-center mt-1">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`
            rounded-2xl px-4 py-3
            ${isUser 
              ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white' 
              : 'bg-[#252542] text-gray-200'
            }
          `}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

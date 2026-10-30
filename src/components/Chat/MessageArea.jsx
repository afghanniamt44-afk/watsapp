import React, { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { Lock } from 'lucide-react';

export function MessageArea({
  activeChat,
  onReact,
  onDeleteMessage,
  onReply
}) {
  const messagesEndRef = useRef(null);

  // Auto scroll down smoothly on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat.messages, activeChat.id]);

  return (
    <div className="flex-1 overflow-y-auto wa-chat-bg-light dark:wa-chat-bg-dark wa-doodle-pattern p-2 sm:p-4 select-none relative flex flex-col transition-colors">
      {/* End-to-End Encryption Security Card */}
      <div className="flex justify-center my-3">
        <div className="max-w-[480px] bg-[#ffeecd] dark:bg-[#182229] border border-[#f3d999]/50 dark:border-white/5 rounded-lg px-3 py-1.5 text-center shadow-sm">
          <p className="text-[12.5px] text-[#54656f] dark:text-[#ffd279] flex items-center justify-center gap-1.5 leading-relaxed font-normal">
            <Lock className="w-3.5 h-3.5 flex-shrink-0 text-[#8696a0] dark:text-[#ffd279]" />
            <span>
              Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
            </span>
          </p>
        </div>
      </div>

      {/* Date Pill: Today */}
      <div className="flex justify-center my-2">
        <span className="bg-white/90 dark:bg-[#182229]/90 text-[#54656f] dark:text-[#8696a0] text-[12px] font-medium px-3 py-1 rounded-lg shadow-sm border border-black/5 dark:border-white/5 uppercase tracking-wide">
          Today
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 flex flex-col justify-end space-y-0.5">
        {activeChat.messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isGroup={activeChat.isGroup}
            onReact={onReact}
            onDeleteMessage={onDeleteMessage}
            onReply={onReply}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

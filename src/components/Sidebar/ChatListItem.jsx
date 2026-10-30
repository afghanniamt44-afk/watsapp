import React, { useState } from 'react';
import { Check, CheckCheck, Pin, Volume2, ChevronDown, Image, Mic } from 'lucide-react';

export function ChatListItem({ 
  chat, 
  isSelected, 
  onSelectChat, 
  isTyping,
  onPinToggle,
  onDeleteChat
}) {
  const [showMenu, setShowMenu] = useState(false);
  const lastMessage = chat.messages[chat.messages.length - 1];
  const isMe = lastMessage && lastMessage.senderId === 'me';

  const renderStatusTick = (status) => {
    if (status === 'read') {
      return <CheckCheck className="w-4 h-4 text-[#53bdeb] inline-block mr-1 flex-shrink-0" />;
    }
    if (status === 'delivered') {
      return <CheckCheck className="w-4 h-4 text-[#8696a0] inline-block mr-1 flex-shrink-0" />;
    }
    return <Check className="w-4 h-4 text-[#8696a0] inline-block mr-1 flex-shrink-0" />;
  };

  const renderSnippet = () => {
    if (isTyping) {
      return (
        <span className="text-[#00a884] font-medium text-[13.5px] animate-pulse">
          typing...
        </span>
      );
    }

    if (!lastMessage) {
      return <span className="italic text-gray-400">No messages yet</span>;
    }

    if (lastMessage.type === 'image') {
      return (
        <span className="flex items-center gap-1 text-[13.5px] text-[#667781] dark:text-[#8696a0]">
          {isMe && renderStatusTick(lastMessage.status)}
          <Image className="w-3.5 h-3.5" />
          <span>Photo {lastMessage.caption ? `• ${lastMessage.caption}` : ''}</span>
        </span>
      );
    }

    if (lastMessage.type === 'voice') {
      return (
        <span className="flex items-center gap-1 text-[13.5px] text-[#667781] dark:text-[#8696a0]">
          {isMe && renderStatusTick(lastMessage.status)}
          <Mic className="w-3.5 h-3.5 text-[#00a884]" />
          <span>Voice message ({lastMessage.duration || '0:15'})</span>
        </span>
      );
    }

    return (
      <span className="truncate text-[13.5px] text-[#667781] dark:text-[#8696a0] flex items-center">
        {isMe && renderStatusTick(lastMessage.status)}
        {chat.isGroup && lastMessage.senderName && !isMe && (
          <span className="font-medium mr-1 text-[#111b21] dark:text-[#d1d7db]">
            {lastMessage.senderName.split(' ')[0]}:
          </span>
        )}
        <span className="truncate">{lastMessage.text}</span>
      </span>
    );
  };

  return (
    <div
      onClick={() => onSelectChat(chat)}
      className={`relative group flex items-center gap-3 px-3.5 py-3 cursor-pointer transition-colors border-b border-[#f0f2f5] dark:border-[#202c33]/40 ${
        isSelected
          ? 'bg-[#f0f2f5] dark:bg-[#2a3942]'
          : 'hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]'
      }`}
    >
      {/* Contact Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={chat.avatar}
          alt={chat.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {chat.status === 'online' && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00a884] rounded-full ring-2 ring-white dark:ring-[#111b21]" />
        )}
      </div>

      {/* Center Details */}
      <div className="flex-1 min-w-0">
        {/* Top Line: Contact Name & Timestamp */}
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="font-normal text-[16px] text-[#111b21] dark:text-[#e9edef] truncate">
            {chat.name}
          </h3>
          <span
            className={`text-[12px] flex-shrink-0 ml-2 ${
              chat.unreadCount > 0
                ? 'text-[#00a884] font-medium'
                : 'text-[#667781] dark:text-[#8696a0]'
            }`}
          >
            {chat.messages.length > 0
              ? chat.messages[chat.messages.length - 1].timestamp
              : ''}
          </span>
        </div>

        {/* Bottom Line: Snippet, Badges, and Pin */}
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-2">
            {renderSnippet()}
          </div>

          {/* Right Icons: Unread Pill, Pin, Hover menu */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {chat.pinned && (
              <Pin className="w-3.5 h-3.5 text-[#8696a0] transform rotate-45" />
            )}

            {chat.unreadCount > 0 && (
              <span className="min-w-[20px] h-[20px] px-1.5 bg-[#00a884] text-white text-[11.5px] font-semibold rounded-full flex items-center justify-center">
                {chat.unreadCount}
              </span>
            )}

            {/* Hover Chevron for Context Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#8696a0] hover:text-[#111b21] dark:hover:text-white"
                title="Chat options"
              >
                <ChevronDown className="w-4 h-4" />
              </button>

              {showMenu && (
                <div 
                  className="absolute right-0 top-6 w-40 bg-white dark:bg-[#233138] rounded shadow-xl py-1.5 z-40 border border-black/5 dark:border-white/5 animate-message"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      onPinToggle(chat.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-[#3b4a54] dark:text-[#d1d7db] hover:bg-[#f5f6f6] dark:hover:bg-[#182229]"
                  >
                    {chat.pinned ? 'Unpin chat' : 'Pin chat'}
                  </button>
                  <button
                    onClick={() => {
                      alert(`Notifications muted for ${chat.name}`);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-[#3b4a54] dark:text-[#d1d7db] hover:bg-[#f5f6f6] dark:hover:bg-[#182229]"
                  >
                    Mute notifications
                  </button>
                  <button
                    onClick={() => {
                      onDeleteChat(chat.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-red-500 hover:bg-[#f5f6f6] dark:hover:bg-[#182229]"
                  >
                    Delete chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

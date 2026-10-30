import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  ArrowLeft, 
  Trash2, 
  Eraser, 
  Info, 
  BellOff, 
  XSquare 
} from 'lucide-react';

export function ChatHeader({
  activeChat,
  isTyping,
  onBack,
  onOpenContactInfo,
  onStartCall,
  onClearChat,
  onDeleteChat,
  onCloseChat
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSubtitle = () => {
    if (isTyping) {
      return (
        <span className="text-[#00a884] font-medium text-xs sm:text-[13px] animate-pulse">
          typing...
        </span>
      );
    }
    if (activeChat.isGroup) {
      return (
        <span className="truncate text-xs sm:text-[13px] text-[#667781] dark:text-[#8696a0]">
          {activeChat.members || 'Group members'}
        </span>
      );
    }
    if (activeChat.status === 'online') {
      return (
        <span className="text-[#00a884] text-xs sm:text-[13px] font-medium">
          online
        </span>
      );
    }
    return (
      <span className="text-xs sm:text-[13px] text-[#667781] dark:text-[#8696a0]">
        {activeChat.lastSeen || 'offline'}
      </span>
    );
  };

  return (
    <div className="h-[60px] bg-[#f0f2f5] dark:bg-[#202c33] px-3 sm:px-4 flex items-center justify-between border-b border-[#e9edef] dark:border-[#222e35] select-none z-20 flex-shrink-0">
      {/* Left: Back button (mobile) + Contact Avatar & Details */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {/* Mobile back button */}
        <button
          onClick={onBack}
          className="md:hidden p-1.5 -ml-1 text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
          title="Back to chats"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Avatar & Click to view contact info */}
        <div 
          onClick={onOpenContactInfo}
          className="flex items-center gap-3 cursor-pointer group min-w-0"
        >
          <div className="relative flex-shrink-0">
            <img
              src={activeChat.avatar}
              alt={activeChat.name}
              className="w-10 h-10 rounded-full object-cover group-hover:opacity-90 transition-opacity"
            />
            {activeChat.status === 'online' && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00a884] rounded-full ring-2 ring-white dark:ring-[#202c33]" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-[16px] font-medium text-[#111b21] dark:text-[#e9edef] truncate group-hover:text-[#00a884] transition-colors">
              {activeChat.name}
            </h2>
            <div className="flex items-center truncate">
              {getSubtitle()}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2 text-[#54656f] dark:text-[#aebac1]">
        {/* Video Call */}
        <button
          onClick={() => onStartCall('video')}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          title="Video call"
        >
          <Video className="w-5 h-5" />
        </button>

        {/* Voice Call */}
        <button
          onClick={() => onStartCall('voice')}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          title="Voice call"
        >
          <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="h-5 w-[1px] bg-black/10 dark:bg-white/10 mx-0.5" />

        {/* Search inside chat */}
        <button
          onClick={() => alert("Search messages in this chat: Press Enter or type search query.")}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          title="Search in chat"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* 3-dots Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${
              menuOpen ? 'bg-black/10 dark:bg-white/10' : ''
            }`}
            title="Chat menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 w-48 bg-white dark:bg-[#233138] rounded-md shadow-xl py-2 z-50 border border-black/5 dark:border-white/5 animate-message">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenContactInfo();
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#3b4a54] dark:text-[#d1d7db] hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors flex items-center gap-2.5"
              >
                <Info className="w-4 h-4 text-[#8696a0]" />
                Contact info
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  alert(`Notifications muted for ${activeChat.name}`);
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#3b4a54] dark:text-[#d1d7db] hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors flex items-center gap-2.5"
              >
                <BellOff className="w-4 h-4 text-[#8696a0]" />
                Mute notifications
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onClearChat(activeChat.id);
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#3b4a54] dark:text-[#d1d7db] hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors flex items-center gap-2.5"
              >
                <Eraser className="w-4 h-4 text-[#8696a0]" />
                Clear messages
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onCloseChat();
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#3b4a54] dark:text-[#d1d7db] hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors flex items-center gap-2.5"
              >
                <XSquare className="w-4 h-4 text-[#8696a0]" />
                Close chat
              </button>
              <div className="h-[1px] bg-black/5 dark:bg-white/5 my-1" />
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDeleteChat(activeChat.id);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors flex items-center gap-2.5"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                Delete chat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

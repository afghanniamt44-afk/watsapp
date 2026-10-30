import React, { useState, useRef, useEffect } from 'react';
import { 
  CircleDashed, 
  MessageSquarePlus, 
  MoreVertical, 
  Users, 
  Moon, 
  Sun, 
  LogOut, 
  Settings, 
  Star, 
  CheckCheck,
  UserCheck
} from 'lucide-react';

export function SidebarHeader({ 
  currentUser, 
  onOpenProfile, 
  onOpenStatus, 
  onNewChat, 
  onLogout,
  darkMode,
  onToggleDarkMode,
  hasUnreadStories 
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

  return (
    <div className="h-[60px] bg-[#f0f2f5] dark:bg-[#202c33] px-4 flex items-center justify-between border-b border-[#e9edef] dark:border-[#222e35] select-none">
      {/* User Avatar with Profile Drawer Trigger */}
      <button 
        onClick={onOpenProfile}
        className="relative group rounded-full focus:outline-none"
        title="View profile & status"
      >
        <img 
          src={currentUser.avatar} 
          alt={currentUser.name} 
          className="w-10 h-10 rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10 group-hover:opacity-90 transition-opacity"
        />
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00a884] rounded-full ring-2 ring-white dark:ring-[#202c33]" />
      </button>

      {/* Header Actions */}
      <div className="flex items-center gap-1 sm:gap-2 text-[#54656f] dark:text-[#aebac1]">
        {/* Communities */}
        <button 
          onClick={() => alert("WhatsApp Communities: Connect your neighborhood, school, or team groups together.")}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          title="Communities"
        >
          <Users className="w-5 h-5" />
        </button>

        {/* Stories / Status */}
        <button 
          onClick={onOpenStatus}
          className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          title="Status / Stories"
        >
          <CircleDashed className="w-5 h-5" />
          {hasUnreadStories && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#00a884] rounded-full ring-2 ring-white dark:ring-[#202c33]" />
          )}
        </button>

        {/* New Chat */}
        <button 
          onClick={onNewChat}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          title="New chat"
        >
          <MessageSquarePlus className="w-5 h-5" />
        </button>

        {/* Dark/Light mode toggle quick button */}
        <button 
          onClick={onToggleDarkMode}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* 3-dots Menu */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${menuOpen ? 'bg-black/10 dark:bg-white/10' : ''}`}
            title="Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-11 w-52 bg-white dark:bg-[#233138] rounded-md shadow-xl py-2 z-50 border border-black/5 dark:border-white/5 animate-message">
              <button 
                onClick={() => { setMenuOpen(false); onNewChat(); }}
                className="w-full px-4 py-2.5 text-left text-[14.5px] text-[#3b4a54] dark:text-[#d1d7db] hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors flex items-center gap-3"
              >
                <MessageSquarePlus className="w-4 h-4 text-[#8696a0]" />
                New group
              </button>
              <button 
                onClick={() => { setMenuOpen(false); onOpenProfile(); }}
                className="w-full px-4 py-2.5 text-left text-[14.5px] text-[#3b4a54] dark:text-[#d1d7db] hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors flex items-center gap-3"
              >
                <UserCheck className="w-4 h-4 text-[#8696a0]" />
                Profile & Status
              </button>
              <button 
                onClick={() => { setMenuOpen(false); alert("Starred messages: No starred messages yet."); }}
                className="w-full px-4 py-2.5 text-left text-[14.5px] text-[#3b4a54] dark:text-[#d1d7db] hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors flex items-center gap-3"
              >
                <Star className="w-4 h-4 text-[#8696a0]" />
                Starred messages
              </button>
              <button 
                onClick={() => { setMenuOpen(false); onToggleDarkMode(); }}
                className="w-full px-4 py-2.5 text-left text-[14.5px] text-[#3b4a54] dark:text-[#d1d7db] hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors flex items-center gap-3"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#8696a0]" />}
                {darkMode ? 'Light mode' : 'Dark mode'}
              </button>
              <div className="h-[1px] bg-black/5 dark:bg-white/5 my-1" />
              <button 
                onClick={() => { setMenuOpen(false); onLogout(); }}
                className="w-full px-4 py-2.5 text-left text-[14.5px] text-[#ea4335] hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors flex items-center gap-3"
              >
                <LogOut className="w-4 h-4 text-[#ea4335]" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

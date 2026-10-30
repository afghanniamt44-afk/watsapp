import React, { useState, useMemo } from 'react';
import { SidebarHeader } from './SidebarHeader';
import { SearchBar } from './SearchBar';
import { ChatFilterTabs } from './ChatFilterTabs';
import { ChatListItem } from './ChatListItem';
import { Archive, Lock, MessageSquareDashed } from 'lucide-react';

export function Sidebar({
  currentUser,
  chats,
  selectedChatId,
  onSelectChat,
  onOpenProfile,
  onOpenStatus,
  onNewChat,
  onLogout,
  darkMode,
  onToggleDarkMode,
  hasUnreadStories,
  typingChatIds,
  onPinToggle,
  onDeleteChat
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Filter chats by tab, search query, and unread toggle
  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = chat.name.toLowerCase().includes(query);
        const matchesMessage = chat.messages.some((m) =>
          m.text?.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesMessage) return false;
      }

      // 2. Unread Filter
      if (filterUnreadOnly && chat.unreadCount === 0) {
        return false;
      }

      // 3. Tab Filter
      if (activeTab === 'unread') {
        return chat.unreadCount > 0;
      }
      if (activeTab === 'groups') {
        return chat.isGroup;
      }
      if (activeTab === 'favourites') {
        return chat.pinned;
      }

      return true;
    });
  }, [chats, searchQuery, filterUnreadOnly, activeTab]);

  return (
    <aside className="w-full md:w-[400px] lg:w-[440px] xl:w-[480px] h-full flex flex-col bg-white dark:bg-[#111b21] border-r border-[#e9edef] dark:border-[#222e35] select-none flex-shrink-0">
      {/* Top Header */}
      <SidebarHeader
        currentUser={currentUser}
        onOpenProfile={onOpenProfile}
        onOpenStatus={onOpenStatus}
        onNewChat={onNewChat}
        onLogout={onLogout}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        hasUnreadStories={hasUnreadStories}
      />

      {/* Search Input Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterUnreadOnly={filterUnreadOnly}
        onToggleUnreadFilter={() => setFilterUnreadOnly(!filterUnreadOnly)}
      />

      {/* Filter Tabs: All, Unread, Favourites, Groups */}
      <ChatFilterTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Archived Chats Row */}
      <div 
        onClick={() => alert("Archived chats (0)")}
        className="px-4 py-3 flex items-center gap-4 hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] cursor-pointer border-b border-[#f0f2f5] dark:border-[#202c33]/40 transition-colors"
      >
        <Archive className="w-5 h-5 text-[#00a884]" />
        <span className="text-[15px] font-medium text-[#111b21] dark:text-[#e9edef]">
          Archived
        </span>
      </div>

      {/* Scrollable Chat List */}
      <div className="flex-1 overflow-y-auto divide-y-0">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={chat.id === selectedChatId}
              onSelectChat={onSelectChat}
              isTyping={typingChatIds.includes(chat.id)}
              onPinToggle={onPinToggle}
              onDeleteChat={onDeleteChat}
            />
          ))
        ) : (
          <div className="h-64 flex flex-col items-center justify-center p-6 text-center text-[#667781] dark:text-[#8696a0]">
            <MessageSquareDashed className="w-10 h-10 mb-2 opacity-50 text-[#00a884]" />
            <p className="text-sm font-medium text-[#111b21] dark:text-[#e9edef]">
              No chats found
            </p>
            <p className="text-xs mt-1">
              {searchQuery ? `No results matching "${searchQuery}"` : 'No messages in this folder'}
            </p>
          </div>
        )}
      </div>

      {/* End-to-end encrypted lock footer note */}
      <div className="py-2.5 px-4 text-center border-t border-[#f0f2f5] dark:border-[#222e35] flex items-center justify-center gap-1.5 text-[11px] text-[#8696a0]">
        <Lock className="w-3 h-3 text-[#8696a0]" />
        <span>Your personal messages are end-to-end encrypted</span>
      </div>
    </aside>
  );
}

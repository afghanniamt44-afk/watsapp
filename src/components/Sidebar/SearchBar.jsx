import React from 'react';
import { Search, ArrowLeft, X, Filter } from 'lucide-react';

export function SearchBar({ 
  searchQuery, 
  onSearchChange, 
  filterUnreadOnly, 
  onToggleUnreadFilter 
}) {
  const isSearching = searchQuery.length > 0;

  return (
    <div className="px-3 py-2 bg-white dark:bg-[#111b21] flex items-center gap-2 border-b border-[#e9edef] dark:border-[#222e35]">
      {/* Input container */}
      <div className="flex-1 flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg px-3 py-1.5 transition-colors focus-within:bg-white dark:focus-within:bg-[#202c33] focus-within:ring-1 focus-within:ring-[#00a884]">
        {/* Search or Back Icon */}
        <div className="mr-3 text-[#54656f] dark:text-[#aebac1] flex items-center">
          {isSearching ? (
            <button 
              onClick={() => onSearchChange('')}
              className="text-[#00a884] hover:opacity-80 transition-opacity"
              title="Clear search"
            >
              <ArrowLeft className="w-4 h-4 animate-message" />
            </button>
          ) : (
            <Search className="w-4 h-4 text-[#54656f] dark:text-[#8696a0]" />
          )}
        </div>

        {/* Input Text Field */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search or start new chat"
          className="w-full bg-transparent text-[14.5px] text-[#111b21] dark:text-[#e9edef] placeholder-[#667781] dark:placeholder-[#8696a0] focus:outline-none"
        />

        {/* Clear 'X' button if text present */}
        {isSearching && (
          <button 
            onClick={() => onSearchChange('')}
            className="text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef] ml-1 p-0.5 rounded-full"
            title="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Button */}
      <button
        onClick={onToggleUnreadFilter}
        className={`p-1.5 rounded-md transition-colors ${
          filterUnreadOnly
            ? 'bg-[#00a884] text-white'
            : 'text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/10'
        }`}
        title="Filter unread chats"
      >
        <Filter className="w-4 h-4" />
      </button>
    </div>
  );
}

import React from 'react';

export function ChatFilterTabs({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'favourites', label: 'Favourites' },
    { id: 'groups', label: 'Groups' }
  ];

  return (
    <div className="px-3 py-1.5 bg-white dark:bg-[#111b21] flex items-center gap-1.5 border-b border-[#e9edef] dark:border-[#222e35] overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
              isActive
                ? 'bg-[#00a884] text-white'
                : 'bg-[#f0f2f5] dark:bg-[#202c33] text-[#54656f] dark:text-[#8696a0] hover:bg-[#e9edef] dark:hover:bg-[#2a3942]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

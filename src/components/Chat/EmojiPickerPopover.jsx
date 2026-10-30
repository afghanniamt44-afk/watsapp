import React, { useState } from 'react';
import { Search } from 'lucide-react';

const EMOJI_CATEGORIES = {
  smileys: {
    label: '😀',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '🥹', 
      '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', 
      '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🫢', '🤫',
      '🤔', '🫡', '🤐', '🤨', '😐', '😑', '😶', '🫥', '😏', '😒',
      '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒',
      '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠',
      '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯'
    ]
  },
  gestures: {
    label: '👍',
    emojis: [
      '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲',
      '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶',
      '👂', '🦻', '👃', '🫀', '🫁', '🧠', '🫀', '👀', '👁️', '👅',
      '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🫰'
    ]
  },
  hearts: {
    label: '❤️',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'
    ]
  },
  nature: {
    label: '🌿',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
      '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
      '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🪱', '🐛',
      '🦋', '🐌', '🐞', '🐜', '🪰', '🪲', '🪳', '🪴', '🌲', '🌳',
      '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🍄'
    ]
  },
  food: {
    label: '🍕',
    emojis: [
      '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐',
      '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🍔',
      '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🍜',
      '🍝', '🍣', '🍱', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰',
      '🧁', '🥧', '🍫', '🍬', '🍭', '☕', '🍵', '🧃', '🥤', '🍷'
    ]
  },
  objects: {
    label: '💡',
    emojis: [
      '💻', '📱', '⌚', '📷', '🎧', '🎮', '💡', '🔦', '🔋', '🔌',
      '📦', '📬', '🏷️', '💎', '🔑', '🚀', '✈️', '🚗', '🚲', '🛴',
      '🔥', '✨', '⚡', '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '⚽'
    ]
  }
};

export function EmojiPickerPopover({ onSelectEmoji, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('smileys');
  const [search, setSearch] = useState('');

  const currentCategory = EMOJI_CATEGORIES[selectedCategory];

  const displayedEmojis = search.trim()
    ? Object.values(EMOJI_CATEGORIES)
        .flatMap((c) => c.emojis)
        .slice(0, 60)
    : currentCategory.emojis;

  return (
    <div 
      className="absolute bottom-16 left-3 sm:left-4 z-50 w-72 sm:w-80 bg-white dark:bg-[#202c33] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-2 animate-message"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Category Tabs */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/60 pb-1.5 px-1 mb-2">
        {Object.entries(EMOJI_CATEGORIES).map(([catKey, cat]) => (
          <button
            key={catKey}
            onClick={() => setSelectedCategory(catKey)}
            className={`p-1.5 rounded-lg text-lg transition-transform hover:scale-115 ${
              selectedCategory === catKey
                ? 'bg-gray-100 dark:bg-white/10'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Emoji Search */}
      <div className="relative mb-2 px-1">
        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emoji"
          className="w-full bg-[#f0f2f5] dark:bg-[#111b21] text-xs text-gray-800 dark:text-gray-200 rounded-lg pl-7 pr-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#00a884]"
        />
      </div>

      {/* Grid of Emojis */}
      <div className="grid grid-cols-8 gap-1 h-48 overflow-y-auto p-1 text-xl">
        {displayedEmojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => {
              onSelectEmoji(emoji);
            }}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-120 transition-transform"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

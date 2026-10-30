import React from 'react';
import { X, Phone, Video, Search, Bell, Heart, Shield, Trash2, Ban, ThumbsDown, Image } from 'lucide-react';

export function ContactInfoDrawer({
  activeChat,
  onClose,
  onClearChat,
  onDeleteChat
}) {
  const imagesInChat = activeChat.messages.filter((m) => m.type === 'image');

  return (
    <div className="w-full sm:w-[380px] lg:w-[420px] h-full bg-[#f0f2f5] dark:bg-[#111b21] border-l border-[#e9edef] dark:border-[#222e35] flex flex-col font-sans select-none z-30 animate-message shadow-xl">
      {/* Header */}
      <div className="h-[60px] bg-[#f0f2f5] dark:bg-[#202c33] px-5 flex items-center gap-6 border-b border-[#e9edef] dark:border-[#222e35]">
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-[#54656f] dark:text-[#aebac1]"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-base font-medium text-[#111b21] dark:text-[#e9edef]">
          {activeChat.isGroup ? 'Group info' : 'Contact info'}
        </h3>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {/* Avatar & Contact Title */}
        <div className="bg-white dark:bg-[#111b21] py-7 px-6 flex flex-col items-center border-b border-gray-100 dark:border-gray-800 shadow-sm">
          <img
            src={activeChat.avatar}
            alt={activeChat.name}
            className="w-44 h-44 rounded-full object-cover shadow-md mb-4"
          />
          <h2 className="text-xl font-medium text-[#111b21] dark:text-[#e9edef] text-center">
            {activeChat.name}
          </h2>
          <span className="text-sm text-[#667781] dark:text-[#8696a0] mt-0.5">
            {activeChat.phone || (activeChat.isGroup ? `${activeChat.messages.length} messages` : 'WhatsApp Contact')}
          </span>
        </div>

        {/* About section */}
        {activeChat.about && (
          <div className="bg-white dark:bg-[#111b21] p-5 my-2.5 border-b border-t border-gray-100 dark:border-gray-800 shadow-sm">
            <span className="text-xs text-[#8696a0] font-normal">About</span>
            <p className="text-sm text-[#111b21] dark:text-[#e9edef] mt-1 font-normal leading-relaxed">
              {activeChat.about}
            </p>
          </div>
        )}

        {/* Media, links and docs section */}
        <div className="bg-white dark:bg-[#111b21] p-5 my-2.5 border-b border-t border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#8696a0]">Media, links and docs</span>
            <span className="text-xs text-[#00a884] font-medium cursor-pointer">
              {imagesInChat.length} items &gt;
            </span>
          </div>

          {imagesInChat.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {imagesInChat.map((img, idx) => (
                <img
                  key={idx}
                  src={img.mediaUrl}
                  alt="Media"
                  className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-90"
                  onClick={() => window.open(img.mediaUrl, '_blank')}
                />
              ))}
            </div>
          ) : (
            <div className="text-xs text-[#8696a0] py-2 flex items-center gap-2">
              <Image className="w-4 h-4" />
              <span>No shared media yet</span>
            </div>
          )}
        </div>

        {/* Group Participants (if group) */}
        {activeChat.isGroup && activeChat.members && (
          <div className="bg-white dark:bg-[#111b21] p-5 my-2.5 border-b border-t border-gray-100 dark:border-gray-800 shadow-sm">
            <span className="text-xs text-[#8696a0]">Participants</span>
            <p className="text-sm text-[#111b21] dark:text-[#e9edef] mt-2 font-normal leading-relaxed">
              {activeChat.members}
            </p>
          </div>
        )}

        {/* Settings actions: Mute notifications */}
        <div className="bg-white dark:bg-[#111b21] p-4 my-2.5 border-b border-t border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5">
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-[#8696a0]" />
            <span className="text-sm text-[#111b21] dark:text-[#e9edef]">Mute notifications</span>
          </div>
          <input type="checkbox" className="w-4 h-4 text-[#00a884] rounded" />
        </div>

        {/* Encryption note */}
        <div className="bg-white dark:bg-[#111b21] p-4 my-2.5 border-b border-t border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <Shield className="w-5 h-5 text-[#8696a0]" />
          <div>
            <div className="text-sm text-[#111b21] dark:text-[#e9edef]">Encryption</div>
            <div className="text-xs text-[#8696a0]">Messages are end-to-end encrypted. Tap to verify.</div>
          </div>
        </div>

        {/* Clear and Delete Chat buttons */}
        <div className="bg-white dark:bg-[#111b21] my-2.5 border-b border-t border-gray-100 dark:border-gray-800 shadow-sm">
          <button
            onClick={() => onClearChat(activeChat.id)}
            className="w-full p-4 flex items-center gap-4 text-sm text-[#ea4335] hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span>Clear messages</span>
          </button>
          <button
            onClick={() => {
              onDeleteChat(activeChat.id);
              onClose();
            }}
            className="w-full p-4 flex items-center gap-4 text-sm text-[#ea4335] hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border-t border-gray-100 dark:border-gray-800"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}

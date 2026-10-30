import React, { useState } from 'react';
import { X, Send, Smile, Crop, RotateCw, Type, PenTool } from 'lucide-react';
import { EmojiPickerPopover } from './EmojiPickerPopover';

export function MediaPreviewModal({
  mediaFile,
  mediaUrl,
  type = 'image',
  onSend,
  onClose
}) {
  const [caption, setCaption] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    onSend({
      type,
      mediaUrl,
      fileName: mediaFile?.name || 'Uploaded File',
      fileSize: mediaFile ? `${(mediaFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB',
      caption: caption.trim()
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0c1317]/95 backdrop-blur-sm flex flex-col justify-between text-white font-sans select-none animate-message">
      {/* Top Bar */}
      <div className="h-14 px-6 flex items-center justify-between border-b border-white/10">
        <button
          onClick={onClose}
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          title="Close preview"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Mock Editing Tools (WhatsApp style) */}
        <div className="flex items-center gap-2 text-white/80">
          <button className="p-2 hover:bg-white/10 rounded-full hover:text-white" title="Crop">
            <Crop className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full hover:text-white" title="Rotate">
            <RotateCw className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full hover:text-white" title="Add text">
            <Type className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full hover:text-white" title="Draw">
            <PenTool className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Media Preview */}
      <div className="flex-1 flex items-center justify-center p-4 min-h-0 overflow-hidden">
        {type === 'image' ? (
          <img
            src={mediaUrl}
            alt="Upload Preview"
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          />
        ) : (
          <div className="bg-white/10 p-8 rounded-2xl flex flex-col items-center gap-3">
            <div className="text-4xl">📄</div>
            <span className="font-medium text-lg">{mediaFile?.name}</span>
            <span className="text-sm text-white/60">
              {mediaFile ? `${(mediaFile.size / 1024).toFixed(1)} KB` : ''}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Bar: Caption and Send */}
      <div className="p-4 sm:p-6 max-w-3xl w-full mx-auto relative">
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 z-50">
            <EmojiPickerPopover
              onSelectEmoji={(emoji) => setCaption((c) => c + emoji)}
              onClose={() => setShowEmojiPicker(false)}
            />
          </div>
        )}

        <div className="flex items-center gap-3 bg-[#202c33] rounded-xl px-4 py-2.5 shadow-xl border border-white/10">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-[#8696a0] hover:text-white transition-colors"
          >
            <Smile className="w-6 h-6" />
          </button>

          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a caption..."
            className="flex-1 bg-transparent text-white placeholder-[#8696a0] text-sm focus:outline-none"
            autoFocus
          />

          <button
            onClick={handleSend}
            className="w-11 h-11 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
            title="Send"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

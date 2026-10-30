import React, { useState, useRef, useEffect } from 'react';
import { 
  Smile, 
  Plus, 
  Mic, 
  Send, 
  Image, 
  Camera, 
  FileText, 
  User, 
  BarChart2, 
  X, 
  Check
} from 'lucide-react';
import { EmojiPickerPopover } from './EmojiPickerPopover';
import { MediaPreviewModal } from './MediaPreviewModal';

export function ChatFooter({
  onSendMessage,
  onSendMedia,
  replyingTo,
  onCancelReply
}) {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  // File upload preview state
  const [previewMedia, setPreviewMedia] = useState(null); // { file, url, type }

  const inputRef = useRef(null);
  const attachMenuRef = useRef(null);
  const timerRef = useRef(null);

  // Hidden native file input refs for picking files directly from PC
  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target)) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Voice recording timer simulation
  useEffect(() => {
    if (isRecording) {
      setRecordSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectEmoji = (emoji) => {
    setInputText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const handleSendVoiceNote = () => {
    setIsRecording(false);
    onSendMedia({
      type: 'voice',
      duration: `0:${recordSeconds < 10 ? '0' + recordSeconds : recordSeconds}`
    });
  };

  // 1. Photos & Videos file selection from PC
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewMedia({
        file,
        url: event.target?.result,
        type: 'image'
      });
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  // 2. Document file selection from PC
  const handleDocFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    onSendMedia({
      type: 'document',
      fileName: file.name,
      fileSize: fileSizeFormatted
    });
    e.target.value = ''; // Reset input
  };

  // 3. Camera file selection from PC/device
  const handleCameraFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewMedia({
        file,
        url: event.target?.result,
        type: 'image'
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAttachClick = (type) => {
    setShowAttachMenu(false);
    if (type === 'image') {
      imageInputRef.current?.click();
    } else if (type === 'document') {
      docInputRef.current?.click();
    } else if (type === 'camera') {
      cameraInputRef.current?.click();
    } else if (type === 'contact') {
      onSendMessage('Shared Contact: Michael Scott (+1 555-0199)');
    } else if (type === 'poll') {
      onSendMessage('📊 Team Poll: Which design theme do you prefer? (Light / Dark)');
    }
  };

  const hasText = inputText.trim().length > 0;

  return (
    <div className="relative bg-[#f0f2f5] dark:bg-[#202c33] border-t border-[#e9edef] dark:border-[#222e35] select-none">
      {/* Hidden File Inputs for PC Uploads */}
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*,video/*"
        onChange={handleImageFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={docInputRef}
        accept="*/*"
        onChange={handleDocFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleCameraFileChange}
        className="hidden"
      />

      {/* Full-screen Media Preview Modal before sending PC photo */}
      {previewMedia && (
        <MediaPreviewModal
          mediaFile={previewMedia.file}
          mediaUrl={previewMedia.url}
          type={previewMedia.type}
          onSend={(mediaData) => {
            onSendMedia(mediaData);
            setPreviewMedia(null);
          }}
          onClose={() => setPreviewMedia(null)}
        />
      )}

      {/* Replying Banner (if user clicked reply on a message) */}
      {replyingTo && (
        <div className="px-4 py-2 bg-[#e9edef] dark:bg-[#182229] flex items-center justify-between border-l-4 border-[#00a884] animate-message">
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-[#00a884]">
              {replyingTo.senderId === 'me' ? 'You' : replyingTo.senderName || 'Contact'}
            </span>
            <p className="text-xs text-[#54656f] dark:text-[#8696a0] truncate">
              {replyingTo.text || (replyingTo.type === 'image' ? 'Photo' : 'Voice message')}
            </p>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-[#8696a0]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Popover Menus */}
      {showEmojiPicker && (
        <EmojiPickerPopover
          onSelectEmoji={handleSelectEmoji}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}

      {/* Attachment Menu Popover */}
      {showAttachMenu && (
        <div
          ref={attachMenuRef}
          className="absolute bottom-16 left-12 z-50 bg-white dark:bg-[#233138] rounded-2xl shadow-2xl p-3 border border-black/5 dark:border-white/5 animate-message"
        >
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => handleAttachClick('document')}
              className="flex items-center gap-3 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-left group"
              title="Upload document from PC"
            >
              <div className="w-9 h-9 rounded-full bg-[#5f66cd] group-hover:scale-105 transition-transform flex items-center justify-center text-white shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-medium text-[#3b4a54] dark:text-[#d1d7db] block">Document</span>
                <span className="text-[11px] text-[#8696a0] block">Upload from computer</span>
              </div>
            </button>

            <button
              onClick={() => handleAttachClick('image')}
              className="flex items-center gap-3 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-left group"
              title="Upload photos from PC"
            >
              <div className="w-9 h-9 rounded-full bg-[#007bfc] group-hover:scale-105 transition-transform flex items-center justify-center text-white shadow-sm">
                <Image className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-medium text-[#3b4a54] dark:text-[#d1d7db] block">Photos & videos</span>
                <span className="text-[11px] text-[#8696a0] block">Select image from PC</span>
              </div>
            </button>

            <button
              onClick={() => handleAttachClick('camera')}
              className="flex items-center gap-3 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-left group"
              title="Take a photo / Camera"
            >
              <div className="w-9 h-9 rounded-full bg-[#d3396d] group-hover:scale-105 transition-transform flex items-center justify-center text-white shadow-sm">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-medium text-[#3b4a54] dark:text-[#d1d7db] block">Camera</span>
                <span className="text-[11px] text-[#8696a0] block">Take a photo</span>
              </div>
            </button>

            <button
              onClick={() => handleAttachClick('contact')}
              className="flex items-center gap-3 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-left group"
            >
              <div className="w-9 h-9 rounded-full bg-[#009de2] group-hover:scale-105 transition-transform flex items-center justify-center text-white shadow-sm">
                <User className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-[#3b4a54] dark:text-[#d1d7db]">Contact</span>
            </button>

            <button
              onClick={() => handleAttachClick('poll')}
              className="flex items-center gap-3 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-left group"
            >
              <div className="w-9 h-9 rounded-full bg-[#ffbc38] group-hover:scale-105 transition-transform flex items-center justify-center text-white shadow-sm">
                <BarChart2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-[#3b4a54] dark:text-[#d1d7db]">Poll</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer Main Bar */}
      <div className="px-3 sm:px-4 py-2.5 flex items-center gap-2">
        {!isRecording ? (
          <>
            {/* Left Icons: Emoji + Plus/Paperclip */}
            <div className="flex items-center gap-1 text-[#54656f] dark:text-[#8696a0]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEmojiPicker(!showEmojiPicker);
                }}
                className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${
                  showEmojiPicker ? 'text-[#00a884]' : ''
                }`}
                title="Emojis"
              >
                <Smile className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAttachMenu(!showAttachMenu);
                }}
                className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${
                  showAttachMenu ? 'text-[#00a884] rotate-45' : ''
                }`}
                title="Attach file from PC"
              >
                <Plus className="w-6 h-6 transition-transform" />
              </button>
            </div>

            {/* Input Bar */}
            <div className="flex-1 min-w-0 bg-white dark:bg-[#2a3942] rounded-lg px-3 py-2 flex items-center shadow-sm">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message"
                className="w-full bg-transparent text-[15px] text-[#111b21] dark:text-[#e9edef] placeholder-[#667781] dark:placeholder-[#8696a0] focus:outline-none"
              />
            </div>

            {/* Dynamic Mic vs Send Icon */}
            <div>
              {hasText ? (
                <button
                  onClick={handleSend}
                  className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white flex items-center justify-center transition-all shadow-md active:scale-95"
                  title="Send message"
                >
                  <Send className="w-5 h-5 ml-0.5 fill-white" />
                </button>
              ) : (
                <button
                  onClick={() => setIsRecording(true)}
                  className="p-2 text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  title="Record voice note"
                >
                  <Mic className="w-6 h-6" />
                </button>
              )}
            </div>
          </>
        ) : (
          /* Simulated Voice Recording UI */
          <div className="flex-1 flex items-center justify-between bg-white dark:bg-[#2a3942] rounded-lg px-4 py-2 shadow-sm animate-message">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-semibold text-red-500">
                0:{recordSeconds < 10 ? '0' + recordSeconds : recordSeconds}
              </span>
              <span className="text-xs text-[#8696a0] hidden sm:inline">
                Recording audio note...
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRecording(false)}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full"
                title="Cancel"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={handleSendVoiceNote}
                className="w-8 h-8 rounded-full bg-[#00a884] text-white flex items-center justify-center hover:bg-[#008f6f]"
                title="Send voice note"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

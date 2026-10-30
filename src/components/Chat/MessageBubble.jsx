import React, { useState } from 'react';
import { 
  Check, 
  CheckCheck, 
  Play, 
  Pause, 
  FileText, 
  Download, 
  Smile, 
  ChevronDown, 
  Star, 
  Trash2, 
  Copy, 
  Reply 
} from 'lucide-react';

export function MessageBubble({
  message,
  isGroup,
  onReact,
  onDeleteMessage,
  onReply
}) {
  const isMe = message.senderId === 'me';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');
  const [showOptions, setShowOptions] = useState(false);
  const [showReactionBar, setShowReactionBar] = useState(false);

  const reactionsList = ['❤️', '👍', '😂', '😮', '😢', '🙏'];

  const toggleSpeed = (e) => {
    e.stopPropagation();
    if (playbackSpeed === '1x') setPlaybackSpeed('1.5x');
    else if (playbackSpeed === '1.5x') setPlaybackSpeed('2x');
    else setPlaybackSpeed('1x');
  };

  const copyToClipboard = () => {
    if (message.text) {
      navigator.clipboard.writeText(message.text);
      setShowOptions(false);
    }
  };

  const renderStatusTicks = () => {
    if (message.status === 'read') {
      return <CheckCheck className="w-[15px] h-[15px] text-[#53bdeb] ml-1 flex-shrink-0" />;
    }
    if (message.status === 'delivered') {
      return <CheckCheck className="w-[15px] h-[15px] text-[#8696a0] ml-1 flex-shrink-0" />;
    }
    return <Check className="w-[15px] h-[15px] text-[#8696a0] ml-1 flex-shrink-0" />;
  };

  return (
    <div
      className={`relative group flex my-1 px-4 ${
        isMe ? 'justify-end' : 'justify-start'
      }`}
      onMouseLeave={() => {
        setShowOptions(false);
        setShowReactionBar(false);
      }}
    >
      {/* Reaction Picker Bar (appears on hover) */}
      {showReactionBar && (
        <div
          className={`absolute -top-9 z-30 bg-white dark:bg-[#202c33] px-2 py-1 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-1.5 animate-message ${
            isMe ? 'right-6' : 'left-6'
          }`}
        >
          {reactionsList.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onReact(message.id, emoji);
                setShowReactionBar(false);
              }}
              className="text-lg hover:scale-130 transition-transform p-0.5"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] md:max-w-[65%] rounded-lg px-3 py-1.5 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] transition-all ${
          isMe
            ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] wa-bubble-outgoing'
            : 'bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] wa-bubble-incoming'
        }`}
      >
        {/* Group Sender Name */}
        {!isMe && isGroup && message.senderName && (
          <div className="text-[12.5px] font-semibold text-[#00a884] dark:text-[#53bdeb] mb-0.5">
            {message.senderName}
          </div>
        )}

        {/* Message Content: Image */}
        {message.type === 'image' && (
          <div className="mb-1 rounded overflow-hidden">
            <img
              src={message.mediaUrl}
              alt="Attachment"
              className="w-full max-h-[320px] object-cover rounded cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => window.open(message.mediaUrl, '_blank')}
            />
            {message.caption && (
              <p className="mt-1.5 text-[14.2px] leading-relaxed text-[#111b21] dark:text-[#e9edef]">
                {message.caption}
              </p>
            )}
          </div>
        )}

        {/* Message Content: Voice Note */}
        {message.type === 'voice' && (
          <div className="flex items-center gap-3 py-1.5 min-w-[220px]">
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="w-9 h-9 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 shadow-sm"
            >
              {isPlayingAudio ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white ml-0.5" />
              )}
            </button>

            {/* Simulated audio waveform */}
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center gap-0.5 h-6">
                {[4, 12, 18, 8, 22, 16, 26, 12, 20, 14, 28, 10, 18, 6, 15, 22, 9, 14].map(
                  (height, i) => (
                    <div
                      key={i}
                      style={{ height: `${height}px` }}
                      className={`w-1 rounded-full transition-colors ${
                        isPlayingAudio && i < 10
                          ? 'bg-[#00a884]'
                          : 'bg-[#8696a0]/50'
                      }`}
                    />
                  )
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#667781] dark:text-[#8696a0]">
                <span>{isPlayingAudio ? '0:12' : message.duration || '0:28'}</span>
                <button
                  onClick={toggleSpeed}
                  className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[10px] font-semibold hover:bg-black/10"
                >
                  {playbackSpeed}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message Content: Document */}
        {message.type === 'document' && (
          <div className="flex items-center gap-3 p-2 rounded bg-black/5 dark:bg-black/20 mb-1">
            <div className="p-2 rounded bg-[#ea4335] text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate">{message.fileName || 'Document.pdf'}</div>
              <div className="text-[10px] text-gray-500">{message.fileSize || '1.8 MB'} • PDF</div>
            </div>
            <button className="p-1 hover:bg-black/5 rounded">
              <Download className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        )}

        {/* Message Content: Normal Text */}
        {(!message.type || message.type === 'text') && (
          <div className="text-[14.2px] leading-relaxed break-words pr-14 select-text">
            {message.text}
          </div>
        )}

        {/* Timestamp and Delivery ticks on bottom right */}
        <div className="float-right -mt-2.5 ml-2 pl-2 flex items-center justify-end text-[11px] text-[#667781] dark:text-[#8696a0] select-none">
          <span>{message.timestamp}</span>
          {isMe && renderStatusTicks()}
        </div>

        {/* Attached Reaction Pill (if reacted) */}
        {message.reaction && (
          <div className="absolute -bottom-2 right-2 bg-white dark:bg-[#202c33] px-1.5 py-0.5 rounded-full shadow border border-gray-200 dark:border-gray-700 text-xs flex items-center gap-0.5">
            <span>{message.reaction}</span>
          </div>
        )}

        {/* Message Action Trigger (Chevron) on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-[#8696a0] hover:text-black dark:hover:text-white"
          title="Message options"
        >
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* Message Options Dropdown */}
        {showOptions && (
          <div
            className={`absolute top-6 z-40 w-36 bg-white dark:bg-[#233138] rounded shadow-xl py-1 border border-black/5 dark:border-white/5 animate-message ${
              isMe ? 'right-0' : 'left-0'
            }`}
          >
            <button
              onClick={() => {
                setShowReactionBar(true);
                setShowOptions(false);
              }}
              className="w-full px-3 py-1.5 text-left text-xs text-[#3b4a54] dark:text-[#d1d7db] hover:bg-[#f5f6f6] dark:hover:bg-[#182229] flex items-center gap-2"
            >
              <Smile className="w-3.5 h-3.5 text-[#8696a0]" />
              React
            </button>
            <button
              onClick={() => {
                onReply(message);
                setShowOptions(false);
              }}
              className="w-full px-3 py-1.5 text-left text-xs text-[#3b4a54] dark:text-[#d1d7db] hover:bg-[#f5f6f6] dark:hover:bg-[#182229] flex items-center gap-2"
            >
              <Reply className="w-3.5 h-3.5 text-[#8696a0]" />
              Reply
            </button>
            {message.text && (
              <button
                onClick={copyToClipboard}
                className="w-full px-3 py-1.5 text-left text-xs text-[#3b4a54] dark:text-[#d1d7db] hover:bg-[#f5f6f6] dark:hover:bg-[#182229] flex items-center gap-2"
              >
                <Copy className="w-3.5 h-3.5 text-[#8696a0]" />
                Copy
              </button>
            )}
            <button
              onClick={() => {
                onDeleteMessage(message.id);
                setShowOptions(false);
              }}
              className="w-full px-3 py-1.5 text-left text-xs text-red-500 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

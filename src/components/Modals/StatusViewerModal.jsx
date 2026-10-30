import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Send, Heart } from 'lucide-react';

export function StatusViewerModal({ statuses, initialStatusIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialStatusIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');

  const currentStatus = statuses[currentIndex] || statuses[0];
  const stories = currentStatus?.stories || [];
  const currentStory = stories[storyIndex] || {
    type: 'text',
    text: 'Welcome to WhatsApp Status!',
    bgColor: '#00a884',
    time: currentStatus?.time || 'Just now'
  };

  // Auto-progress stories
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next story or next status
          if (storyIndex < stories.length - 1) {
            setStoryIndex((s) => s + 1);
            return 0;
          } else if (currentIndex < statuses.length - 1) {
            setCurrentIndex((c) => c + 1);
            setStoryIndex(0);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2.5; // ~4 seconds duration
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, storyIndex, stories.length, statuses.length, onClose]);

  const handlePrev = () => {
    if (storyIndex > 0) {
      setStoryIndex(storyIndex - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setStoryIndex(0);
    }
  };

  const handleNext = () => {
    if (storyIndex < stories.length - 1) {
      setStoryIndex(storyIndex + 1);
    } else if (currentIndex < statuses.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setStoryIndex(0);
    } else {
      onClose();
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    alert(`Replied to ${currentStatus.userName}'s status: "${replyText}"`);
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b141a] flex flex-col justify-between text-white select-none animate-message">
      {/* Top Header & Progress bars */}
      <div className="w-full max-w-lg mx-auto pt-4 px-4 z-20">
        {/* Story Progress Indicators */}
        <div className="flex gap-1.5 mb-3">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                style={{
                  width:
                    i < storyIndex
                      ? '100%'
                      : i === storyIndex
                      ? `${progress}%`
                      : '0%'
                }}
                className="h-full bg-white transition-all duration-100 ease-linear"
              />
            </div>
          ))}
        </div>

        {/* User Profile Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentStatus.avatar}
              alt={currentStatus.userName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/50"
            />
            <div>
              <h4 className="font-semibold text-sm leading-tight">
                {currentStatus.userName}
              </h4>
              <span className="text-xs text-white/70">
                {currentStory.time || currentStatus.time}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Story Content with Navigation Tap Areas */}
      <div className="relative flex-1 flex items-center justify-center max-w-lg w-full mx-auto px-4 my-2">
        {/* Prev Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-2 z-20 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors hidden sm:block"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-2 z-20 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors hidden sm:block"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Story Media Viewer */}
        <div 
          onClick={handleNext}
          className="w-full h-full max-h-[75vh] rounded-2xl overflow-hidden flex items-center justify-center relative shadow-2xl cursor-pointer"
          style={{
            backgroundColor: currentStory.bgColor || '#111b21'
          }}
        >
          {currentStory.type === 'image' ? (
            <div className="w-full h-full relative flex items-center justify-center bg-black">
              <img
                src={currentStory.url}
                alt="Story"
                className="max-h-full max-w-full object-contain"
              />
              {currentStory.caption && (
                <div className="absolute bottom-4 inset-x-4 bg-black/60 backdrop-blur-sm p-3 rounded-xl text-center text-sm font-medium">
                  {currentStory.caption}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center flex items-center justify-center h-full">
              <p className="text-2xl sm:text-3xl font-medium leading-relaxed drop-shadow-md">
                {currentStory.text}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Reply Bar */}
      <div className="w-full max-w-lg mx-auto pb-6 px-4 z-20">
        <form onSubmit={handleSendReply} className="flex items-center gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply to ${currentStatus.userName}...`}
            className="flex-1 bg-white/15 backdrop-blur-md text-white placeholder-white/60 px-4 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884]"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#008f6f] flex items-center justify-center text-white transition-transform active:scale-95 shadow"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

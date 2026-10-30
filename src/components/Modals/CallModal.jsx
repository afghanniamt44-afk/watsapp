import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, Shield } from 'lucide-react';

export function CallModal({ contact, type = 'voice', onClose }) {
  const [callState, setCallState] = useState('Calling...');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    // Stage 1: Calling... -> Ringing... after 1.2s
    const ringTimer = setTimeout(() => {
      setCallState('Ringing...');
    }, 1200);

    // Stage 2: Connected after 3s
    const connectTimer = setTimeout(() => {
      setCallState('Connected');
    }, 3200);

    return () => {
      clearTimeout(ringTimer);
      clearTimeout(connectTimer);
    };
  }, []);

  // Timer when connected
  useEffect(() => {
    let timer;
    if (callState === 'Connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callState]);

  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins < 10 ? '0' + mins : mins}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0c1317]/95 backdrop-blur-md flex flex-col items-center justify-between py-12 px-6 text-white font-sans select-none animate-message">
      {/* Top Header */}
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2 text-xs text-white/70">
          <Shield className="w-3.5 h-3.5 text-[#00a884]" />
          <span>End-to-end encrypted</span>
        </div>
        <h2 className="text-2xl font-medium mt-2">{contact.name}</h2>
        <span className="text-sm text-[#00a884] font-medium tracking-wide">
          {callState === 'Connected' ? formatDuration(callDuration) : callState}
        </span>
      </div>

      {/* Center Avatar with Pulsating Rings */}
      <div className="relative flex items-center justify-center my-auto">
        {callState !== 'Connected' && (
          <>
            <div className="absolute w-48 h-48 rounded-full border border-[#00a884]/40 animate-ping pointer-events-none" />
            <div className="absolute w-56 h-56 rounded-full border border-[#00a884]/20 animate-pulse pointer-events-none" />
          </>
        )}
        <img
          src={contact.avatar}
          alt={contact.name}
          className="w-36 h-36 rounded-full object-cover shadow-2xl ring-4 ring-[#00a884]/30"
        />
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center gap-4 sm:gap-6 bg-white/10 backdrop-blur-md px-6 py-4 rounded-full">
        {/* Mute Mic */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3.5 rounded-full transition-colors ${
            isMuted ? 'bg-red-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* Video Toggle (if video call) */}
        {type === 'video' && (
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3.5 rounded-full transition-colors ${
              isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isVideoOff ? 'Turn on video' : 'Turn off video'}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>
        )}

        {/* End Call Button */}
        <button
          onClick={onClose}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-transform active:scale-95 shadow-lg"
          title="End call"
        >
          <PhoneOff className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}

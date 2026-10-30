import React from 'react';
import { Lock, Laptop, Download, ShieldCheck } from 'lucide-react';

export function EmptyChatScreen({ onOpenNewChat }) {
  return (
    <div className="flex-1 h-full bg-[#f0f2f5] dark:bg-[#222e35] flex flex-col items-center justify-center p-8 select-none border-b-[6px] border-[#25d366] relative overflow-hidden transition-colors">
      <div className="max-w-[560px] text-center flex flex-col items-center animate-message">
        {/* SVG Graphic mimicking WhatsApp Web Connected Devices */}
        <div className="relative mb-8">
          <div className="w-64 h-48 sm:w-80 sm:h-56 relative flex items-center justify-center">
            {/* Desktop Monitor SVG */}
            <svg viewBox="0 0 320 200" className="w-full h-full text-gray-300 dark:text-gray-600">
              {/* Stand */}
              <path d="M135 170 h50 v20 h-50 z" fill="currentColor" opacity="0.4" />
              <path d="M120 190 h80 v6 h-80 z" rx="3" fill="currentColor" opacity="0.6" />
              {/* Monitor Body */}
              <rect x="50" y="20" width="220" height="150" rx="12" fill="currentColor" opacity="0.25" />
              <rect x="58" y="28" width="204" height="134" rx="6" fill="white" className="dark:fill-[#111b21]" />
              {/* Top Bar on Monitor */}
              <rect x="58" y="28" width="204" height="24" rx="6" fill="#00a884" opacity="0.8" />
              <circle cx="70" cy="40" r="3" fill="white" opacity="0.7" />
              <circle cx="80" cy="40" r="3" fill="white" opacity="0.7" />
              {/* Screen Mock Chat Bubbles */}
              <rect x="70" y="65" width="90" height="20" rx="6" fill="#e9edef" className="dark:fill-[#202c33]" />
              <rect x="150" y="95" width="100" height="24" rx="6" fill="#d9fdd3" className="dark:fill-[#005c4b]" />
              <rect x="70" y="130" width="110" height="22" rx="6" fill="#e9edef" className="dark:fill-[#202c33]" />

              {/* Phone overlay next to monitor */}
              <rect x="230" y="70" width="55" height="110" rx="10" fill="currentColor" opacity="0.8" />
              <rect x="234" y="74" width="47" height="102" rx="7" fill="white" className="dark:fill-[#111b21]" />
              <rect x="234" y="74" width="47" height="14" rx="4" fill="#00a884" />
              <circle cx="257" cy="81" r="2.5" fill="white" />
              {/* Phone chat bubbles */}
              <rect x="238" y="96" width="30" height="12" rx="3" fill="#e9edef" className="dark:fill-[#202c33]" />
              <rect x="245" y="114" width="32" height="14" rx="3" fill="#d9fdd3" className="dark:fill-[#005c4b]" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[32px] font-light text-[#41525d] dark:text-[#e9edef] mb-3 leading-snug">
          WhatsApp Web
        </h2>

        {/* Subtitle description */}
        <p className="text-[14px] text-[#667781] dark:text-[#8696a0] leading-relaxed max-w-md mb-6">
          Send and receive messages without keeping your phone online.<br />
          Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
        </p>

        {/* CTA Button */}
        <button
          onClick={onOpenNewChat}
          className="bg-[#00a884] hover:bg-[#008f6f] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow flex items-center gap-2"
        >
          <span>Start a new conversation</span>
        </button>
      </div>

      {/* Bottom End-to-End Encryption Banner */}
      <div className="absolute bottom-10 flex items-center justify-center gap-2 text-xs text-[#8696a0]">
        <Lock className="w-3.5 h-3.5" />
        <span>Your personal messages are end-to-end encrypted</span>
      </div>
    </div>
  );
}

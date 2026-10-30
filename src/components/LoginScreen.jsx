import React, { useState } from 'react';
import { Smartphone, Check, HelpCircle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export function LoginScreen({ onLogin }) {
  const [staySignedIn, setStaySignedIn] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPhoneLogin, setShowPhoneLogin] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [qrKey, setQrKey] = useState(1);

  const handleSimulateScan = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      onLogin(staySignedIn);
    }, 1200);
  };

  const handleRefreshQR = (e) => {
    e.stopPropagation();
    setQrKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#111b21] flex flex-col justify-between font-sans transition-colors duration-200">
      {/* Top Green Bar */}
      <div className="bg-[#00a884] dark:bg-[#202c33] h-[220px] w-full absolute top-0 left-0 z-0 border-b border-[#00a884]/20">
        <div className="max-w-[1020px] mx-auto px-6 pt-7 flex items-center gap-3">
          <svg className="w-9 h-9 fill-white" viewBox="0 0 24 24">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z" />
          </svg>
          <span className="text-white text-[15px] font-semibold tracking-wide uppercase">WhatsApp Web</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="relative z-10 max-w-[1000px] w-full mx-auto my-auto px-4 sm:px-6 pt-24 pb-8">
        <div className="bg-white dark:bg-[#111b21] rounded-lg shadow-xl border border-gray-200/80 dark:border-[#222e35] p-8 sm:p-12 transition-all">
          {!showPhoneLogin ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Column: Instructions */}
              <div className="md:col-span-7 space-y-6">
                <h1 className="text-2xl sm:text-[28px] font-light text-[#41525d] dark:text-[#e9edef] leading-tight">
                  To use WhatsApp on your computer:
                </h1>

                <ol className="space-y-4 text-[16px] text-[#3b4a54] dark:text-[#aebac1] list-decimal list-inside leading-relaxed">
                  <li className="pl-1">
                    <span>Open WhatsApp on your phone</span>
                  </li>
                  <li className="pl-1">
                    <span>
                      Tap <strong className="font-semibold text-black dark:text-white">Menu</strong>{' '}
                      <span className="inline-block px-1 text-sm bg-gray-100 dark:bg-gray-800 rounded">⋮</span> on Android, or{' '}
                      <strong className="font-semibold text-black dark:text-white">Settings</strong>{' '}
                      <span className="inline-block px-1 text-sm bg-gray-100 dark:bg-gray-800 rounded">⚙️</span> on iPhone
                    </span>
                  </li>
                  <li className="pl-1">
                    <span>
                      Tap <strong className="font-semibold text-black dark:text-white">Linked devices</strong> and then{' '}
                      <strong className="font-semibold text-black dark:text-white">Link a device</strong>
                    </span>
                  </li>
                  <li className="pl-1">
                    <span>Point your phone to this screen to capture the QR code</span>
                  </li>
                </ol>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                  <button
                    onClick={() => setShowPhoneLogin(true)}
                    className="text-[#00a884] hover:underline text-[15px] font-medium text-left"
                  >
                    Link with phone number instead
                  </button>
                  <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>
                  <a
                    href="#help"
                    onClick={(e) => { e.preventDefault(); alert("Scan the QR code with your mobile camera or WhatsApp Linked Devices scanner."); }}
                    className="text-[#00a884] hover:underline text-[15px] font-medium flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Need help getting started?
                  </a>
                </div>
              </div>

              {/* Right Column: QR Code */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div
                  onClick={handleSimulateScan}
                  className="relative group cursor-pointer bg-white dark:bg-white p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                  title="Click to simulate scan and log in"
                >
                  {/* QR SVG */}
                  <div className="relative w-[240px] h-[240px] flex items-center justify-center overflow-hidden">
                    <svg viewBox="0 0 256 256" className="w-full h-full text-black">
                      {/* Stylized authentic QR code graphic */}
                      <rect width="256" height="256" fill="white" />
                      {/* Top-Left Corner Box */}
                      <rect x="20" y="20" width="60" height="60" rx="6" fill="#111b21" />
                      <rect x="30" y="30" width="40" height="40" rx="3" fill="white" />
                      <rect x="40" y="40" width="20" height="20" rx="2" fill="#111b21" />

                      {/* Top-Right Corner Box */}
                      <rect x="176" y="20" width="60" height="60" rx="6" fill="#111b21" />
                      <rect x="186" y="30" width="40" height="40" rx="3" fill="white" />
                      <rect x="196" y="40" width="20" height="20" rx="2" fill="#111b21" />

                      {/* Bottom-Left Corner Box */}
                      <rect x="20" y="176" width="60" height="60" rx="6" fill="#111b21" />
                      <rect x="30" y="186" width="40" height="40" rx="3" fill="white" />
                      <rect x="40" y="196" width="20" height="20" rx="2" fill="#111b21" />

                      {/* QR Pattern Data Blocks */}
                      <g fill="#111b21">
                        <rect x="96" y="24" width="16" height="16" rx="2" />
                        <rect x="120" y="24" width="24" height="12" rx="2" />
                        <rect x="100" y="48" width="12" height="28" rx="2" />
                        <rect x="136" y="48" width="20" height="14" rx="2" />
                        <rect x="24" y="96" width="28" height="12" rx="2" />
                        <rect x="64" y="96" width="16" height="20" rx="2" />
                        <rect x="24" y="128" width="18" height="18" rx="2" />
                        <rect x="52" y="132" width="28" height="12" rx="2" />
                        <rect x="96" y="96" width="16" height="16" rx="2" />
                        <rect x="144" y="96" width="16" height="20" rx="2" />
                        <rect x="120" y="132" width="20" height="20" rx="2" />
                        <rect x="176" y="96" width="28" height="14" rx="2" />
                        <rect x="216" y="96" width="18" height="24" rx="2" />
                        <rect x="188" y="124" width="20" height="20" rx="2" />
                        <rect x="96" y="176" width="24" height="16" rx="2" />
                        <rect x="132" y="180" width="16" height="24" rx="2" />
                        <rect x="100" y="216" width="28" height="16" rx="2" />
                        <rect x="148" y="216" width="16" height="16" rx="2" />
                        <rect x="180" y="180" width="24" height="18" rx="2" />
                        <rect x="212" y="176" width="20" height="30" rx="2" />
                        <rect x="188" y="220" width="44" height="14" rx="2" />
                      </g>

                      {/* Center WhatsApp Logo Circle */}
                      <circle cx="128" cy="128" r="24" fill="#00a884" />
                      <path
                        d="M128 114c-7.7 0-14 6.3-14 14 0 2.5.6 4.8 1.8 7L114 142l7.2-1.9c2.1 1.1 4.4 1.7 6.8 1.7 7.7 0 14-6.3 14-14s-6.3-13.8-14-13.8z"
                        fill="white"
                      />
                    </svg>

                    {/* Animated Scanning Laser Line */}
                    {!isLoggingIn && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00a884] to-transparent shadow-[0_0_12px_#00a884] animate-scan-line pointer-events-none" />
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      {isLoggingIn ? (
                        <div className="bg-white/95 dark:bg-[#111b21]/95 px-4 py-3 rounded-xl shadow-xl flex flex-col items-center gap-2">
                          <RefreshCw className="w-7 h-7 text-[#00a884] animate-spin" />
                          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                            Connecting to WhatsApp...
                          </span>
                        </div>
                      ) : (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-[#111b21]/90 px-3 py-1.5 rounded-lg shadow-md text-xs font-medium text-[#00a884] flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5" />
                          Click to scan & link
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stay Signed In Checkbox */}
                <div className="mt-5 flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-[#54656f] dark:text-[#8696a0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={staySignedIn}
                      onChange={(e) => setStaySignedIn(e.target.checked)}
                      className="w-4 h-4 text-[#00a884] rounded border-gray-300 focus:ring-[#00a884]"
                    />
                    <span>Stay signed in on this computer</span>
                  </label>
                </div>

                {/* Direct Action Button */}
                <button
                  onClick={handleSimulateScan}
                  disabled={isLoggingIn}
                  className="mt-4 w-full max-w-[240px] bg-[#00a884] hover:bg-[#008f6f] text-white font-medium py-2.5 px-4 rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-75"
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Syncing messages...</span>
                    </>
                  ) : (
                    <>
                      <span>Open WhatsApp Web</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Link with phone number view */
            <div className="max-w-md mx-auto py-6">
              <h2 className="text-2xl font-light text-[#41525d] dark:text-[#e9edef] mb-2 text-center">
                Enter phone number
              </h2>
              <p className="text-sm text-[#667781] dark:text-[#8696a0] mb-6 text-center">
                Select a country and enter your WhatsApp phone number.
              </p>

              <div className="space-y-4">
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-[#202c33] text-sm text-gray-700 dark:text-gray-200">
                  United States (+1)
                </div>
                <input
                  type="tel"
                  placeholder="e.g. (555) 349-8201"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-[#111b21] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00a884]"
                />
                <button
                  onClick={handleSimulateScan}
                  className="w-full bg-[#00a884] hover:bg-[#008f6f] text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
                >
                  Next
                </button>
                <button
                  onClick={() => setShowPhoneLogin(false)}
                  className="w-full text-sm text-[#00a884] hover:underline py-1"
                >
                  Back to QR code
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Video Tutorial Teaser / End-to-End Encryption Note */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#667781] dark:text-[#8696a0] gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00a884]" />
            <span>Your personal messages and calls are end-to-end encrypted.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>

      {/* Footer minimal info */}
      <div className="py-4 text-center text-xs text-gray-400 dark:text-gray-500">
        WhatsApp Web Clone • Pixel-perfect replica
      </div>
    </div>
  );
}

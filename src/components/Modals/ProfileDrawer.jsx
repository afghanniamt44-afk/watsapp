import React, { useState, useRef } from 'react';
import { ArrowLeft, Check, Edit2, Camera, Upload } from 'lucide-react';

export function ProfileDrawer({ currentUser, onUpdateProfile, onClose }) {
  const [name, setName] = useState(currentUser.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [about, setAbout] = useState(currentUser.about);
  const [isEditingAbout, setIsEditingAbout] = useState(false);

  const fileInputRef = useRef(null);

  const handleSaveName = () => {
    setIsEditingName(false);
    onUpdateProfile({ name });
  };

  const handleSaveAbout = () => {
    setIsEditingAbout(false);
    onUpdateProfile({ about });
  };

  // Upload user profile photo from PC
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        onUpdateProfile({ avatar: dataUrl });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="absolute inset-0 z-40 bg-[#f0f2f5] dark:bg-[#111b21] flex flex-col font-sans select-none animate-message">
      {/* Hidden File Input for PC Profile Picture */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Drawer Header */}
      <div className="h-[108px] bg-[#008069] dark:bg-[#202c33] text-white px-5 pb-4 flex items-end gap-6 shadow">
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/10 rounded-full transition-colors mb-0.5"
          title="Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-[19px] font-medium leading-none mb-1.5">Profile</h2>
      </div>

      {/* Profile Body */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Avatar with Camera & Upload from PC Overlay */}
        <div className="py-7 flex flex-col items-center justify-center">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative group cursor-pointer"
            title="Click to choose a photo from your PC"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-48 h-48 rounded-full object-cover shadow-lg border-2 border-transparent group-hover:border-[#00a884] transition-all"
            />
            {/* Hover Camera Overlay */}
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs gap-1.5 p-4 text-center">
              <Camera className="w-7 h-7 text-white mb-1" />
              <span className="font-semibold text-[11px] tracking-wider uppercase">CHANGE PROFILE PHOTO</span>
              <span className="text-[10px] text-gray-300">Upload from PC</span>
            </div>

            {/* Corner Quick Upload Badge */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="absolute bottom-2 right-2 p-2.5 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white shadow-lg border-2 border-white dark:border-[#111b21] transition-transform active:scale-95"
              title="Upload photo from PC"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs text-[#00a884] font-medium mt-3 cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>
            Upload photo from computer
          </span>
        </div>

        {/* Name Section */}
        <div className="bg-white dark:bg-[#111b21] px-6 py-3.5 shadow-sm border-b border-t border-gray-100 dark:border-gray-800">
          <label className="text-xs font-normal text-[#008069] dark:text-[#00a884]">
            Your name
          </label>
          <div className="flex items-center justify-between mt-1">
            {isEditingName ? (
              <div className="flex items-center gap-2 flex-1 mr-2 border-b-2 border-[#00a884] pb-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#e9edef] focus:outline-none"
                  autoFocus
                />
                <button onClick={handleSaveName} className="text-[#00a884]">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <span className="text-[16px] text-[#111b21] dark:text-[#e9edef]">
                  {currentUser.name}
                </span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-[#8696a0] hover:text-[#00a884] p-1"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <p className="px-6 py-3 text-xs text-[#8696a0] leading-relaxed">
          This is not your username or pin. This name will be visible to your WhatsApp contacts.
        </p>

        {/* About Section */}
        <div className="bg-white dark:bg-[#111b21] px-6 py-3.5 shadow-sm border-b border-t border-gray-100 dark:border-gray-800 mt-3">
          <label className="text-xs font-normal text-[#008069] dark:text-[#00a884]">
            About
          </label>
          <div className="flex items-center justify-between mt-1">
            {isEditingAbout ? (
              <div className="flex items-center gap-2 flex-1 mr-2 border-b-2 border-[#00a884] pb-1">
                <input
                  type="text"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#e9edef] focus:outline-none"
                  autoFocus
                />
                <button onClick={handleSaveAbout} className="text-[#00a884]">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <span className="text-[15px] text-[#111b21] dark:text-[#e9edef]">
                  {currentUser.about}
                </span>
                <button
                  onClick={() => setIsEditingAbout(true)}
                  className="text-[#8696a0] hover:text-[#00a884] p-1"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Phone number */}
        <div className="bg-white dark:bg-[#111b21] px-6 py-3.5 shadow-sm border-b border-t border-gray-100 dark:border-gray-800 mt-6">
          <label className="text-xs font-normal text-[#008069] dark:text-[#00a884]">
            Phone number
          </label>
          <div className="text-[15px] text-[#111b21] dark:text-[#e9edef] mt-1">
            {currentUser.phone || '+1 (555) 349-8201'}
          </div>
        </div>
      </div>
    </div>
  );
}

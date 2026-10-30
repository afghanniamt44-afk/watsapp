import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Users, 
  UserPlus, 
  Camera, 
  Check, 
  X, 
  ArrowRight, 
  Upload 
} from 'lucide-react';

export function NewChatModal({ 
  contacts, 
  currentUser,
  onSelectContact, 
  onAddNewContact,
  onCreateGroup, 
  onClose 
}) {
  // Navigation mode: 'list' | 'new-contact' | 'group-step1' | 'group-step2'
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');

  // New Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAbout, setContactAbout] = useState('Hey there! I am using WhatsApp.');
  const [contactAvatar, setContactAvatar] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  );
  const contactPhotoInputRef = useRef(null);

  // New Group Form State
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupAvatar, setGroupAvatar] = useState(
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80'
  );
  const groupPhotoInputRef = useRef(null);

  // Filtered contacts for list search
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle PC photo upload for new contact
  const handleContactPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setContactAvatar(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle PC photo upload for new group
  const handleGroupPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setGroupAvatar(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Save new contact
  const handleSaveContact = (e) => {
    e.preventDefault();
    if (!contactName.trim()) {
      alert('Please enter a contact name');
      return;
    }

    const newContact = {
      id: 'contact-' + Date.now(),
      name: contactName.trim(),
      phone: contactPhone.trim() || '+1 (555) 000-0000',
      about: contactAbout.trim(),
      avatar: contactAvatar,
      isGroup: false,
      status: 'online',
      pinned: false,
      unreadCount: 0,
      messages: []
    };

    onAddNewContact(newContact);
    onClose();
  };

  // Toggle member selection for group
  const toggleSelectMember = (contactId) => {
    setSelectedMemberIds((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  // Save new group
  const handleFinishCreateGroup = (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }

    const selectedMembers = contacts.filter((c) =>
      selectedMemberIds.includes(c.id)
    );
    const memberNames = [
      currentUser.name,
      ...selectedMembers.map((m) => m.name)
    ].join(', ');

    const newGroup = {
      id: 'group-' + Date.now(),
      name: groupName.trim(),
      avatar: groupAvatar,
      isGroup: true,
      members: memberNames,
      status: `${selectedMembers.length + 1} members`,
      pinned: false,
      unreadCount: 0,
      messages: [
        {
          id: 'gm-' + Date.now(),
          senderId: 'me',
          text: `You created group "${groupName.trim()}"`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          date: 'Today',
          status: 'read'
        }
      ]
    };

    onCreateGroup(newGroup);
    onClose();
  };

  // ================= VIEW 1: CONTACTS LIST =================
  if (view === 'list') {
    return (
      <div className="absolute inset-0 z-40 bg-white dark:bg-[#111b21] flex flex-col font-sans select-none animate-message">
        {/* Header */}
        <div className="h-[108px] bg-[#008069] dark:bg-[#202c33] text-white px-5 pb-4 flex items-end gap-6 shadow">
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/10 rounded-full transition-colors mb-0.5"
            title="Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-[19px] font-medium leading-none mb-1.5">New chat</h2>
        </div>

        {/* Search Input */}
        <div className="p-3 bg-white dark:bg-[#111b21] border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg px-3 py-1.5">
            <Search className="w-4 h-4 text-[#8696a0] mr-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or number"
              className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#e9edef] placeholder-[#8696a0] focus:outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Action Buttons: New Group & New Contact */}
        <div className="border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setView('group-step1')}
            className="w-full px-4 py-3 flex items-center gap-4 hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] transition-colors text-left"
          >
            <div className="w-11 h-11 rounded-full bg-[#00a884] flex items-center justify-center text-white shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[15px] font-medium text-[#111b21] dark:text-[#e9edef] block">
                New group
              </span>
              <span className="text-xs text-[#8696a0] block">
                Create a group chat with friends or team
              </span>
            </div>
          </button>

          <button
            onClick={() => setView('new-contact')}
            className="w-full px-4 py-3 flex items-center gap-4 hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] transition-colors text-left"
          >
            <div className="w-11 h-11 rounded-full bg-[#00a884] flex items-center justify-center text-white shadow-sm">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[15px] font-medium text-[#111b21] dark:text-[#e9edef] block">
                New contact
              </span>
              <span className="text-xs text-[#8696a0] block">
                Add a new friend with custom photo & number
              </span>
            </div>
          </button>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2 text-xs font-semibold text-[#008069] dark:text-[#00a884] tracking-wider uppercase">
            Contacts on WhatsApp
          </div>

          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => {
                onSelectContact(contact);
                onClose();
              }}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] cursor-pointer transition-colors"
            >
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-11 h-11 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0 border-b border-gray-100 dark:border-gray-800 pb-2">
                <h4 className="text-[15px] font-normal text-[#111b21] dark:text-[#e9edef] truncate">
                  {contact.name}
                </h4>
                <p className="text-xs text-[#667781] dark:text-[#8696a0] truncate">
                  {contact.about || (contact.isGroup ? 'Group' : 'Available')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ================= VIEW 2: ADD NEW CONTACT =================
  if (view === 'new-contact') {
    return (
      <div className="absolute inset-0 z-40 bg-[#f0f2f5] dark:bg-[#111b21] flex flex-col font-sans select-none animate-message">
        <input
          type="file"
          ref={contactPhotoInputRef}
          accept="image/*"
          onChange={handleContactPhotoUpload}
          className="hidden"
        />

        {/* Header */}
        <div className="h-[108px] bg-[#008069] dark:bg-[#202c33] text-white px-5 pb-4 flex items-end gap-6 shadow">
          <button
            onClick={() => setView('list')}
            className="p-1 hover:bg-black/10 rounded-full transition-colors mb-0.5"
            title="Back to contacts"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-[19px] font-medium leading-none mb-1.5">New contact</h2>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center my-4">
            <div
              onClick={() => contactPhotoInputRef.current?.click()}
              className="relative group cursor-pointer"
              title="Click to choose a photo from your PC"
            >
              <img
                src={contactAvatar}
                alt="Contact Avatar"
                className="w-28 h-28 rounded-full object-cover shadow-md border-2 border-white dark:border-[#202c33]"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] gap-1">
                <Camera className="w-5 h-5" />
                <span>Upload PC Photo</span>
              </div>
            </div>
            <span
              onClick={() => contactPhotoInputRef.current?.click()}
              className="text-xs text-[#00a884] font-medium mt-2 cursor-pointer hover:underline flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload photo from computer
            </span>
          </div>

          <form onSubmit={handleSaveContact} className="space-y-4 max-w-md mx-auto">
            {/* Name */}
            <div className="bg-white dark:bg-[#202c33] p-3.5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <label className="text-xs font-semibold text-[#008069] dark:text-[#00a884] block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#e9edef] focus:outline-none"
                autoFocus
                required
              />
            </div>

            {/* Phone */}
            <div className="bg-white dark:bg-[#202c33] p-3.5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <label className="text-xs font-semibold text-[#008069] dark:text-[#00a884] block mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. +1 (555) 234-5678"
                className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#e9edef] focus:outline-none"
              />
            </div>

            {/* About */}
            <div className="bg-white dark:bg-[#202c33] p-3.5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <label className="text-xs font-semibold text-[#008069] dark:text-[#00a884] block mb-1">
                About / Status
              </label>
              <input
                type="text"
                value={contactAbout}
                onChange={(e) => setContactAbout(e.target.value)}
                placeholder="Status message"
                className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#e9edef] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#00a884] hover:bg-[#008f6f] text-white font-medium py-3 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 mt-6 active:scale-98"
            >
              <Check className="w-5 h-5" />
              <span>Save Contact & Start Chat</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ================= VIEW 3: NEW GROUP (STEP 1: SELECT MEMBERS) =================
  if (view === 'group-step1') {
    const selectedMembers = contacts.filter((c) =>
      selectedMemberIds.includes(c.id)
    );

    return (
      <div className="absolute inset-0 z-40 bg-white dark:bg-[#111b21] flex flex-col font-sans select-none animate-message">
        {/* Header */}
        <div className="h-[108px] bg-[#008069] dark:bg-[#202c33] text-white px-5 pb-4 flex items-end gap-6 shadow">
          <button
            onClick={() => setView('list')}
            className="p-1 hover:bg-black/10 rounded-full transition-colors mb-0.5"
            title="Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-[19px] font-medium leading-none mb-1">Add group participants</h2>
            <span className="text-xs text-white/80">
              {selectedMemberIds.length} of {contacts.length} selected
            </span>
          </div>
        </div>

        {/* Selected Member Chips Bar */}
        {selectedMembers.length > 0 && (
          <div className="p-3 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {selectedMembers.map((m) => (
              <div
                key={m.id}
                className="bg-white dark:bg-[#111b21] rounded-full pl-1 pr-2.5 py-1 flex items-center gap-1.5 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs font-medium text-[#111b21] dark:text-[#e9edef] truncate max-w-[100px]">
                  {m.name}
                </span>
                <button
                  type="button"
                  onClick={() => toggleSelectMember(m.id)}
                  className="text-gray-400 hover:text-red-500 ml-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="p-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg px-3 py-1.5">
            <Search className="w-4 h-4 text-[#8696a0] mr-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contact name"
              className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#e9edef] focus:outline-none"
            />
          </div>
        </div>

        {/* Selectable Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => {
            const isSelected = selectedMemberIds.includes(contact.id);
            return (
              <div
                key={contact.id}
                onClick={() => toggleSelectMember(contact.id)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-50 dark:border-gray-800/40 ${
                  isSelected
                    ? 'bg-[#f0f2f5] dark:bg-[#202c33]'
                    : 'hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]/50'
                }`}
              >
                <div className="relative">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00a884] rounded-full border-2 border-white dark:border-[#111b21] flex items-center justify-center text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[15px] font-normal text-[#111b21] dark:text-[#e9edef] truncate">
                    {contact.name}
                  </h4>
                  <p className="text-xs text-[#667781] dark:text-[#8696a0] truncate">
                    {contact.about || 'Available'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Step Floating Button */}
        {selectedMemberIds.length > 0 && (
          <div className="p-4 flex justify-center bg-white dark:bg-[#111b21] border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setView('group-step2')}
              className="w-14 h-14 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white flex items-center justify-center shadow-xl transition-transform active:scale-95"
              title="Next: Set group name"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ================= VIEW 4: NEW GROUP (STEP 2: NAME & ICON) =================
  if (view === 'group-step2') {
    return (
      <div className="absolute inset-0 z-40 bg-[#f0f2f5] dark:bg-[#111b21] flex flex-col font-sans select-none animate-message">
        <input
          type="file"
          ref={groupPhotoInputRef}
          accept="image/*"
          onChange={handleGroupPhotoUpload}
          className="hidden"
        />

        {/* Header */}
        <div className="h-[108px] bg-[#008069] dark:bg-[#202c33] text-white px-5 pb-4 flex items-end gap-6 shadow">
          <button
            onClick={() => setView('group-step1')}
            className="p-1 hover:bg-black/10 rounded-full transition-colors mb-0.5"
            title="Back to member selection"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-[19px] font-medium leading-none mb-1.5">New group</h2>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          {/* Group Icon with PC Upload */}
          <div
            onClick={() => groupPhotoInputRef.current?.click()}
            className="relative group cursor-pointer my-6"
            title="Click to upload group icon from PC"
          >
            <img
              src={groupAvatar}
              alt="Group Icon"
              className="w-32 h-32 rounded-full object-cover shadow-lg border-2 border-white dark:border-[#202c33]"
            />
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] gap-1 p-2 text-center">
              <Camera className="w-6 h-6" />
              <span>UPLOAD GROUP ICON</span>
            </div>
          </div>
          <span
            onClick={() => groupPhotoInputRef.current?.click()}
            className="text-xs text-[#00a884] font-medium -mt-2 mb-6 cursor-pointer hover:underline flex items-center gap-1"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload icon from computer
          </span>

          {/* Group Subject / Name */}
          <form onSubmit={handleFinishCreateGroup} className="w-full max-w-md space-y-5">
            <div className="bg-white dark:bg-[#202c33] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <label className="text-xs font-semibold text-[#008069] dark:text-[#00a884] block mb-1">
                Group Subject / Name *
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Type group name here"
                maxLength={35}
                className="w-full bg-transparent text-[16px] text-[#111b21] dark:text-[#e9edef] focus:outline-none"
                autoFocus
                required
              />
              <div className="text-right text-[11px] text-[#8696a0] mt-1">
                {groupName.length} / 35
              </div>
            </div>

            {/* Selected Participants Summary */}
            <div className="text-xs text-[#667781] dark:text-[#8696a0] px-2">
              Participants: {selectedMemberIds.length + 1} (including you)
            </div>

            {/* Submit Checkmark Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="w-14 h-14 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white flex items-center justify-center shadow-xl transition-transform active:scale-95"
                title="Create Group"
              >
                <Check className="w-7 h-7 stroke-[3]" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
}

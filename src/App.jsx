import React, { useState, useEffect, useRef } from 'react';
import { initialChats, currentUser as defaultUser, initialStatuses } from './data/mockData';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar/Sidebar';
import { EmptyChatScreen } from './components/Chat/EmptyChatScreen';
import { ChatHeader } from './components/Chat/ChatHeader';
import { MessageArea } from './components/Chat/MessageArea';
import { ChatFooter } from './components/Chat/ChatFooter';
import { StatusViewerModal } from './components/Modals/StatusViewerModal';
import { ProfileDrawer } from './components/Modals/ProfileDrawer';
import { ContactInfoDrawer } from './components/Modals/ContactInfoDrawer';
import { NewChatModal } from './components/Modals/NewChatModal';
import { CallModal } from './components/Modals/CallModal';
import { apiService, localDB } from './services/api';

// Subtle Web Audio tone generator for native WhatsApp sounds
function playAudioTone(type = 'send') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'send') {
      // Crisp outgoing 'pop/blip'
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else {
      // Pleasant double incoming chime
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.setValueAtTime(680, ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (e) {
    // Audio context may require user interaction first
  }
}

export default function App() {
  // ── Auth State — persists across reloads ─────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const session = localDB.loadSession();
    return session?.loggedIn === true;
  });

  // Theme State (Dark mode by default or saved preference)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('wa_dark_mode') === 'true';
  });

  // ── Main Data States — ALL load from localStorage first ──
  const [chats, setChats] = useState(() => {
    const cached = localDB.loadChats();
    return cached?.length > 0 ? cached : initialChats;
  });
  const [selectedChatId, setSelectedChatId] = useState(() => {
    return localDB.loadSelectedChat() || null;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    return localDB.loadUser() || defaultUser;
  });
  const [statuses, setStatuses] = useState(() => {
    const cached = localDB.loadStatuses();
    return cached?.length > 0 ? cached : initialStatuses;
  });
  const [typingChatIds, setTypingChatIds] = useState([]);

  // Modals & Drawers States
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [activeCall, setActiveCall] = useState(null); // { contact, type: 'voice' | 'video' }
  const [replyingTo, setReplyingTo] = useState(null);

  // ── Profile Update — saves name, about, avatar (picture), phone ──
  const handleUpdateProfile = (updated) => {
    setCurrentUser((prev) => {
      const next = { ...prev, ...updated };
      localDB.saveUser(next);        // persists avatar/name/about
      apiService.updateProfile(next); // sync to MySQL if online
      return next;
    });
  };

  // ── Auto-save ALL chats (messages, pin, unread, avatars) ─
  useEffect(() => {
    localDB.saveChats(chats);
  }, [chats]);

  // ── Auto-save statuses/stories ────────────────────────────
  useEffect(() => {
    localDB.saveStatuses(statuses);
  }, [statuses]);

  // ── Persist selected chat across reloads ──────────────────
  useEffect(() => {
    localDB.saveSelectedChat(selectedChatId);
  }, [selectedChatId]);

  // ── Load fresh data from MySQL on mount (if server online) ─
  useEffect(() => {
    apiService.getChats().then((data) => {
      if (data?.status === 'success' && data.chats?.length > 0) {
        if (data.source === 'mysql') {
          // MySQL is live — use its data as source of truth
          setChats(data.chats);
          if (data.statuses?.length > 0) setStatuses(data.statuses);
          if (data.currentUser) {
            setCurrentUser(data.currentUser);
            localDB.saveUser(data.currentUser);
          }
        }
        // if source === 'localStorage', state already has it from useState init
      }
    });
  }, []);

  // Sync dark mode class with root html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('wa_dark_mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const activeChat = chats.find((c) => c.id === selectedChatId) || null;

  // Handler: Selecting a chat from the sidebar
  const handleSelectChat = (chat) => {
    setSelectedChatId(chat.id);
    setShowContactInfo(false);

    // Reset unread counter and mark incoming messages as read
    setChats((prevChats) =>
      prevChats.map((c) => {
        if (c.id === chat.id) {
          return {
            ...c,
            unreadCount: 0,
            messages: c.messages.map((m) =>
              m.senderId !== 'me' ? { ...m, status: 'read' } : m
            )
          };
        }
        return c;
      })
    );
  };

  // Handler: Send a new message
  const handleSendMessage = (text) => {
    if (!selectedChatId) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newMsgId = 'msg-' + Date.now();
    const newMessage = {
      id: newMsgId,
      senderId: 'me',
      text,
      timestamp: currentTime,
      date: 'Today',
      status: 'sent' // begins with sent (single tick)
    };

    playAudioTone('send');

    // 1. Append message to chat
    setChats((prevChats) =>
      prevChats.map((c) => {
        if (c.id === selectedChatId) {
          return {
            ...c,
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );

    // Save user message to Laragon MySQL database
    apiService.sendMessage({
      id: newMsgId,
      chat_id: selectedChatId,
      sender_id: 'me',
      sender_name: currentUser.name,
      text,
      type: 'text',
      status: 'read',
      timestamp: currentTime,
      date: 'Today'
    });

    setReplyingTo(null);

    // 2. Progression to double tick (delivered) after 400ms
    setTimeout(() => {
      setChats((prevChats) =>
        prevChats.map((c) => {
          if (c.id === selectedChatId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === newMsgId ? { ...m, status: 'delivered' } : m
              )
            };
          }
          return c;
        })
      );
    }, 500);

    // 3. Progression to double blue tick (read) after 1000ms
    setTimeout(() => {
      setChats((prevChats) =>
        prevChats.map((c) => {
          if (c.id === selectedChatId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === newMsgId ? { ...m, status: 'read' } : m
              )
            };
          }
          return c;
        })
      );
    }, 1100);

    // 4. Contact starts typing after 1.5s
    const currentChat = chats.find((c) => c.id === selectedChatId);
    setTimeout(() => {
      setTypingChatIds((prev) => [...new Set([...prev, selectedChatId])]);
    }, 1600);

    // 5. Automatic mock reply from contact 2.5 - 3.2s after sending
    setTimeout(() => {
      setTypingChatIds((prev) => prev.filter((id) => id !== selectedChatId));

      let replyText = 'Thanks for your message! Got it. 👍';
      if (currentChat && currentChat.replies && currentChat.replies.length > 0) {
        const randomIndex = Math.floor(Math.random() * currentChat.replies.length);
        replyText = currentChat.replies[randomIndex];
      }

      const replyMsgId = 'reply-' + Date.now();
      const replyMessage = {
        id: replyMsgId,
        senderId: currentChat.id,
        senderName: currentChat.name,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        date: 'Today',
        status: 'read'
      };

      playAudioTone('receive');

      setChats((prevChats) =>
        prevChats.map((c) => {
          if (c.id === selectedChatId) {
            return {
              ...c,
              messages: [...c.messages, replyMessage]
            };
          }
          return c;
        })
      );
    }, 3000);
  };

  // Handler: Send media (voice note, image, document)
  const handleSendMedia = (mediaData) => {
    if (!selectedChatId) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newMsg = {
      id: 'media-' + Date.now(),
      senderId: 'me',
      timestamp: currentTime,
      date: 'Today',
      status: 'read',
      ...mediaData
    };

    playAudioTone('send');

    setChats((prevChats) =>
      prevChats.map((c) => {
        if (c.id === selectedChatId) {
          return {
            ...c,
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );

    // Save media message to Laragon MySQL
    apiService.sendMessage({
      id: newMsg.id,
      chat_id: selectedChatId,
      sender_id: 'me',
      sender_name: currentUser.name,
      type: mediaData.type || 'text',
      media_url: mediaData.mediaUrl || null,
      file_name: mediaData.fileName || null,
      file_size: mediaData.fileSize || null,
      duration: mediaData.duration || null,
      caption: mediaData.caption || null,
      status: 'read',
      timestamp: currentTime,
      date: 'Today'
    });

    // Simulate realistic contact reply to the received media/file
    const currentChat = chats.find((c) => c.id === selectedChatId);
    if (currentChat) {
      setTimeout(() => {
        setTypingChatIds((prev) => [...new Set([...prev, selectedChatId])]);
      }, 1400);

      setTimeout(() => {
        setTypingChatIds((prev) => prev.filter((id) => id !== selectedChatId));

        let replyText = 'Received your file! Looks great! 👍';
        if (mediaData.type === 'image') {
          replyText = 'Awesome photo! Thanks for sharing 📸';
        } else if (mediaData.type === 'document') {
          replyText = `Downloaded "${mediaData.fileName || 'document'}". Reviewing it now! 📄`;
        } else if (mediaData.type === 'voice') {
          replyText = 'Listened to your audio note! Got it loud and clear 🎙️';
        }

        const replyMsgId = 'reply-' + Date.now();
        const replyMessage = {
          id: replyMsgId,
          senderId: currentChat.id,
          senderName: currentChat.name,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          date: 'Today',
          status: 'read'
        };

        playAudioTone('receive');

        setChats((prevChats) =>
          prevChats.map((c) => {
            if (c.id === selectedChatId) {
              return {
                ...c,
                messages: [...c.messages, replyMessage]
              };
            }
            return c;
          })
        );
      }, 3000);
    }
  };

  // Handler: React to a message
  const handleReactToMessage = (messageId, emoji) => {
    if (!selectedChatId) return;

    setChats((prevChats) =>
      prevChats.map((c) => {
        if (c.id === selectedChatId) {
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === messageId
                ? { ...m, reaction: m.reaction === emoji ? null : emoji }
                : m
            )
          };
        }
        return c;
      })
    );
  };

  // Handler: Delete single message
  const handleDeleteMessage = (messageId) => {
    if (!selectedChatId) return;

    setChats((prevChats) =>
      prevChats.map((c) => {
        if (c.id === selectedChatId) {
          return {
            ...c,
            messages: c.messages.filter((m) => m.id !== messageId)
          };
        }
        return c;
      })
    );
  };

  // Handler: Clear all messages in chat
  const handleClearChat = (chatId) => {
    if (window.confirm('Are you sure you want to clear all messages in this chat?')) {
      setChats((prevChats) =>
        prevChats.map((c) => (c.id === chatId ? { ...c, messages: [] } : c))
      );
    }
  };

  // Handler: Delete chat completely
  const handleDeleteChat = (chatId) => {
    if (window.confirm('Delete this chat?')) {
      setChats((prevChats) => prevChats.filter((c) => c.id !== chatId));
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
      }
    }
  };

  // Handler: Pin/Unpin chat
  const handlePinToggle = (chatId) => {
    setChats((prevChats) =>
      prevChats.map((c) =>
        c.id === chatId ? { ...c, pinned: !c.pinned } : c
      )
    );
  };

  // Handler: Start video or voice call
  const handleStartCall = (type) => {
    if (!activeChat) return;
    setActiveCall({ contact: activeChat, type });
  };

  // If not logged in, show WhatsApp QR Login screen
  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={(staySignedIn = true) => {
          localDB.saveSession(staySignedIn); // save auth session
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#eae6df] dark:bg-[#0c1317] flex justify-center items-center font-sans antialiased">
      {/* WhatsApp Web Classic Green Background Top Banner (on large desktop) */}
      <div className="fixed top-0 left-0 w-full h-[127px] bg-[#00a884] dark:bg-[#202c33] z-0 hidden lg:block" />

      {/* Main WhatsApp App Container */}
      <div className="relative z-10 w-full h-full lg:h-[calc(100vh-38px)] lg:max-w-[1600px] lg:my-auto bg-white dark:bg-[#111b21] shadow-2xl flex overflow-hidden lg:rounded-none">
        {/* LEFT PANEL: Sidebar */}
        <div
          className={`h-full relative transition-all ${
            selectedChatId
              ? 'hidden md:flex md:w-[400px] lg:w-[440px] xl:w-[480px]'
              : 'w-full'
          }`}
        >
          <Sidebar
            currentUser={currentUser}
            chats={chats}
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
            onOpenProfile={() => setShowProfileDrawer(true)}
            onOpenStatus={() => setShowStatusModal(true)}
            onNewChat={() => setShowNewChatModal(true)}
            onLogout={() => {
              localDB.logout();         // remove auth session
              setIsAuthenticated(false);
              setSelectedChatId(null);
              localDB.saveSelectedChat(null);
            }}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            hasUnreadStories={statuses.some((s) => !s.viewed && !s.isUser)}
            typingChatIds={typingChatIds}
            onPinToggle={handlePinToggle}
            onDeleteChat={handleDeleteChat}
          />

          {/* Profile Left Drawer */}
          {showProfileDrawer && (
            <ProfileDrawer
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
              onClose={() => setShowProfileDrawer(false)}
            />
          )}

          {/* New Chat Left Drawer */}
          {showNewChatModal && (
            <NewChatModal
              contacts={chats}
              currentUser={currentUser}
              onSelectContact={(contact) => {
                const existing = chats.find((c) => c.id === contact.id);
                if (!existing) {
                  setChats((prev) => [contact, ...prev]);
                }
                setSelectedChatId(contact.id);
                setShowNewChatModal(false);
              }}
              onAddNewContact={(newContact) => {
                setChats((prev) => [newContact, ...prev]);
                setSelectedChatId(newContact.id);
                setShowNewChatModal(false);
                apiService.createChat({
                  id: newContact.id,
                  name: newContact.name,
                  phone: newContact.phone,
                  about: newContact.about,
                  avatar: newContact.avatar,
                  is_group: 0
                });
              }}
              onCreateGroup={(newGroup) => {
                setChats((prev) => [newGroup, ...prev]);
                setSelectedChatId(newGroup.id);
                setShowNewChatModal(false);
                apiService.createChat({
                  id: newGroup.id,
                  name: newGroup.name,
                  avatar: newGroup.avatar,
                  members: newGroup.members,
                  is_group: 1
                });
              }}
              onClose={() => setShowNewChatModal(false)}
            />
          )}
        </div>

        {/* RIGHT PANEL: Active Chat or Empty Screen */}
        <div
          className={`h-full flex-1 flex transition-all ${
            !selectedChatId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeChat ? (
            <div className="flex-1 h-full flex flex-col relative min-w-0">
              {/* Header */}
              <ChatHeader
                activeChat={activeChat}
                isTyping={typingChatIds.includes(activeChat.id)}
                onBack={() => setSelectedChatId(null)}
                onOpenContactInfo={() => setShowContactInfo(!showContactInfo)}
                onStartCall={handleStartCall}
                onClearChat={handleClearChat}
                onDeleteChat={handleDeleteChat}
                onCloseChat={() => setSelectedChatId(null)}
              />

              {/* Message scroll area */}
              <MessageArea
                activeChat={activeChat}
                onReact={handleReactToMessage}
                onDeleteMessage={handleDeleteMessage}
                onReply={(msg) => setReplyingTo(msg)}
              />

              {/* Footer text input bar */}
              <ChatFooter
                onSendMessage={handleSendMessage}
                onSendMedia={handleSendMedia}
                replyingTo={replyingTo}
                onCancelReply={() => setReplyingTo(null)}
              />
            </div>
          ) : (
            <EmptyChatScreen onOpenNewChat={() => setShowNewChatModal(true)} />
          )}

          {/* Contact Details Right Drawer */}
          {activeChat && showContactInfo && (
            <ContactInfoDrawer
              activeChat={activeChat}
              onClose={() => setShowContactInfo(false)}
              onClearChat={handleClearChat}
              onDeleteChat={handleDeleteChat}
            />
          )}
        </div>
      </div>

      {/* Global Status/Stories Viewer Modal */}
      {showStatusModal && (
        <StatusViewerModal
          statuses={statuses}
          initialStatusIndex={1}
          onClose={() => setShowStatusModal(false)}
        />
      )}

      {/* Audio / Video Calling Modal */}
      {activeCall && (
        <CallModal
          contact={activeCall.contact}
          type={activeCall.type}
          onClose={() => setActiveCall(null)}
        />
      )}
    </div>
  );
}

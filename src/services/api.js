// ==========================================================
// WhatsApp Web - Complete Persistence Layer
// Senior Backend Developer Implementation
// ALL data persists across sessions:
// - Login session (stay signed in)
// - Profile: name, about, avatar (picture), phone
// - All chats with avatars, pin, unread count
// - All messages (text, media, voice, reactions)
// - Statuses / Stories
// - Dark mode preference
// - Selected chat (last open)
// ==========================================================

const API_BASE = 'http://localhost/watsapp/api';

// ── Storage Keys ────────────────────────────────────────────
const KEYS = {
  AUTH:          'wa_auth_session',      // login session
  USER:          'wa_user_profile',      // full user profile + avatar
  CHATS:         'wa_chats_data',        // chats + messages
  STATUSES:      'wa_statuses_data',     // stories/statuses
  DARK_MODE:     'wa_dark_mode',
  SELECTED_CHAT: 'wa_selected_chat',
};

// ── Helpers ──────────────────────────────────────────────────
function lsGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('[LocalDB] Storage full or blocked:', e);
    return false;
  }
}

function lsDel(key) {
  try { localStorage.removeItem(key); } catch {}
}

// ── LocalDB Public API ───────────────────────────────────────
export const localDB = {
  // ── Auth Session ──────────────────────────────────────────
  saveSession(staySignedIn = true) {
    lsSet(KEYS.AUTH, {
      loggedIn: true,
      staySignedIn,
      timestamp: Date.now(),
    });
  },

  loadSession() {
    const s = lsGet(KEYS.AUTH);
    if (!s || !s.loggedIn) return null;
    // If not "stay signed in", expire after browser close
    // We simulate this by a 24h limit if staySignedIn=false
    if (!s.staySignedIn) {
      const hoursSince = (Date.now() - s.timestamp) / 3600000;
      if (hoursSince > 8) { // 8 hours max without staySignedIn
        lsDel(KEYS.AUTH);
        return null;
      }
    }
    return s;
  },

  clearSession() {
    lsDel(KEYS.AUTH);
  },

  // ── User Profile ──────────────────────────────────────────
  saveUser(user) {
    lsSet(KEYS.USER, user);
  },

  loadUser() {
    return lsGet(KEYS.USER);
  },

  // ── Chats (includes messages inside each chat) ────────────
  saveChats(chats) {
    lsSet(KEYS.CHATS, chats);
  },

  loadChats() {
    return lsGet(KEYS.CHATS);
  },

  // ── Statuses / Stories ────────────────────────────────────
  saveStatuses(statuses) {
    lsSet(KEYS.STATUSES, statuses);
  },

  loadStatuses() {
    return lsGet(KEYS.STATUSES);
  },

  // ── Selected Chat ─────────────────────────────────────────
  saveSelectedChat(chatId) {
    lsSet(KEYS.SELECTED_CHAT, chatId);
  },

  loadSelectedChat() {
    return lsGet(KEYS.SELECTED_CHAT);
  },

  // ── Full Logout: clears everything ────────────────────────
  logout() {
    lsDel(KEYS.AUTH);
    // Keep chats/user data so it reloads after next login
    // but clear session marker
    console.log('[LocalDB] Session cleared on logout');
  },

  // ── Hard Reset (clear ALL app data) ──────────────────────
  hardReset() {
    Object.values(KEYS).forEach(lsDel);
    console.log('[LocalDB] All app data cleared');
  },
};

// ── Server Health Check ──────────────────────────────────────
let _serverOnline = null;

async function isServerOnline() {
  if (_serverOnline !== null) return _serverOnline;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch(`${API_BASE}/test_db.php`, { signal: ctrl.signal });
    clearTimeout(timer);
    const json = await res.json();
    _serverOnline = json?.db_status?.includes('Connected') ?? false;
  } catch {
    _serverOnline = false;
  }
  console.log(`[API] Server ${_serverOnline ? '✅ Online (MySQL)' : '📦 Offline (localStorage mode)'}`);
  return _serverOnline;
}

// Reset cache every 30s so it retries
setInterval(() => { _serverOnline = null; }, 30000);

// ── Main API Service ─────────────────────────────────────────
export const apiService = {
  // 1. Load all data: chats, user, statuses
  async getChats() {
    const online = await isServerOnline();

    if (online) {
      try {
        const res = await fetch(`${API_BASE}/get_chats.php`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data?.status === 'success') {
          // Cache to localStorage
          if (data.chats?.length)    localDB.saveChats(data.chats);
          if (data.statuses?.length) localDB.saveStatuses(data.statuses);
          if (data.currentUser)      localDB.saveUser(data.currentUser);
          console.log('[API] ✅ Loaded from MySQL');
          return { ...data, source: 'mysql' };
        }
      } catch (err) {
        console.warn('[API] MySQL fetch failed, falling back:', err);
      }
    }

    // Offline: use localStorage
    const chats    = localDB.loadChats();
    const user     = localDB.loadUser();
    const statuses = localDB.loadStatuses();

    if (chats?.length > 0) {
      console.log('[API] 📦 Loaded from localStorage');
      return {
        status: 'success',
        source: 'localStorage',
        chats,
        currentUser: user,
        statuses: statuses || [],
      };
    }

    console.log('[API] ⚠️ No persisted data found — will use mockData');
    return null;
  },

  // 2. Send message
  async sendMessage(messageData) {
    const online = await isServerOnline();
    if (online) {
      try {
        const res = await fetch(`${API_BASE}/send_message.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messageData),
        });
        const json = await res.json();
        if (json?.status === 'success') return json;
      } catch (err) {
        console.warn('[API] sendMessage MySQL failed:', err);
      }
    }
    // localStorage handled automatically via chats auto-save in App.jsx
    return { status: 'localStorage' };
  },

  // 3. Create chat/contact/group
  async createChat(chatData) {
    const online = await isServerOnline();
    if (online) {
      try {
        const res = await fetch(`${API_BASE}/create_chat.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(chatData),
        });
        const json = await res.json();
        if (json?.status === 'success') return json;
      } catch (err) {
        console.warn('[API] createChat MySQL failed:', err);
      }
    }
    return { status: 'localStorage' };
  },

  // 4. Update user profile (name, about, avatar, phone)
  async updateProfile(profileData) {
    const online = await isServerOnline();
    if (online) {
      try {
        const res = await fetch(`${API_BASE}/update_profile.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileData),
        });
        const json = await res.json();
        if (json?.status === 'success') {
          console.log('[API] ✅ Profile updated in MySQL');
          return json;
        }
      } catch (err) {
        console.warn('[API] updateProfile MySQL failed:', err);
      }
    }
    // Profile already saved in localDB by App.jsx handleUpdateProfile
    console.log('[API] 📦 Profile saved in localStorage');
    return { status: 'localStorage' };
  },

  async isOnline() {
    return await isServerOnline();
  },
};

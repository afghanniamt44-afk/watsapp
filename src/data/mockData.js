export const currentUser = {
  id: 'me',
  name: 'Alex Vance',
  phone: '+1 (555) 349-8201',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  about: 'Available | Building cool things with React 🚀',
};

export const initialStatuses = [
  {
    id: 'status-my',
    userName: 'My status',
    time: 'Tap to add status update',
    avatar: currentUser.avatar,
    isUser: true,
    viewed: false,
    stories: []
  },
  {
    id: 'status-1',
    userName: 'Sarah Chen',
    time: '35 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    viewed: false,
    stories: [
      {
        id: 'story-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        caption: 'Morning vibes by the coast 🌊☀️',
        time: '35 minutes ago'
      },
      {
        id: 'story-2',
        type: 'text',
        text: '“Design is not just what it looks like and feels like. Design is how it works.” — Steve Jobs',
        bgColor: '#00a884',
        time: '15 minutes ago'
      }
    ]
  },
  {
    id: 'status-2',
    userName: 'Marcus Vance',
    time: '2 hours ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    viewed: false,
    stories: [
      {
        id: 'story-3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
        caption: 'Hike to the summit was worth every step! 🏔️✨',
        time: '2 hours ago'
      }
    ]
  },
  {
    id: 'status-3',
    userName: 'Elena Rostova',
    time: 'Today at 7:15 AM',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    viewed: true,
    stories: [
      {
        id: 'story-4',
        type: 'text',
        text: 'Coffee first, then let us change the world ☕💻',
        bgColor: '#7b1fa2',
        time: 'Today at 7:15 AM'
      }
    ]
  }
];

export const initialChats = [
  {
    id: 'chat-sarah',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-5678',
    about: 'Design Lead @ Stripe | Coffee Enthusiast ☕',
    isGroup: false,
    status: 'online',
    pinned: true,
    unreadCount: 1,
    lastSeen: 'online',
    messages: [
      {
        id: 'm1',
        senderId: 'chat-sarah',
        text: 'Hey Alex! Did you get a chance to review the new design prototypes for the web app?',
        timestamp: '10:14 AM',
        date: 'Today',
        status: 'read'
      },
      {
        id: 'm2',
        senderId: 'me',
        text: 'Yes! I just took a deep dive into the Figma files. The dual-panel layout and the subtle animations look super clean! 🎨',
        timestamp: '10:18 AM',
        date: 'Today',
        status: 'read'
      },
      {
        id: 'm3',
        senderId: 'chat-sarah',
        text: 'Awesome! We want to make sure the micro-interactions feel completely native, especially on hover and message delivery.',
        timestamp: '10:22 AM',
        date: 'Today',
        status: 'read'
      },
      {
        id: 'm4',
        senderId: 'me',
        text: 'Already implemented! Added single tick, double tick, and double blue ticks for read receipts, plus realistic auto-reply simulations. 🔥',
        timestamp: '10:26 AM',
        date: 'Today',
        status: 'read'
      },
      {
        id: 'm5',
        senderId: 'chat-sarah',
        text: 'That is incredible! Could you test sending another message so we can verify the dynamic reply sequence?',
        timestamp: '10:30 AM',
        date: 'Today',
        status: 'read'
      }
    ],
    replies: [
      "I love how fast this interface responds! Instant delivery is key 🚀",
      "That sounds like a great plan! Let me run that by the design squad.",
      "Just saw your message. Looks super sharp! 👍",
      "Let's sync up on a quick call this afternoon if you're free!",
      "Perfect! The typography and color palette match WhatsApp exactly."
    ]
  },
  {
    id: 'chat-team',
    name: 'Frontend Wizards 🧙‍♂️',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    about: 'Group for frontend architecture, UI polish, and coffee memes ☕',
    isGroup: true,
    members: 'Sarah Chen, David Miller, Priya Patel, Michael, You',
    pinned: true,
    unreadCount: 2,
    status: 'David, Priya, Sarah...',
    lastSeen: 'group',
    messages: [
      {
        id: 'tm1',
        senderId: 'david',
        senderName: 'David Miller',
        text: 'Who is optimizing the virtualized list for the chat history?',
        timestamp: '09:45 AM',
        date: 'Today',
        status: 'read'
      },
      {
        id: 'tm2',
        senderId: 'priya',
        senderName: 'Priya Patel',
        text: 'I just pushed the scroll-to-bottom anchor and smooth auto-scroll. 60 FPS verified! ⚡',
        timestamp: '09:50 AM',
        date: 'Today',
        status: 'read'
      },
      {
        id: 'tm3',
        senderId: 'me',
        text: 'Great job Priya! I also verified the responsive sidebar toggle on tablet viewports.',
        timestamp: '09:55 AM',
        date: 'Today',
        status: 'read'
      },
      {
        id: 'tm4',
        senderId: 'david',
        senderName: 'David Miller',
        text: 'Don\'t forget our weekly team sync at 11:30 AM today everyone! 📅',
        timestamp: '10:12 AM',
        date: 'Today',
        status: 'delivered'
      }
    ],
    replies: [
      "David: I'll prepare the demo screen share for standup!",
      "Priya: Testing the build on Safari and Chrome right now 🚀",
      "Sarah: The light/dark mode switch is looking so crisp!"
    ]
  },
  {
    id: 'chat-mom',
    name: 'Mom ❤️',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 987-6543',
    about: 'Family first ❤️ Plant lover 🌿',
    isGroup: false,
    status: 'last seen today at 09:30 AM',
    pinned: false,
    unreadCount: 0,
    lastSeen: 'today at 09:30 AM',
    messages: [
      {
        id: 'mm1',
        senderId: 'chat-mom',
        text: 'Good morning sweetheart! Hope you have a wonderful and productive day ❤️',
        timestamp: '08:15 AM',
        date: 'Today',
        status: 'read'
      },
      {
        id: 'mm2',
        senderId: 'me',
        text: 'Morning Mom! Doing great, having coffee and coding! ☕',
        timestamp: '08:20 AM',
        date: 'Today',
        status: 'read'
      },
      {
        id: 'mm3',
        senderId: 'chat-mom',
        text: 'Remember to stretch and drink enough water! Are you still coming over for Sunday dinner? I will make your favorite lasagna.',
        timestamp: '08:24 AM',
        date: 'Today',
        status: 'read'
      },
      {
        id: 'mm4',
        senderId: 'me',
        text: '100%! Wouldn\'t miss your lasagna for anything in the world! 😋',
        timestamp: '08:25 AM',
        date: 'Today',
        status: 'read'
      },
      {
        id: 'mm5',
        senderId: 'chat-mom',
        text: 'I\'ll bake that apple pie too! See you this weekend! Love you lots! 🥧',
        timestamp: '08:26 AM',
        date: 'Today',
        status: 'read'
      }
    ],
    replies: [
      "Love you too Mom! ❤️",
      "Don't worry about me, eating well and staying hydrated!",
      "Can't wait to see you and Dad this weekend!"
    ]
  },
  {
    id: 'chat-marcus',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 432-8765',
    about: 'Adventure photographer | Chasing golden hour 📸',
    isGroup: false,
    status: 'online',
    pinned: false,
    unreadCount: 0,
    lastSeen: 'online',
    messages: [
      {
        id: 'mv1',
        senderId: 'chat-marcus',
        text: 'Hey Alex! Check out this panoramic drone shot from our weekend hike!',
        timestamp: 'Yesterday',
        date: 'Yesterday',
        status: 'read'
      },
      {
        id: 'mv2',
        senderId: 'chat-marcus',
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
        caption: 'Sunset over Mount Rainier at 6,400 ft altitude 🏔️🌅',
        timestamp: '5:40 PM',
        date: 'Yesterday',
        status: 'read'
      },
      {
        id: 'mv3',
        senderId: 'me',
        text: 'Man, that lighting is surreal! What shutter speed did you shoot at?',
        timestamp: '5:45 PM',
        date: 'Yesterday',
        status: 'read'
      },
      {
        id: 'mv4',
        senderId: 'chat-marcus',
        text: '1/500s at f/4.0, ISO 100 on the Hasselblad sensor. Turned out pristine without any noise.',
        timestamp: '5:50 PM',
        date: 'Yesterday',
        status: 'read'
      }
    ],
    replies: [
      "Let's definitely go on another shoot next weekend! 📸",
      "I'm exporting the RAW files now, I'll send you the high-res link.",
      "The colors are so vibrant! Nature at its best."
    ]
  },
  {
    id: 'chat-elena',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 765-4321',
    about: 'Product VP | Tech Speaker | Traveler ✈️',
    isGroup: false,
    status: 'last seen yesterday at 11:15 PM',
    pinned: false,
    unreadCount: 0,
    lastSeen: 'yesterday at 11:15 PM',
    messages: [
      {
        id: 'er1',
        senderId: 'chat-elena',
        type: 'voice',
        duration: '0:28',
        timestamp: 'Yesterday',
        date: 'Yesterday',
        status: 'read'
      },
      {
        id: 'er2',
        senderId: 'me',
        text: 'Listened to your audio note! The board approved the product timeline for Q1. All lights are green! 🚦',
        timestamp: '7:10 PM',
        date: 'Yesterday',
        status: 'read'
      },
      {
        id: 'er3',
        senderId: 'chat-elena',
        text: 'Outstanding news! You and the team knocked it out of the park. Thank you for the hard work!',
        timestamp: '7:15 PM',
        date: 'Yesterday',
        status: 'read'
      }
    ],
    replies: [
      "Let me prepare the stakeholder summary slide.",
      "We should celebrate after the release! 🎉",
      "Thanks Elena! Excited for what's coming next."
    ]
  },
  {
    id: 'chat-tech',
    name: 'Tech Insiders ⚡',
    avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80',
    about: 'Breaking tech news, AI developments, and developer tools',
    isGroup: true,
    members: '1,420 members',
    pinned: false,
    unreadCount: 5,
    status: 'Tech news bulletin',
    lastSeen: 'group',
    messages: [
      {
        id: 'ti1',
        senderId: 'mod',
        senderName: 'TechBot',
        text: '🚀 Breaking: Next generation AI models show massive gains in reasoning and tool usage benchmark suites!',
        timestamp: 'Yesterday',
        date: 'Yesterday',
        status: 'read'
      },
      {
        id: 'ti2',
        senderId: 'jordan',
        senderName: 'Jordan K.',
        text: 'The speed of development in the AI space right now is honestly mind-blowing.',
        timestamp: 'Yesterday',
        date: 'Yesterday',
        status: 'read'
      }
    ],
    replies: [
      "Alex: Absolutely! Developer tooling has leveled up 10x.",
      "Jordan: Can't wait to test this out in our production pipeline."
    ]
  },
  {
    id: 'chat-david',
    name: 'David Miller',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 890-1234',
    about: 'Fullstack Dev | Runner 🏃‍♂️ | Vinyl Records 🎵',
    isGroup: false,
    status: 'last seen Tuesday at 4:18 PM',
    pinned: false,
    unreadCount: 0,
    lastSeen: 'Tuesday at 4:18 PM',
    messages: [
      {
        id: 'dm1',
        senderId: 'chat-david',
        text: 'Hey Alex, are we still meeting up for coffee tomorrow afternoon?',
        timestamp: 'Tuesday',
        date: 'October 21',
        status: 'read'
      },
      {
        id: 'dm2',
        senderId: 'me',
        text: 'Yes sir! 2:30 PM at the usual spot on 4th Street. See you there!',
        timestamp: 'Tuesday',
        date: 'October 21',
        status: 'read'
      }
    ],
    replies: [
      "Sounds like a plan! Bringing my notebook.",
      "See you then man! 👍"
    ]
  }
];

export const quickEmojiList = [
  '😀', '😂', '😍', '🥳', '🔥', '👍', '❤️', '🎉',
  '🙌', '🚀', '💯', '✨', '👏', '😎', '🤩', '☕',
  '💡', '🤔', '🙏', '⚡', '💪', '🍕', '🎯', '🥑'
];

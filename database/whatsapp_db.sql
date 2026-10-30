-- ==========================================================
-- WhatsApp Web Clone - Database Schema & Seed Data
-- Database Name: watsapp
-- Compatible with MySQL 5.7+ / 8.0+ / MariaDB (Laragon)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `watsapp` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `watsapp`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `message_reactions`;
DROP TABLE IF EXISTS `messages`;
DROP TABLE IF EXISTS `chat_participants`;
DROP TABLE IF EXISTS `chats`;
DROP TABLE IF EXISTS `statuses`;
DROP TABLE IF EXISTS `contacts`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users Table
CREATE TABLE `users` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `email` VARCHAR(100) NULL,
  `avatar` LONGTEXT NULL,
  `about` VARCHAR(255) DEFAULT 'Hey there! I am using WhatsApp.',
  `status` ENUM('online', 'offline', 'away') DEFAULT 'online',
  `last_seen` VARCHAR(50) DEFAULT 'online',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Chats Table
CREATE TABLE `chats` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `avatar` LONGTEXT NULL,
  `is_group` TINYINT(1) DEFAULT 0,
  `about` VARCHAR(255) NULL,
  `members` TEXT NULL,
  `phone` VARCHAR(30) NULL,
  `status` VARCHAR(50) DEFAULT 'offline',
  `last_seen` VARCHAR(50) DEFAULT 'offline',
  `pinned` TINYINT(1) DEFAULT 0,
  `unread_count` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Messages Table
CREATE TABLE `messages` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `chat_id` VARCHAR(50) NOT NULL,
  `sender_id` VARCHAR(50) NOT NULL,
  `sender_name` VARCHAR(100) NULL,
  `type` ENUM('text', 'image', 'voice', 'document', 'system') DEFAULT 'text',
  `text` TEXT NULL,
  `media_url` LONGTEXT NULL,
  `file_name` VARCHAR(255) NULL,
  `file_size` VARCHAR(50) NULL,
  `duration` VARCHAR(20) NULL,
  `caption` TEXT NULL,
  `status` ENUM('sent', 'delivered', 'read') DEFAULT 'read',
  `reaction` VARCHAR(20) NULL,
  `reply_to_id` VARCHAR(50) NULL,
  `timestamp` VARCHAR(20) NOT NULL,
  `date` VARCHAR(30) DEFAULT 'Today',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Statuses / Stories Table
CREATE TABLE `statuses` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `user_name` VARCHAR(100) NOT NULL,
  `user_avatar` LONGTEXT NULL,
  `type` ENUM('image', 'text') DEFAULT 'image',
  `url` LONGTEXT NULL,
  `text` TEXT NULL,
  `bg_color` VARCHAR(20) DEFAULT '#00a884',
  `caption` VARCHAR(255) NULL,
  `time` VARCHAR(50) NOT NULL,
  `viewed` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Contacts Table
CREATE TABLE `contacts` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `avatar` LONGTEXT NULL,
  `about` VARCHAR(255) DEFAULT 'Available',
  `is_group` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- SEED DATA
-- ==========================================================

-- Current User (You)
INSERT INTO `users` (`id`, `name`, `phone`, `email`, `avatar`, `about`, `status`, `last_seen`) VALUES
('me', 'Alex Vance', '+1 (555) 349-8201', 'alex.vance@example.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'Available | Building cool things 🚀', 'online', 'online');

-- Chats Seed
INSERT INTO `chats` (`id`, `name`, `avatar`, `is_group`, `about`, `members`, `phone`, `status`, `last_seen`, `pinned`, `unread_count`) VALUES
('chat-sarah', 'Sarah Chen', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 0, 'Design Lead @ Stripe | Coffee Enthusiast ☕', NULL, '+1 (555) 234-5678', 'online', 'online', 1, 1),
('chat-team', 'Frontend Wizards 🧙‍♂️', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80', 1, 'Group for frontend architecture, UI polish, and coffee memes ☕', 'Sarah Chen, David Miller, Priya Patel, Michael, You', NULL, 'David, Priya, Sarah...', 'group', 1, 2),
('chat-mom', 'Mom ❤️', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 0, 'Family first ❤️ Plant lover 🌿', NULL, '+1 (555) 987-6543', 'last seen today at 09:30 AM', 'today at 09:30 AM', 0, 0),
('chat-marcus', 'Marcus Vance', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 0, 'Adventure photographer | Chasing golden hour 📸', NULL, '+1 (555) 432-8765', 'online', 'online', 0, 0),
('chat-elena', 'Elena Rostova', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 0, 'Product VP | Tech Speaker | Traveler ✈️', NULL, '+1 (555) 765-4321', 'last seen yesterday at 11:15 PM', 'yesterday at 11:15 PM', 0, 0),
('chat-tech', 'Tech Insiders ⚡', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80', 1, 'Breaking tech news, AI developments, and developer tools', '1,420 members', NULL, 'Tech news bulletin', 'group', 0, 5),
('chat-david', 'David Miller', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 0, 'Fullstack Dev | Runner 🏃‍♂️ | Vinyl Records 🎵', NULL, '+1 (555) 890-1234', 'last seen Tuesday at 4:18 PM', 'Tuesday at 4:18 PM', 0, 0);

-- Messages Seed
INSERT INTO `messages` (`id`, `chat_id`, `sender_id`, `sender_name`, `type`, `text`, `media_url`, `file_name`, `file_size`, `duration`, `caption`, `status`, `reaction`, `timestamp`, `date`) VALUES
('m1', 'chat-sarah', 'chat-sarah', 'Sarah Chen', 'text', 'Hey Alex! Did you get a chance to review the new design prototypes for the web app?', NULL, NULL, NULL, NULL, NULL, 'read', NULL, '10:14 AM', 'Today'),
('m2', 'chat-sarah', 'me', 'You', 'text', 'Yes! I just took a deep dive into the Figma files. The dual-panel layout and the subtle animations look super clean! 🎨', NULL, NULL, NULL, NULL, NULL, 'read', '❤️', '10:18 AM', 'Today'),
('m3', 'chat-sarah', 'chat-sarah', 'Sarah Chen', 'text', 'Awesome! We want to make sure the micro-interactions feel completely native, especially on hover and message delivery.', NULL, NULL, NULL, NULL, NULL, 'read', NULL, '10:22 AM', 'Today'),
('m4', 'chat-sarah', 'me', 'You', 'text', 'Already implemented! Added single tick, double tick, and double blue ticks for read receipts, plus realistic auto-reply simulations. 🔥', NULL, NULL, NULL, NULL, NULL, 'read', '🔥', '10:26 AM', 'Today'),
('m5', 'chat-sarah', 'chat-sarah', 'Sarah Chen', 'text', 'That is incredible! Could you test sending another message so we can verify the dynamic reply sequence?', NULL, NULL, NULL, NULL, NULL, 'read', NULL, '10:30 AM', 'Today'),

('tm1', 'chat-team', 'david', 'David Miller', 'text', 'Who is optimizing the virtualized list for the chat history?', NULL, NULL, NULL, NULL, NULL, 'read', NULL, '09:45 AM', 'Today'),
('tm2', 'chat-team', 'priya', 'Priya Patel', 'text', 'I just pushed the scroll-to-bottom anchor and smooth auto-scroll. 60 FPS verified! ⚡', NULL, NULL, NULL, NULL, NULL, 'read', '🚀', '09:50 AM', 'Today'),
('tm3', 'chat-team', 'me', 'You', 'text', 'Great job Priya! I also verified the responsive sidebar toggle on tablet viewports.', NULL, NULL, NULL, NULL, NULL, 'read', NULL, '09:55 AM', 'Today'),
('tm4', 'chat-team', 'david', 'David Miller', 'text', 'Don\'t forget our weekly team sync at 11:30 AM today everyone! 📅', NULL, NULL, NULL, NULL, NULL, 'delivered', NULL, '10:12 AM', 'Today'),

('mm1', 'chat-mom', 'chat-mom', 'Mom', 'text', 'Good morning sweetheart! Hope you have a wonderful and productive day ❤️', NULL, NULL, NULL, NULL, NULL, 'read', NULL, '08:15 AM', 'Today'),
('mm2', 'chat-mom', 'me', 'You', 'text', 'Morning Mom! Doing great, having coffee and coding! ☕', NULL, NULL, NULL, NULL, NULL, 'read', NULL, '08:20 AM', 'Today'),
('mm3', 'chat-mom', 'chat-mom', 'Mom', 'text', 'Remember to stretch and drink enough water! Are you still coming over for Sunday dinner? I will make your favorite lasagna.', NULL, NULL, NULL, NULL, NULL, 'read', NULL, '08:24 AM', 'Today'),
('mm4', 'chat-mom', 'me', 'You', 'text', '100%! Wouldn\'t miss your lasagna for anything in the world! 😋', NULL, NULL, NULL, NULL, NULL, 'read', NULL, '08:25 AM', 'Today'),
('mm5', 'chat-mom', 'chat-mom', 'Mom', 'text', 'I\'ll bake that apple pie too! See you this weekend! Love you lots! 🥧', NULL, NULL, NULL, NULL, NULL, 'read', '❤️', '08:26 AM', 'Today'),

('mv1', 'chat-marcus', 'chat-marcus', 'Marcus', 'text', 'Hey Alex! Check out this panoramic drone shot from our weekend hike!', NULL, NULL, NULL, NULL, NULL, 'read', NULL, 'Yesterday', 'Yesterday'),
('mv2', 'chat-marcus', 'chat-marcus', 'Marcus', 'image', NULL, 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80', NULL, NULL, NULL, 'Sunset over Mount Rainier at 6,400 ft altitude 🏔️🌅', 'read', '👍', '5:40 PM', 'Yesterday'),
('mv3', 'chat-marcus', 'me', 'You', 'text', 'Man, that lighting is surreal! What shutter speed did you shoot at?', NULL, NULL, NULL, NULL, NULL, 'read', NULL, '5:45 PM', 'Yesterday'),
('mv4', 'chat-marcus', 'chat-marcus', 'Marcus', 'text', '1/500s at f/4.0, ISO 100 on the Hasselblad sensor. Turned out pristine without any noise.', NULL, NULL, NULL, NULL, NULL, 'read', NULL, '5:50 PM', 'Yesterday'),

('er1', 'chat-elena', 'chat-elena', 'Elena', 'voice', NULL, NULL, NULL, NULL, '0:28', NULL, 'read', NULL, 'Yesterday', 'Yesterday'),
('er2', 'chat-elena', 'me', 'You', 'text', 'Listened to your audio note! The board approved the product timeline for Q1. All lights are green! 🚦', NULL, NULL, NULL, NULL, NULL, 'read', NULL, '7:10 PM', 'Yesterday'),
('er3', 'chat-elena', 'chat-elena', 'Elena', 'text', 'Outstanding news! You and the team knocked it out of the park. Thank you for the hard work!', NULL, NULL, NULL, NULL, NULL, 'read', '👏', '7:15 PM', 'Yesterday');

-- Stories / Statuses Seed
INSERT INTO `statuses` (`id`, `user_id`, `user_name`, `user_avatar`, `type`, `url`, `text`, `bg_color`, `caption`, `time`, `viewed`) VALUES
('st1', 'chat-sarah', 'Sarah Chen', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'image', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', NULL, '#00a884', 'Morning vibes by the coast 🌊☀️', '35 minutes ago', 0),
('st2', 'chat-marcus', 'Marcus Vance', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'image', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80', NULL, '#00a884', 'Hike to the summit was worth every step! 🏔️✨', '2 hours ago', 0),
('st3', 'chat-elena', 'Elena Rostova', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'text', NULL, 'Coffee first, then let us change the world ☕💻', '#7b1fa2', NULL, 'Today at 7:15 AM', 1);

-- Contacts Seed
INSERT INTO `contacts` (`id`, `name`, `phone`, `avatar`, `about`, `is_group`) VALUES
('chat-sarah', 'Sarah Chen', '+1 (555) 234-5678', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'Design Lead @ Stripe | Coffee Enthusiast ☕', 0),
('chat-team', 'Frontend Wizards 🧙‍♂️', NULL, 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80', 'Group for frontend architecture', 1),
('chat-mom', 'Mom ❤️', '+1 (555) 987-6543', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'Family first ❤️ Plant lover 🌿', 0),
('chat-marcus', 'Marcus Vance', '+1 (555) 432-8765', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'Adventure photographer | Chasing golden hour 📸', 0),
('chat-elena', 'Elena Rostova', '+1 (555) 765-4321', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'Product VP | Tech Speaker ✈️', 0),
('chat-david', 'David Miller', '+1 (555) 890-1234', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'Fullstack Dev | Runner 🏃‍♂️', 0);

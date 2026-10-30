# WhatsApp Web - Laragon MySQL Database

The database for this application is built and connected to Laragon MySQL.

### Database Details:
* **Host**: `localhost` (or `127.0.0.1`)
* **Port**: `3306`
* **Database Name**: `watsapp`
* **Username**: `root`
* **Password**: ` ` (empty by default in Laragon)

### SQL File:
* Schema & Seed SQL: [`c:\laragon\www\watsapp\database\whatsapp_db.sql`](./whatsapp_db.sql)

### Tables in Database:
1. `users` — Stores your profile information (Name, phone, avatar, about, status, last seen).
2. `chats` — Stores all 1-on-1 and Group chats with pin status, unread counts, and member lists.
3. `messages` — Stores all sent and received messages (text, image, voice note, document, reaction ticks).
4. `statuses` — Stories/Status updates (images and text with captions and timestamps).
5. `contacts` — Contacts list for quick search and starting new conversations.

### API Endpoints (`c:\laragon\www\watsapp\api/`):
* `get_chats.php` — Fetches chats and message histories from MySQL.
* `send_message.php` — Inserts new messages into MySQL.
* `create_chat.php` — Creates new contacts and groups in MySQL.
* `update_profile.php` — Updates user profile in MySQL.
* `upload.php` — Saves uploaded photos and files to `uploads/`.

### Viewing in phpMyAdmin / HeidiSQL:
1. In Laragon, click **Database** or open [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
2. Select database `watsapp`.
3. All tables and real-time records are visible here.

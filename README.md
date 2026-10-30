# 💬 WhatsApp Web Clone

A fully responsive **WhatsApp Web Clone** built with React, Vite, Tailwind CSS, and a PHP backend. This project replicates the core UI and functionality of WhatsApp Web.

---

## 🚀 Live Preview

> Run locally using the steps below.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Icons | Lucide React |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Backend | PHP (REST API) |
| Database | MySQL |

---

## ✨ Features

- 🔐 Login Screen
- 💬 Real-time Chat UI (Message bubbles, timestamps, read receipts)
- 📎 Media Preview Modal (images, video, audio)
- 😊 Emoji Picker
- 📞 Call Modal (Voice & Video)
- 👤 Profile Drawer & Contact Info Drawer
- 🔍 Chat Search Bar
- 🗂️ Chat Filter Tabs (All, Unread, Groups)
- 📊 Status Viewer Modal
- ➕ New Chat Modal
- 🌙 WhatsApp-style dark/light green theme

---

## 📁 Project Structure

```
watsapp/
├── api/                    # PHP Backend APIs
│   ├── db.php              # Database connection
│   ├── create_chat.php     # Create a new chat
│   ├── get_chats.php       # Fetch all chats
│   ├── send_message.php    # Send a message
│   ├── update_profile.php  # Update user profile
│   └── upload.php          # File upload handler
├── database/
│   └── whatsapp_db.sql     # MySQL database schema
├── src/
│   ├── components/
│   │   ├── Chat/           # Chat area components
│   │   ├── Sidebar/        # Sidebar components
│   │   ├── Modals/         # Modal components
│   │   └── LoginScreen.jsx
│   ├── data/
│   │   └── mockData.js     # Mock/demo data
│   ├── services/
│   │   └── api.js          # API service layer
│   ├── utils/
│   │   └── audioUtils.js   # Audio utilities
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [PHP](https://www.php.net/) (v8+) with MySQL (e.g., via [Laragon](https://laragon.org/) or XAMPP)

### 1. Clone the Repository

```bash
git clone https://github.com/afghanniamt44-afk/watsapp.git
cd watsapp
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Setup the Database

1. Open **phpMyAdmin** or your MySQL client.
2. Create a new database (e.g., `whatsapp_db`).
3. Import `database/whatsapp_db.sql`.

### 4. Configure Backend

Edit `api/db.php` and update your database credentials:

```php
$host = 'localhost';
$db   = 'whatsapp_db';
$user = 'root';
$pass = '';
```

### 5. Run the Frontend

```bash
npm run dev
```

Open your browser at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

---

## 📸 Screenshots

> *(Add screenshots of your app here)*

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**afghanniamt44-afk**  
GitHub: [@afghanniamt44-afk](https://github.com/afghanniamt44-afk)

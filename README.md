
# 🧠 Local AI Chatbot (ChatGPT-style App using Ollama)

This project is a full-stack, local ChatGPT-style chat application using a lightweight LLM (Gemma via [Ollama](https://ollama.com)).

---

## 🚀 Features

- Chat interface with streaming AI responses
- Sidebar with chat history & titles
- New Chat, Retry, Rename, and Delete support
- Auto-title from first user message
- Typing indicator during generation
- Stop response via button or `Esc` key
- Local inference via **Ollama + gemma3**

---

## 🧱 Tech Stack

| Layer     | Stack                          |
|-----------|--------------------------------|
| Frontend  | Next.js + Tailwind CSS |
| Backend   | Node.js + Express.js           |
| ORM       | Prisma                         |
| Database  | PostgreSQL         |
| AI Model  | Ollama (gemma3)                |

---

## 📂 Folder Structure

```
repo/
├── frontend/       # Next.js frontend
├── backend/        # Node.js + Express + Prisma backend
```

---

## 🔧 Setup Instructions

### 1. Install Ollama and Model

> Requires ~4–6GB RAM

```bash
# Install Ollama
https://ollama.com/download

# Pull model (gemma3 in this case)
ollama pull gemma3
```

> Test it locally:
```bash
ollama run gemma3
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env
# or manually create .env with:
# DATABASE_URL="connection-string"

# Set up Prisma DB (SQLite or PostgreSQL)
npx prisma migrate dev --name init
npx prisma generate

# Start the backend server
npm run dev
```

> API runs at: `http://localhost:3001/api/...`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start frontend (Next.js)
npm run dev
```

> App runs at: `http://localhost:3000`

---

## 🌐 API Endpoints Summary

| Method | Endpoint                         | Purpose                      |
|--------|----------------------------------|------------------------------|
| POST   | `/api/chat`                      | Create new chat              |
| POST   | `/api/chat/:chatId/message`      | Send user message + stream reply |
| GET    | `/api/chats`                     | Get list of past chats       |
| GET    | `/api/chat/:chatId`              | Get full chat history        |
| PATCH  | `/api/chat/:chatId/title`        | Rename chat title            |
| DELETE | `/api/chat/:chatId`              | Delete a chat                |
| POST   | `/api/chat/:chatId/stop`         | Interrupt assistant response |

---

## 🧪 Keyboard Shortcuts

- `Enter` → Send message  
- `Escape` → Stop AI response generation

---

## 📸 Screenshots

### Welcome Page
![Welcome Page](/screenshots/Home.png?raw=true "Welcome Page")

### Chat Page
![Chat Page](/screenshots/Chat.png?raw=true "Chat Page")

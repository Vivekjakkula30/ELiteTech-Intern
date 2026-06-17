# 🎨 Real-Time Whiteboard Collaboration App

A real-time collaborative whiteboard application built using **React, Node.js, Socket.IO, and MongoDB**.
This project allows multiple users to join the same room, draw together live, and save whiteboard history.

## 🚀 Features

* 🖊️ Real-time drawing synchronization
* 👥 Multi-user collaboration
* 🏠 Room-based whiteboards
* 👤 Username support
* 📢 Join notifications
* 🎨 Color picker
* 🧽 Eraser tool
* 📏 Brush size control
* 🗑️ Clear board functionality
* 💾 Whiteboard history saved in MongoDB
* 📂 Download whiteboard as image
* 🔄 Auto-load saved drawings after refresh

---

## 🛠️ Tech Stack

### Frontend

* React.js
* CSS
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO
* MongoDB
* Mongoose

---

## 📂 Project Structure

```bash
Task-3-whiteboard-app/
│── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Whiteboard.jsx
│   │   ├── Whiteboard.css
│
│── server/
│   ├── models/
│   │   ├── Whiteboard.js
│   ├── server.js
```

---

## ⚙️ Installation

### Clone repository

```bash
git clone https://github.com/your-username/Task-3-whiteboard-app.git
cd Task-3-whiteboard-app
```

---

### Setup frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

### Setup backend

```bash
cd server
npm install
node server.js
```

Backend runs on:

```bash
http://localhost:5000
```

---

### Start MongoDB

Make sure MongoDB service is running locally:

```bash
mongodb://127.0.0.1:27017/whiteboard
```

---

## 🎯 How It Works

1. Enter username and room ID
2. Join whiteboard room
3. Draw in real-time with others
4. Data gets stored in MongoDB
5. Refresh and continue from saved board

---

## 🔮 Future Improvements

* Mobile touch support
* Undo/Redo feature
* Chat inside whiteboard
* Export as PDF
* Authentication system

---

## 👨‍💻 Author

**Vivek Tirupathi Jakkula**

ELiteTech Internship Task 3

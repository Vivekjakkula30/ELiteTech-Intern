const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const Message = require("./models/Message");

const app = express();
connectDB();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let onlineUsers = [];

app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_chat", (username) => {
    onlineUsers = onlineUsers.filter(
      (user) => user.username !== username
    );

    onlineUsers.push({
      id: socket.id,
      username,
    });

    io.emit("online_users", onlineUsers);
  });

  socket.on("typing", (username) => {
    socket.broadcast.emit("show_typing", `${username} is typing...`);
  });

  socket.on("send_message", async (data) => {
    try {
      const newMessage = new Message(data);
      await newMessage.save();

      socket.broadcast.emit("receive_message", data);
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(
      (user) => user.id !== socket.id
    );

    io.emit("online_users", onlineUsers);

    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server started on port 5000");
});
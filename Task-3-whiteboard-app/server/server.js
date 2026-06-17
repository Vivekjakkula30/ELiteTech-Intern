const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const Whiteboard = require("./models/Whiteboard");

const app = express();

app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/whiteboard")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", async ({ room, username }) => {
    socket.join(room);

    // Notify others only
    socket.broadcast.to(room).emit(
      "userJoined",
      `${username} joined ${room}`
    );

    let board = await Whiteboard.findOne({ room });

    if (!board) {
      board = new Whiteboard({
        room,
        username,
        strokes: [],
      });

      await board.save();
    }

    socket.emit("loadBoard", board.strokes);
  });

  socket.on("drawing", async ({ room, stroke }) => {
    socket.to(room).emit("drawing", stroke);

    let board = await Whiteboard.findOne({ room });

    if (!board) return;

    board.strokes.push(stroke);

    await board.save();
  });

  socket.on("clearBoard", async (room) => {
    io.to(room).emit("clearBoard");

    await Whiteboard.deleteOne({ room });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
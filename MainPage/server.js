const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // React tətbiqinizin ünvanı
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("sendMessage", ({ teamId, message }) => {
    io.emit("receiveMessage", { teamId, message });
  });

  socket.on("typing", ({ teamId, userId }) => {
    socket.broadcast.emit("userTyping", { teamId, userId });
  });

  socket.on("stopTyping", ({ teamId, userId }) => {
    socket.broadcast.emit("userStoppedTyping", { teamId, userId });
  });

  socket.on("editMessage", ({ teamId, messageId, newText }) => {
    io.emit("messageEdited", { teamId, messageId, newText });
  });

  socket.on("deleteMessage", ({ teamId, messageId }) => {
    io.emit("messageDeleted", { teamId, messageId });
  });

  socket.on("addReaction", ({ teamId, messageId, userId, reaction }) => {
    io.emit("reactionAdded", { teamId, messageId, userId, reaction });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

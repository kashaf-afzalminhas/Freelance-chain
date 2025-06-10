const { Server } = require("socket.io");
const socketHandler = require("../services/socketHandler");
const notificationService = require("../services/notificationService");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 New Socket Connected:", socket.id);

    // Handle user joining
    socket.on('join', (userId) => {
      console.log(`User ${userId} joined with socket ${socket.id}`);
      notificationService.addOnlineUser(userId, socket.id);
    });

    socket.on('disconnect', () => {
      console.log("🔴 Socket Disconnected:", socket.id);
      // Find and remove the user associated with this socket
      const userId = Array.from(notificationService.getOnlineUsers().entries())
        .find(([_, socketId]) => socketId === socket.id)?.[0];
      if (userId) {
        notificationService.removeOnlineUser(userId);
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    socketHandler(io, socket);
  });

  return io;
};

module.exports = initSocket;

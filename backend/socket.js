const socketIO = require('socket.io');
const notificationService = require('./services/notificationService');

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173", // Your frontend URL
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"]
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle user joining
    socket.on('join', (userId) => {
      if (!userId) {
        console.warn('Join event received without userId');
        return;
      }
      console.log(`User ${userId} joined with socket ${socket.id}`);
      notificationService.addOnlineUser(userId, socket.id);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      try {
        // Find and remove the user associated with this socket
        const onlineUsers = notificationService.getOnlineUsers();
        if (onlineUsers) {
          for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
              notificationService.removeOnlineUser(userId);
              break;
            }
          }
        }
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO
}; 
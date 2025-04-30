const { Server } = require("socket.io");
const socketHandler = require("../services/socketHandler");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Or specify frontend origin
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 New Socket Connected:", socket.id);
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    socketHandler(io, socket);
  });
};

module.exports = initSocket;

import { io } from 'socket.io-client';

let socket = null;

// Initialize socket connection
export const initSocket = (userId) => {
  if (socket) {
    console.warn('Socket already initialized');
    return socket;
  }

  console.log('Initializing socket connection for user:', userId);
  socket = io('http://localhost:5000', {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('Socket connected successfully');
    socket.emit('join', userId);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initSocket first.');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log('Socket disconnected');
    socket = null;
  }
};

export const sendSocketMessage = (senderId, receiverId, text, conversationId) => {
  if (!socket) {
    throw new Error('Socket not initialized');
  }
  
  socket.emit('sendMessage', {
    senderId,
    receiverId,
    text,
    conversationId,
  });
};

export default {
  initSocket,
  getSocket,
  disconnectSocket,
  sendSocketMessage,
};

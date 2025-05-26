import { io } from 'socket.io-client';

let socket = null;

// Initialize socket connection
export const initSocket = (userId) => {
  if (socket) {
    console.warn('Socket already initialized');
    return socket;
  }

  console.log('Initializing socket connection for user:', userId);
  
  // Create socket with more robust configuration
  socket = io('http://localhost:5000', {
    transports: ['websocket', 'polling'], // Allow both websocket and polling
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity, // Keep trying to reconnect
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    withCredentials: true, // Important for CORS
    extraHeaders: {
      'Access-Control-Allow-Origin': '*'
    }
  });

  // Connection event handlers
  socket.on('connect', () => {
    console.log('Socket connected successfully');
    if (userId) {
      socket.emit('join', userId);
    }
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    // Try to reconnect with polling if websocket fails
    if (socket.io.opts.transports[0] === 'websocket') {
      console.log('Falling back to polling transport');
      socket.io.opts.transports = ['polling', 'websocket'];
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      // Server initiated disconnect, try to reconnect
      socket.connect();
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.warn('Socket not initialized. Initializing with default configuration...');
    return initSocket();
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
  const currentSocket = getSocket();
  if (!currentSocket.connected) {
    console.warn('Socket not connected. Attempting to reconnect...');
    currentSocket.connect();
  }
  
  currentSocket.emit('sendMessage', {
    senderId,
    receiverId,
    text,
    conversationId,
  });
};

// Add a function to check socket connection status
export const isSocketConnected = () => {
  return socket && socket.connected;
};

export default {
  initSocket,
  getSocket,
  disconnectSocket,
  sendSocketMessage,
  isSocketConnected
};

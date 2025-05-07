// const Message = require("../models/message");
// const Conversation = require("../models/Conversation");

// const users = new Map(); // userId => socketId

// const socketHandler = (io, socket) => {
//   // Save user connection
//   socket.on("join", (userId) => {
//     users.set(userId, socket.id);
//     console.log(`User ${userId} connected: ${socket.id}`);
//   });

//   // Send message event
//   socket.on("sendMessage", async ({ senderId, receiverId, text, conversationId }) => {
//     try {
//       const newMessage = new Message({
//         senderId,
//         text,
//         conversationId,
//       });

//       const savedMessage = await newMessage.save();

//       // Update conversation's last message
//       await Conversation.findByIdAndUpdate(conversationId, {
//         lastMessage: text,
//         updatedAt: new Date(),
//       });

//       // Emit to receiver if online
//       const receiverSocketId = users.get(receiverId);
//       if (receiverSocketId) {
//         io.to(receiverSocketId).emit("getMessage", {
//           ...savedMessage.toObject(),
//           isReceiver: true
//         });
//       }

//       // Emit to sender with different flag
//       const senderSocketId = users.get(senderId);
//       if (senderSocketId) {
//         io.to(senderSocketId).emit("getMessage", {
//           ...savedMessage.toObject(),
//           isSender: true
//         });
//       }
//     } catch (error) {
//       console.error("Error saving message:", error);
//     }
//   });

//   // Disconnect user
//   socket.on("disconnect", () => {
//     for (let [userId, socketId] of users.entries()) {
//       if (socketId === socket.id) {
//         users.delete(userId);
//         console.log(`User ${userId} disconnected`);
//         break;
//       }
//     }
//   });
// };

// module.exports = socketHandler;

const Message = require("../models/message");
const Conversation = require("../models/Conversation");

const users = new Map(); // userId => socketId

const socketHandler = (io, socket) => {
  // Save user connection
  socket.on("join", (userId) => {
    users.set(userId, socket.id);
    console.log(`User ${userId} connected: ${socket.id}`);
  });

  // Send message event
  socket.on("sendMessage", async ({ senderId, receiverId, text, conversationId }) => {
    try {
      // Emit to receiver if online
      const receiverSocketId = users.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("getMessage", {
          conversationId,
          senderId,
          text,
          createdAt: new Date(),
          isReceiver: true
        });
      }

      // Emit to sender with different flag
      const senderSocketId = users.get(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("getMessage", {
          conversationId,
          senderId,
          text,
          createdAt: new Date(),
          isSender: true
        });
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  // Disconnect user
  socket.on("disconnect", () => {
    for (let [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
};

module.exports = socketHandler;


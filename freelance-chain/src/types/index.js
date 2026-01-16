// User
class User {
    constructor(_id, username, email, profilePicture = null, status = null, lastActive = null) {
      this._id = _id;
      this.username = username;
      this.email = email;
      this.profilePicture = profilePicture;
     this.status = status;  // 'online' | 'offline' | 'away'
      this.lastActive = lastActive;
    }
  }
  
  // Message
  class Message {
    constructor(_id, conversationId, senderId, text, createdAt, updatedAt, read = null ) {
      this._id = _id;
      this.conversationId = conversationId;
      this.senderId = senderId;
      this.text = text;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.read = read;  // Optional boolean
    }
  }
  
  // Conversation
  class Conversation {
    constructor(_id, members, createdAt, updatedAt, lastMessage = null, unreadCount = null) {
      this._id = _id;
      this.members = members;  // Array of member IDs
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.lastMessage = lastMessage;
      this.unreadCount = unreadCount;  // Optional number
    }
  }
  
  // ConversationWithUser extends Conversation and includes a user object
  class ConversationWithUser extends Conversation {
    constructor(_id, members, createdAt, updatedAt, lastMessage = null, unreadCount = null, user) {
      super(_id, members, createdAt, updatedAt, lastMessage, unreadCount);
      this.user = user;  // User object
    }
  }
  
  export { User, Message, Conversation, ConversationWithUser };
  
import React from 'react';

const OnlineUsers = ({ onlineUsers }) => {
  return (
    <div className="online-users">
      <h3>Online Users</h3>
      <ul>
        {onlineUsers.map(user => (
          <li key={user._id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;


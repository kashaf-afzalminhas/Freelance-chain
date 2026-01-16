import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../AuthContext';

const Homepage = () => {
  const { currentUser, setChatWithUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch all users from the backend
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Welcome, {currentUser.name}</h1>
      <h2>Select a user to chat with:</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <button onClick={() => setChatWithUser(user)}>{user.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Homepage;
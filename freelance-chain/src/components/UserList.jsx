
import React, { useEffect, useState } from 'react';
import UserCard from './UserCard';
import SearchBar from './SearchBar';
import { getAllUsers, searchUsers } from '../services/api';

const UsersList = ({ currentUserId, onSelectUser, selectedUserId }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getAllUsers();
        const usersData = response.data.filter(user => user._id !== currentUserId);

        const usersWithStatus = usersData.map(user => ({
          ...user,
          status: Math.random() > 0.5 ? 'online' : 'offline',
        }));

        setUsers(usersWithStatus);
        setFilteredUsers(usersWithStatus);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUserId) {
      fetchUsers();
    }
  }, [currentUserId]);

  const handleSearch = async (query) => {
    if (!query) {
      setFilteredUsers(showOnlineOnly ? users.filter(user => user.status === 'online') : users);
      return;
    }

    try {
      const response = await searchUsers(query);
      let searchResults = response.data.filter(user => user._id !== currentUserId);

      if (showOnlineOnly) {
        searchResults = searchResults.filter(user => user.status === 'online');
      }

      setFilteredUsers(searchResults);
    } catch (error) {
      console.error('Error searching users:', error);
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(showOnlineOnly ? filtered.filter(user => user.status === 'online') : filtered);
    }
  };

  const toggleOnlineFilter = () => {
    setShowOnlineOnly(!showOnlineOnly);
    if (!showOnlineOnly) {
      setFilteredUsers(users.filter(user => user.status === 'online'));
    } else {
      setFilteredUsers(users);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-4">
      <h2 className="text-lg font-semibold mb-4">Users</h2>

      <SearchBar
        onSearch={handleSearch}
        placeholder="Search users..."
        className="mb-3"
      />

      <div className="flex items-center mb-3">
        <input
          type="checkbox"
          id="online-only"
          checked={showOnlineOnly}
          onChange={toggleOnlineFilter}
          className="mr-2"
        />
        <label htmlFor="online-only" className="text-sm">Show online only</label>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            <p>No users found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map(user => (
              <UserCard
                key={user._id}
                user={user}
                selected={selectedUserId === user._id}
                onClick={() => onSelectUser?.(user)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;


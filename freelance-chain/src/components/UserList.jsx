
// import React, { useEffect, useState } from 'react';
// import UserCard from './UserCard';
// import SearchBar from './SearchBar';
// import { getAllUsers, searchUsers } from '../services/api';

// const UsersList = ({ currentUserId, onSelectUser, selectedUserId }) => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showOnlineOnly, setShowOnlineOnly] = useState(false);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setIsLoading(true);
//         const response = await getAllUsers();
//         const usersData = response.data.filter(user => user._id !== currentUserId);

//         const usersWithStatus = usersData.map(user => ({
//           ...user,
//           status: Math.random() > 0.5 ? 'online' : 'offline',
//         }));

//         setUsers(usersWithStatus);
//         setFilteredUsers(usersWithStatus);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (currentUserId) {
//       fetchUsers();
//     }
//   }, [currentUserId]);

//   const handleSearch = async (query) => {
//     if (!query) {
//       setFilteredUsers(showOnlineOnly ? users.filter(user => user.status === 'online') : users);
//       return;
//     }

//     try {
//       const response = await searchUsers(query);
//       let searchResults = response.data.filter(user => user._id !== currentUserId);

//       if (showOnlineOnly) {
//         searchResults = searchResults.filter(user => user.status === 'online');
//       }

//       setFilteredUsers(searchResults);
//     } catch (error) {
//       console.error('Error searching users:', error);
//       const filtered = users.filter(user =>
//         user.username.toLowerCase().includes(query.toLowerCase())
//       );
//       setFilteredUsers(showOnlineOnly ? filtered.filter(user => user.status === 'online') : filtered);
//     }
//   };

//   const toggleOnlineFilter = () => {
//     setShowOnlineOnly(!showOnlineOnly);
//     if (!showOnlineOnly) {
//       setFilteredUsers(users.filter(user => user.status === 'online'));
//     } else {
//       setFilteredUsers(users);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full overflow-hidden p-4">
//       <h2 className="text-lg font-semibold mb-4">Users</h2>

//       <SearchBar
//         onSearch={handleSearch}
//         placeholder="Search users..."
//         className="mb-3"
//       />

//       <div className="flex items-center mb-3">
//         <input
//           type="checkbox"
//           id="online-only"
//           checked={showOnlineOnly}
//           onChange={toggleOnlineFilter}
//           className="mr-2"
//         />
//         <label htmlFor="online-only" className="text-sm">Show online only</label>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         {isLoading ? (
//           <div className="flex justify-center items-center h-full">
//             <p>Loading users...</p>
//           </div>
//         ) : filteredUsers.length === 0 ? (
//           <div className="flex justify-center items-center h-full text-gray-500">
//             <p>No users found</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {filteredUsers.map(user => (
//               <UserCard
//                 key={user._id}
//                 user={user}
//                 selected={selectedUserId === user._id}
//                 onClick={() => onSelectUser?.(user)}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UsersList;

import React, { useEffect, useState } from 'react';
import UserCard from './UserCard';
import SearchBar from './SearchBar';
import { getAllUsers, searchUsers } from '../services/api';
import { cn } from '../lib/utils';

const UsersList = ({ currentUserId, onSelectUser, selectedUserId }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getAllUsers();
        const usersData = response.data.filter(user => user._id !== currentUserId);

        const usersWithStatus = usersData.map(user => ({
          ...user,
          status: Math.random() > 0.5 ? 'online' : 'offline',
          lastSeen: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
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
    setSearchQuery(query);
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
        (user.name && user.name.toLowerCase().includes(query.toLowerCase())) ||
        (user.username && user.username.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredUsers(showOnlineOnly ? filtered.filter(user => user.status === 'online') : filtered);
    }
  };

  const toggleOnlineFilter = () => {
    const newValue = !showOnlineOnly;
    setShowOnlineOnly(newValue);
    if (newValue) {
      setFilteredUsers(
        searchQuery 
          ? users.filter(user => 
              user.status === 'online' && 
              ((user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())))
            )
          : users.filter(user => user.status === 'online')
      );
    } else {
      setFilteredUsers(
        searchQuery 
          ? users.filter(user => 
              (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase()))
            )
          : users
      );
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-heading font-bold text-accent mb-3">All Users</h2>
        
        {/* Search and filter */}
        <div className="flex flex-col space-y-3">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by name or username..."
            className="w-full"
          />

          <div className="flex items-center">
            <button
              onClick={toggleOnlineFilter}
              className={cn(
                "flex items-center text-sm font-body transition-colors duration-200",
                showOnlineOnly ? "text-primary" : "text-gray-600 hover:text-gray-800"
              )}
            >
              <span className={cn(
                "w-4 h-4 rounded mr-2 border-2 flex items-center justify-center",
                showOnlineOnly 
                  ? "bg-primary border-primary" 
                  : "bg-white border-gray-400 hover:border-gray-500"
              )}>
                {showOnlineOnly && (
                  <svg className="w-2 h-2 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              Show online only
            </button>
          </div>
        </div>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-3"></div>
            <p className="font-body text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-gray-300 mb-3" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="font-heading text-lg text-gray-600 mb-1">No users found</h3>
            <p className="font-body text-gray-500">
              {searchQuery 
                ? 'Try a different search term' 
                : showOnlineOnly 
                  ? 'No online users available' 
                  : 'No users to display'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredUsers.map(user => (
              <UserCard
                key={user._id}
                user={user}
                selected={selectedUserId === user._id}
                onClick={() => onSelectUser?.(user)}
                timestamp={user.status === 'online' ? 'Online' : `Last seen ${formatLastSeen(user.lastSeen)}`}
                className={cn(
                  "transition-colors duration-200",
                  selectedUserId === user._id 
                    ? "bg-primary/10" 
                    : "hover:bg-gray-50"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format last seen time
function formatLastSeen(timestamp) {
  const now = new Date();
  const lastSeen = new Date(timestamp);
  const diffInHours = (now - lastSeen) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return 'recently';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else {
    return `${Math.floor(diffInHours / 24)}d ago`;
  }
}

export default UsersList;

// import React, { useState, useRef, useEffect } from 'react';
// import { useNotifications } from '../context/NotificationContext';
// import { Link } from 'react-router-dom';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';

// dayjs.extend(relativeTime);

// // Export the NotificationIcon component
// export const NotificationIcon = ({ type }) => {
//   const icons = {
//     message: (
//       <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
//       </svg>
//     ),
//     bid: (
//       <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//       </svg>
//     ),
//     job_hired: (
//       <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//       </svg>
//     ),
//     work_submitted: (
//       <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//       </svg>
//     ),
//     work_approved: (
//       <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//       </svg>
//     )
//   };

//   return icons[type] || icons.message;
// };

// const NotificationBell = () => {
//   const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleNotificationClick = async (notification) => {
//     if (!notification.isRead) {
//       await markAsRead(notification._id);
//     }
//     setIsOpen(false);
//   };

//   const getSenderInfo = (notification) => {
//     if (notification.senderId) {
//       return (
//         <div className="flex items-center space-x-2">
//           {notification.senderId.profileImage ? (
//             <img
//               src={notification.senderId.profileImage}
//               alt={notification.senderId.name}
//               className="w-6 h-6 rounded-full"
//             />
//           ) : (
//             <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
//               <span className="text-xs text-gray-500">
//                 {notification.senderId.name?.charAt(0).toUpperCase()}
//               </span>
//             </div>
//           )}
//           <span className="text-sm font-medium text-gray-900">
//             {notification.senderId.name}
//           </span>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
//       >
//         <svg
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//           />
//         </svg>
//         {unreadCount > 0 && (
//           <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
//           <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//             <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
//             {unreadCount > 0 && (
//               <button
//                 onClick={markAllAsRead}
//                 className="text-sm text-blue-600 hover:text-blue-800"
//               >
//                 Mark all as read
//               </button>
//             )}
//           </div>

//           <div className="max-h-96 overflow-y-auto">
//             {notifications.length === 0 ? (
//               <div className="p-4 text-center text-gray-500">
//                 No notifications
//               </div>
//             ) : (
//               notifications.map((notification) => (
//                 <Link
//                   key={notification._id}
//                   to={notification.link}
//                   onClick={() => handleNotificationClick(notification)}
//                   className={`block p-4 hover:bg-gray-50 border-b border-gray-200 ${
//                     !notification.isRead ? 'bg-blue-50' : ''
//                   }`}
//                 >
//                   <div className="flex items-start space-x-3">
//                     <div className="flex-shrink-0">
//                       <NotificationIcon type={notification.type} />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       {getSenderInfo(notification)}
//                       <p className="text-sm font-medium text-gray-900 mt-1">
//                         {notification.content}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {dayjs(notification.createdAt).fromNow()}
//                       </p>
//                     </div>
//                     {!notification.isRead && (
//                       <div className="flex-shrink-0">
//                         <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
//                       </div>
//                     )}
//                   </div>
//                 </Link>
//               ))
//             )}
//           </div>

//           <div className="p-4 border-t border-gray-200">
//             <Link
//               to="/notifications"
//               className="block text-center text-sm text-blue-600 hover:text-blue-800"
//             >
//               View all notifications
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell; 

import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// Enhanced NotificationIcon component with new color scheme
export const NotificationIcon = ({ type, isRead }) => {
  const iconClasses = "w-5 h-5";
  const baseColor = isRead ? "text-[#6D9773]" : "text-[#FFBA00]";

  const icons = {
    message: (
      <svg className={`${iconClasses} ${baseColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    bid: (
      <svg className={`${iconClasses} ${baseColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    job_hired: (
      <svg className={`${iconClasses} ${baseColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    work_submitted: (
      <svg className={`${iconClasses} ${baseColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    work_approved: (
      <svg className={`${iconClasses} ${baseColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    )
  };

  return icons[type] || icons.message;
};

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    setIsOpen(false);
  };

  const getSenderInfo = (notification) => {
    if (notification.senderId) {
      return (
        <div className="flex items-center space-x-2">
          {notification.senderId.profileImage ? (
            <img
              src={notification.senderId.profileImage}
              alt={notification.senderId.name}
              className="w-6 h-6 rounded-full border border-[#BB8A52] object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#0C3B2E] flex items-center justify-center text-white text-xs font-medium">
              {notification.senderId.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-medium text-[#0C3B2E]">
            {notification.senderId.name}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#0C3B2E] hover:text-[#6D9773] focus:outline-none transition-colors duration-200"
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#FFBA00] rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-lg overflow-hidden z-50 border border-[#e5e7eb]">
          <div className="p-4 border-b border-[#e5e7eb] flex justify-between items-center bg-[#6D9773]">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-[#FFBA00] hover:text-white transition-colors duration-200"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-[#6D9773]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 mx-auto text-[#BB8A52] mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <p className="text-sm">No new notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification._id}
                  to={notification.link}
                  onClick={() => handleNotificationClick(notification)}
                  className={`block p-4 hover:bg-[#f0f7f1] transition-colors duration-150 border-b border-[#e5e7eb] ${
                    !notification.isRead ? 'bg-[#f0f7f1]' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`p-1.5 rounded-lg ${
                        !notification.isRead 
                          ? 'bg-[#FFBA00] bg-opacity-20' 
                          : 'bg-[#6D9773] bg-opacity-10'
                      }`}>
                        <NotificationIcon type={notification.type} isRead={notification.isRead} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      {getSenderInfo(notification)}
                      <p className={`text-sm mt-1 ${
                        !notification.isRead 
                          ? 'font-semibold text-[#0C3B2E]' 
                          : 'text-[#4a5568]'
                      }`}>
                        {notification.content}
                      </p>
                      <p className="text-xs text-[#6D9773] mt-1">
                        {dayjs(notification.createdAt).fromNow()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="flex-shrink-0 mt-1.5">
                        <span className="inline-block w-2 h-2 bg-[#FFBA00] rounded-full" />
                      </div>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="p-3 border-t border-[#e5e7eb] bg-[#f8f9fa]">
            <Link
              to="/notifications"
              className="block text-center text-sm text-[#6D9773] hover:text-[#0C3B2E] font-medium transition-colors duration-200"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
import React, { useState } from 'react';
import { useNotifications } from '../../../context/NotificationContext';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NotificationIcon } from '../../NotificationBell';

dayjs.extend(relativeTime);

const NotificationPage = () => {
  const { notifications, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest'

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
  };

  const getSenderInfo = (notification) => {
    if (notification.senderId && typeof notification.senderId === 'object') {
      return (
        <div className="flex items-center space-x-2">
          {notification.senderId.profileImage ? (
            <img
              src={`http://localhost:5000${notification.senderId.profileImage}`}
              alt={notification.senderId.name || 'User'}
              className="w-8 h-8 rounded-full object-cover border-2 border-[#BB8A52]"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#0C3B2E] flex items-center justify-center text-white font-medium">
              {(notification.senderId.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-medium text-[#0C3B2E]">
            {notification.senderId.name || 'Unknown User'}
          </span>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D9773]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0C3B2E]">Notifications</h1>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-[#6D9773] text-[#0C3B2E] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFBA00] focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-[#6D9773] text-[#0C3B2E] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFBA00] focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-medium text-white bg-[#6D9773] rounded-lg hover:bg-[#0C3B2E] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFBA00] focus:ring-offset-2"
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#e5e7eb]">
        {sortedNotifications.length === 0 ? (
          <div className="p-8 text-center text-[#6D9773]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-[#BB8A52]"
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
            <p className="mt-4 text-lg font-medium">No notifications found</p>
            <p className="mt-1 text-sm">We'll notify you when something arrives</p>
          </div>
        ) : (
          <div className="divide-y divide-[#e5e7eb]">
            {sortedNotifications.map((notification) => (
              <Link
                key={notification._id}
                to={notification.link}
                onClick={() => handleNotificationClick(notification)}
                className={`block p-4 sm:p-6 transition-colors duration-150 ${
                  !notification.isRead 
                    ? 'bg-[#f0f7f1] hover:bg-[#e0efe2]' 
                    : 'hover:bg-[#f9f9f9]'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`p-2 rounded-lg ${
                      !notification.isRead 
                        ? 'bg-[#FFBA00] text-[#0C3B2E]' 
                        : 'bg-[#6D9773] text-white'
                    }`}>
                      <NotificationIcon type={notification.type} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {getSenderInfo(notification)}
                    <p className={`text-sm mt-2 ${
                      !notification.isRead 
                        ? 'font-semibold text-[#0C3B2E]' 
                        : 'text-[#4a5568]'
                    }`}>
                      {notification.content}
                    </p>
                    <p className="mt-2 text-xs text-[#6D9773]">
                      {dayjs(notification.createdAt).fromNow()}
                      <span className="mx-1">•</span>
                      {dayjs(notification.createdAt).format('MMM D, YYYY h:mm A')}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="flex-shrink-0">
                      <span className="inline-block w-3 h-3 bg-[#FFBA00] rounded-full" />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
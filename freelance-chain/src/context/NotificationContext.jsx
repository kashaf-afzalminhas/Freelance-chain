import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { getSocket } from '../services/socket';
import { api } from '../services/api';
import { toast } from 'sonner';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      const response = await api.get('/notifications');
      
      // Check if the response has the expected structure
      if (response.data?.success && response.data?.data?.notifications) {
        const notifications = response.data.data.notifications;
        setNotifications(notifications);
        setUnreadCount(notifications.filter(n => !n.isRead).length);
      } else {
        console.warn('Unexpected notification response structure:', response.data);
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Only show error toast if we're on the notifications page
      if (window.location.pathname.includes('/notifications')) {
        if (error.response?.status === 401) {
          toast.error('Please sign in to view notifications');
        } else {
          toast.error('Failed to fetch notifications');
        }
      }
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      console.log(`Attempting to mark notification as read: ${notificationId}`);
      
      const response = await api.patch(`/notifications/${notificationId}/read`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to mark notification as read');
      }

      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      console.log(`Successfully marked notification as read: ${notificationId}`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error(error.response?.data?.message || 'Failed to mark notification as read');
      // Refresh notifications to ensure UI is in sync
      await fetchNotifications();
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  // Handle new notification
  const handleNewNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Show toast notification
    const senderName = notification.senderId?.name || 'Someone';
    toast.info(notification.content, {
      action: {
        label: 'View',
        onClick: () => window.location.href = notification.link
      }
    });
  };

  // Set up socket listeners
  useEffect(() => {
    if (!currentUser) return;

    const socket = getSocket();
    if (!socket) return;

    socket.on('notification', handleNewNotification);

    return () => {
      socket.off('notification', handleNewNotification);
    };
  }, [currentUser]);

  // Initial fetch
  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider; 
import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ADMIN_WALLET_ADDRESS = '0x1a16d8976a56F7EFcF2C8f861C055badA335fBdc';

const Notifications = () => {
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    type: 'info',
  });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('all');

  useEffect(() => {
    // Fetch users for dropdown
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn("No token found, cannot fetch users for admin notifications.");
          return;
        }
        const res = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` },
          params: { walletAddress: ADMIN_WALLET_ADDRESS }
        });
        setUsers(res.data.data.users || []);
      } catch (err) {
        console.error("Failed to fetch users for admin notifications:", err);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const sendNotificationMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem('token');
      const payload = {
        ...data,
        targetUsers: selectedUser === 'all' ? [] : [selectedUser],
        walletAddress: ADMIN_WALLET_ADDRESS // Ensure walletAddress is always sent in body
      };
      const response = await axios.post(
        'http://localhost:5000/api/admin/notifications',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          params: { // Send walletAddress as query parameter for middleware
            walletAddress: ADMIN_WALLET_ADDRESS
          }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Notification sent successfully');
      setNotification({ title: '', message: '', type: 'info' });
      setSelectedUser('all');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send notification');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!notification.title || !notification.message) {
      toast.error('Title and message are required');
      return;
    }
    sendNotificationMutation.mutate({
      title: notification.title,
      message: notification.message,
      type: notification.type,
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">System Notifications</h1>
        <p className="mt-1 text-sm text-gray-500">
          Send notifications to all users or a selected user on the platform
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Notification Title
              </label>
              <input
                type="text"
                id="title"
                value={notification.title}
                onChange={(e) => setNotification(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                value={notification.message}
                onChange={(e) => setNotification(prev => ({ ...prev, message: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Notification Type
              </label>
              <select
                id="type"
                value={notification.type}
                onChange={(e) => setNotification(prev => ({ ...prev, type: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            <div>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                Send To
              </label>
              <select
                id="user"
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="all">All Users</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>{user.name || user.walletAddress}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sendNotificationMutation.isLoading}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {sendNotificationMutation.isLoading ? 'Sending...' : 'Send Notification'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Notification Preview */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Preview</h2>
        <div className={`p-4 rounded-lg ${
          notification.type === 'info' ? 'bg-blue-50 border border-blue-200' :
          notification.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
          'bg-red-50 border border-red-200'
        }`}>
          <h3 className={`text-lg font-medium ${
            notification.type === 'info' ? 'text-blue-800' :
            notification.type === 'warning' ? 'text-yellow-800' :
            'text-red-800'
          }`}>
            {notification.title || 'Notification Title'}
          </h3>
          <p className={`mt-2 ${
            notification.type === 'info' ? 'text-blue-700' :
            notification.type === 'warning' ? 'text-yellow-700' :
            'text-red-700'
          }`}>
            {notification.message || 'Notification message will appear here...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notifications; 
import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useWeb3 } from '../../context/Web3Context';

const Notifications = () => {
  const { account } = useWeb3();
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
        const token = localStorage.getItem('authToken');
        if (!token || !account) {
          console.warn("No token or account found, cannot fetch users for admin notifications.");
          return;
        }
        const res = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'x-admin-wallet': account.toLowerCase()
          }
        });
        setUsers(res.data.data.users || []);
      } catch (err) {
        console.error("Failed to fetch users for admin notifications:", err);
        setUsers([]);
      }
    };
    fetchUsers();
  }, [account]);

  const sendNotificationMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem('authToken');
      if (!token || !account) {
        throw new Error('No authentication token or wallet address found');
      }
      
      const payload = {
        ...data,
        targetUsers: selectedUser === 'all' ? [] : [selectedUser]
      };

      try {
        const response = await axios.post(
          'http://localhost:5000/api/admin/notifications',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'x-admin-wallet': account.toLowerCase()
            }
          }
        );
        return response.data;
      } catch (error) {
        console.error('Notification error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Notification sent successfully');
      setNotification({ title: '', message: '', type: 'info' });
      setSelectedUser('all');
    },
    onError: (error) => {
      console.error('Notification error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send notification';
      toast.error(errorMessage);
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

  if (!account) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="mt-2 text-gray-600">Please connect your wallet to access admin features</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0C3B2E]">System Notifications</h1>
          <p className="mt-2 text-sm md:text-base text-[#6D9773]">
            Send notifications to all users or a selected user on the platform
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-[#6D9773]/20">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[#0C3B2E] mb-1">
                  Notification Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={notification.title}
                  onChange={(e) => setNotification(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border-[#6D9773]/30 shadow-sm focus:border-[#6D9773] focus:ring-[#6D9773] text-[#0C3B2E] p-3 border transition duration-200"
                  placeholder="Enter notification title"
                  required
                />
              </div>

              {/* Message Textarea */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#0C3B2E] mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={notification.message}
                  onChange={(e) => setNotification(prev => ({ ...prev, message: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border-[#6D9773]/30 shadow-sm focus:border-[#6D9773] focus:ring-[#6D9773] text-[#0C3B2E] p-3 border transition duration-200"
                  placeholder="Enter your notification message"
                  required
                />
              </div>

              {/* Type and User Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notification Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-[#0C3B2E] mb-1">
                    Notification Type
                  </label>
                  <select
                    id="type"
                    value={notification.type}
                    onChange={(e) => setNotification(prev => ({ ...prev, type: e.target.value }))}
                    className="mt-1 block w-full rounded-lg border-[#6D9773]/30 shadow-sm focus:border-[#6D9773] focus:ring-[#6D9773] text-[#0C3B2E] p-3 border transition duration-200 bg-white"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                {/* User Selection */}
                <div>
                  <label htmlFor="user" className="block text-sm font-medium text-[#0C3B2E] mb-1">
                    Send To
                  </label>
                  <select
                    id="user"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-[#6D9773]/30 shadow-sm focus:border-[#6D9773] focus:ring-[#6D9773] text-[#0C3B2E] p-3 border transition duration-200 bg-white"
                  >
                    <option value="all">All Users</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>{user.name || user.walletAddress}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={sendNotificationMutation.isLoading}
                  className="inline-flex justify-center items-center rounded-xl border border-transparent bg-[#0C3B2E] py-3 px-6 text-sm md:text-base font-medium text-white shadow-sm hover:bg-[#6D9773] focus:outline-none focus:ring-2 focus:ring-[#BB8A52] focus:ring-offset-2 disabled:opacity-70 transition duration-200 transform hover:scale-105"
                >
                  {sendNotificationMutation.isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Notification'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Notification Preview */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-[#6D9773]/20">
          <h2 className="text-lg md:text-xl font-medium text-[#0C3B2E] mb-4">Preview</h2>
          <div className={`p-4 md:p-6 rounded-lg transition-all duration-300 ${
            notification.type === 'info' ? 'bg-[#6D9773]/10 border-l-4 border-[#6D9773]' :
            notification.type === 'warning' ? 'bg-[#FFBA00]/10 border-l-4 border-[#FFBA00]' :
            'bg-[#BB8A52]/10 border-l-4 border-[#BB8A52]'
          }`}>
            <h3 className={`text-lg md:text-xl font-semibold ${
              notification.type === 'info' ? 'text-[#0C3B2E]' :
              notification.type === 'warning' ? 'text-[#FFBA00]' :
              'text-[#BB8A52]'
            }`}>
              {notification.title || 'Notification Title'}
            </h3>
            <p className={`mt-3 text-sm md:text-base ${
              notification.type === 'info' ? 'text-[#6D9773]' :
              notification.type === 'warning' ? 'text-[#FFBA00]/90' :
              'text-[#BB8A52]'
            }`}>
              {notification.message || 'Notification message will appear here...'}
            </p>
            <div className="mt-4 text-xs text-gray-500">
              {selectedUser === 'all' ? 'This will be sent to all users' : `This will be sent to 1 selected user`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
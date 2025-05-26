import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../AuthContext';
import { api } from '../../../services/api';
import { toast } from 'react-toastify';

const NotificationSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    receiveEmail: true,
    receivePush: true,
    emailNotifications: {
      messages: true,
      bids: true,
      jobHired: true,
      workSubmitted: true,
      workApproved: true,
    },
    pushNotifications: {
      messages: true,
      bids: true,
      jobHired: true,
      workSubmitted: true,
      workApproved: true,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/users/me');
        if (response.data.notificationSettings) {
          setSettings(response.data.notificationSettings);
        }
      } catch (error) {
        console.error('Error fetching notification settings:', error);
        toast.error('Failed to load notification settings');
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = async (category, type) => {
    try {
      setIsLoading(true);
      const newSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          [type]: !settings[category][type],
        },
      };

      await api.patch('/users/me/notification-settings', {
        notificationSettings: newSettings,
      });

      setSettings(newSettings);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGlobalToggle = async (category) => {
    try {
      setIsLoading(true);
      const newSettings = {
        ...settings,
        [category]: !settings[category],
      };

      await api.patch('/users/me/notification-settings', {
        notificationSettings: newSettings,
      });

      setSettings(newSettings);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Notification Settings</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Email Notifications</h2>
              <p className="mt-1 text-sm text-gray-500">
                Receive notifications via email
              </p>
            </div>
            <button
              onClick={() => handleGlobalToggle('receiveEmail')}
              disabled={isLoading}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                settings.receiveEmail ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.receiveEmail ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {settings.receiveEmail && (
            <div className="mt-6 space-y-4">
              {Object.entries(settings.emailNotifications).map(([type, enabled]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button
                    onClick={() => handleToggle('emailNotifications', type)}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      enabled ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Push Notifications</h2>
              <p className="mt-1 text-sm text-gray-500">
                Receive real-time notifications in the browser
              </p>
            </div>
            <button
              onClick={() => handleGlobalToggle('receivePush')}
              disabled={isLoading}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                settings.receivePush ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.receivePush ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {settings.receivePush && (
            <div className="mt-6 space-y-4">
              {Object.entries(settings.pushNotifications).map(([type, enabled]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button
                    onClick={() => handleToggle('pushNotifications', type)}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      enabled ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings; 
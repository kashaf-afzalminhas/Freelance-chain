import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../AuthContext';
import { api } from '../../../services/api';
import { toast } from 'react-toastify';

const NotificationSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    pushNotifications: {
      enabled: true,
      types: {
        message: true,
        bid: true,
        job_hired: true,
        contract_created: true,
        work_submitted: true,
        work_approved: true,
        info: true,
        warning: true,
        error: true
      }
    },
    emailNotifications: {
      enabled: true,
      types: {
        message: true,
        bid: true,
        job_hired: true,
        contract_created: true,
        work_submitted: true,
        work_approved: true,
        info: true,
        warning: true,
        error: true
      }
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const fetchSettings = useCallback(async () => {
    if (!user?._id) return;
    
    try {
      const response = await api.get('/notifications/settings');
      if (response.data.success && response.data.data) {
        setSettings(response.data.data);
        setRetryCount(0); // Reset retry count on success
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        toast.error(`Failed to load settings. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        // Wait for 2 seconds before retrying
        setTimeout(fetchSettings, 2000);
      } else {
        toast.error('Failed to load notification settings. Please try again later.');
        setRetryCount(0);
      }
    } finally {
      setIsInitialLoad(false);
    }
  }, [user?._id, retryCount]);

  useEffect(() => {
    if (user?._id) {
      fetchSettings();
    }
  }, [fetchSettings, user?._id]);

  const handleToggle = useCallback(async (category, type) => {
    if (!user?._id) return;

    try {
      setIsLoading(true);
      const newSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          types: {
            ...settings[category].types,
            [type]: !settings[category].types[type]
          }
        }
      };

      const response = await api.patch('/notifications/settings', newSettings);
      
      if (response.data.success) {
        setSettings(newSettings);
        toast.success('Settings updated successfully');
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
      // Revert the change in case of error
      fetchSettings();
    } finally {
      setIsLoading(false);
    }
  }, [settings, user?._id, fetchSettings]);

  const handleGlobalToggle = useCallback(async (category) => {
    if (!user?._id) return;

    try {
      setIsLoading(true);
      const newSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          enabled: !settings[category].enabled
        }
      };

      const response = await api.patch('/notifications/settings', newSettings);
      
      if (response.data.success) {
        setSettings(newSettings);
        toast.success('Settings updated successfully');
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
      // Revert the change in case of error
      fetchSettings();
    } finally {
      setIsLoading(false);
    }
  }, [settings, user?._id, fetchSettings]);

  const renderNotificationType = useCallback((category, type) => {
    const label = type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return (
      <div key={type} className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {label}
        </span>
        <button
          onClick={() => handleToggle(category, type)}
          disabled={isLoading || !settings[category].enabled}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            settings[category].types[type] ? 'bg-primary' : 'bg-gray-200'
          } ${!settings[category].enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              settings[category].types[type] ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    );
  }, [settings, isLoading, handleToggle]);

  if (isInitialLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Notification Settings</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Push Notifications</h2>
              <p className="mt-1 text-sm text-gray-500">
                Receive real-time notifications in the browser
              </p>
            </div>
            <button
              onClick={() => handleGlobalToggle('pushNotifications')}
              disabled={isLoading}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                settings.pushNotifications.enabled ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.pushNotifications.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {settings.pushNotifications.enabled && (
            <div className="mt-6 space-y-4">
              {Object.keys(settings.pushNotifications.types).map(type =>
                renderNotificationType('pushNotifications', type)
              )}
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Email Notifications</h2>
              <p className="mt-1 text-sm text-gray-500">
                Receive notifications via email
              </p>
            </div>
            <button
              onClick={() => handleGlobalToggle('emailNotifications')}
              disabled={isLoading}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                settings.emailNotifications.enabled ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.emailNotifications.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {settings.emailNotifications.enabled && (
            <div className="mt-6 space-y-4">
              {Object.keys(settings.emailNotifications.types).map(type =>
                renderNotificationType('emailNotifications', type)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings; 
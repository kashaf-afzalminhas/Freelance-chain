import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';
import { 
  HomeIcon, 
  UsersIcon, 
  BriefcaseIcon, 
  DocumentTextIcon,
  CurrencyDollarIcon,
  StarIcon,
  FlagIcon,
  ChatBubbleLeftIcon,
  BellIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const { account, disconnectWallet } = useWeb3();
  const location = useLocation();

  useEffect(() => {
    const fetchAdminInfo = async () => {
      if (account) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/verify?walletAddress=${account}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              'x-admin-wallet': account
            }
          });
          const data = await response.json();
          if (data.success && data.user) {
            setAdminName(data.user.name || 'Admin');
          }
        } catch (error) {
          console.error('Error fetching admin info:', error);
        }
      }
    };

    fetchAdminInfo();
  }, [account]);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Jobs', href: '/admin/jobs', icon: BriefcaseIcon },
    { name: 'Contracts', href: '/admin/contracts', icon: DocumentTextIcon },
    { name: 'Disputes', href: '/admin/disputes', icon: FlagIcon },
    { name: 'Notifications', href: '/admin/notifications', icon: BellIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-green-600">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive(item.href)
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Wallet Info */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="w-8 h-8 text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {adminName || (account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not Connected')}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : ''}
                </p>
                <button
                  onClick={disconnectWallet}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navbar */}
        <div className="sticky top-0 z-40 flex items-center h-16 px-4 bg-white shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-500 rounded-md lg:hidden hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 px-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {navigation.find(item => isActive(item.href))?.name || 'Admin Panel'}
            </h2>
          </div>
          {adminName && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Welcome,</span>
              <span className="text-sm font-medium text-gray-900">{adminName}</span>
            </div>
          )}
        </div>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 
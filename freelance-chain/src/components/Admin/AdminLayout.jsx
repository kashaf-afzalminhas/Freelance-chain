// import React, { useState, useEffect } from 'react';
// import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
// import { useWeb3 } from '../../context/Web3Context';
// import { 
//   HomeIcon, 
//   UsersIcon, 
//   BriefcaseIcon, 
//   DocumentTextIcon,
//   FlagIcon,
//   BellIcon,
//   UserCircleIcon
// } from '@heroicons/react/24/outline';

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [adminName, setAdminName] = useState('');
//   const [profileOpen, setProfileOpen] = useState(false);
//   const { account, disconnectWallet } = useWeb3();
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchAdminInfo = async () => {
//       if (account) {
//         try {
//           const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/verify?walletAddress=${account}`, {
//             headers: {
//               'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
//               'x-admin-wallet': account
//             }
//           });
//           const data = await response.json();
//           if (data.success && data.user) {
//             setAdminName(data.user.name || 'Admin');
//           }
//         } catch (error) {
//           console.error('Error fetching admin info:', error);
//         }
//       }
//     };

//     fetchAdminInfo();
//   }, [account]);

//   const handleSignOut = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     localStorage.removeItem('userId');
//     localStorage.removeItem('isAdmin');
//     localStorage.removeItem('adminUser');
//     localStorage.removeItem('authToken');
//     navigate('/signin');
//     window.location.reload();
//   };

//   const navigation = [
//     { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
//     { name: 'Users', href: '/admin/users', icon: UsersIcon },
//     { name: 'Jobs', href: '/admin/jobs', icon: BriefcaseIcon },
//     { name: 'Contracts', href: '/admin/contracts', icon: DocumentTextIcon },
//     { name: 'Disputes', href: '/admin/disputes', icon: FlagIcon },
//     { name: 'Notifications', href: '/admin/notifications', icon: BellIcon },
//   ];

//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Top Navbar */}
//       <div className="sticky top-0 z-50 bg-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex items-center">
//               <Link to="/admin/dashboard" className="text-2xl font-bold text-[#0C3B2E]">
//                 Admin<span className="text-[#BB8A52]">Panel</span>
//               </Link>
//             </div>

//             {/* Auth Section */}
//             <div className="flex items-center">
//               <div className="relative">
//                 <button 
//                   onClick={() => setProfileOpen(!profileOpen)}
//                   className="flex items-center text-sm text-green-900 hover:text-green-800"
//                 >
//                   <span>Hello, {adminName}</span>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className={`h-5 w-5 ml-2 transition-transform ${profileOpen ? "rotate-180" : ""}`}
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </button>

//                 {profileOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
//                     <button
//                       onClick={handleSignOut}
//                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       Sign Out
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex">
//         {/* Sidebar */}
//         <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col mt-16`}>
//           <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
//                   isActive(item.href)
//                     ? 'bg-green-100 text-green-700'
//                     : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 <item.icon className="w-5 h-5 mr-3" />
//                 {item.name}
//               </Link>
//             ))}
//           </nav>
//         </div>

//         {/* Main Content */}
//         <div className="lg:pl-64 flex-1">
//           <div className="py-6">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//               <Outlet />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;

import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';
import { 
  HomeIcon, 
  UsersIcon, 
  BriefcaseIcon, 
  DocumentTextIcon,
  FlagIcon,
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const { account, disconnectWallet } = useWeb3();
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('verifiedAdmin');
    localStorage.removeItem('verifiedWallet');
    disconnectWallet();
    navigate('/signin');
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="flex justify-between items-center h-16 px-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-[#0C3B2E]"
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
          <Link to="/admin/dashboard" className="text-xl font-bold text-[#0C3B2E]">
            Admin<span className="text-[#BB8A52]">Panel</span>
          </Link>
          <div className="w-6"></div> {/* Spacer for balance */}
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0C3B2E] text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col`}>
        <div className="flex items-center justify-center h-16 px-4 border-b border-[#6D9773]">
          <Link to="/admin/dashboard" className="text-xl font-bold text-white">
            Admin<span className="text-[#BB8A52]">Panel</span>
          </Link>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive(item.href)
                  ? 'bg-[#6D9773] text-white'
                  : 'text-gray-200 hover:bg-[#6D9773] hover:bg-opacity-50'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex-1">
        {/* Top Navbar */}
        <div className="sticky top-0 z-40 bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end h-16">
              <div className="flex items-center">
                <div className="relative">
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center text-sm text-[#0C3B2E] hover:text-[#BB8A52] transition-colors"
                  >
                    <span className="hidden sm:inline">Hello, {adminName || 'Admin'}</span>
                    <UserCircleIcon className="h-6 w-6 ml-2 text-[#0C3B2E]" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
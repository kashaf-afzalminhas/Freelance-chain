// import React from 'react';
// import { useAdminApi } from '../../hooks/useAdminApi';
// import { useWeb3 } from '../../context/Web3Context';
// import { 
//   UsersIcon, 
//   BriefcaseIcon, 
//   ExclamationTriangleIcon, 
//   FlagIcon 
// } from '@heroicons/react/24/outline';

// const StatCard = ({ title, value, icon: Icon, color }) => (
//   <div className="bg-white rounded-lg shadow p-6">
//     <div className="flex items-center">
//       <div className={`p-3 rounded-full ${color}`}>
//         <Icon className="w-6 h-6 text-white" />
//       </div>
//       <div className="ml-4">
//         <p className="text-sm font-medium text-gray-500">{title}</p>
//         <p className="text-2xl font-semibold text-gray-900">{value}</p>
//       </div>
//     </div>
//   </div>
// );

// const Dashboard = () => {
//   const { useDashboardStats } = useAdminApi();
//   const { isConnected, account } = useWeb3();
//   const { data: stats, isLoading, error } = useDashboardStats();

//   // If wallet is not connected, show message
//   if (!isConnected || !account) {
//     return (
//       <div className="flex items-center justify-center bg-gray-100">
//         <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Not Connected</h2>
//           <p className="text-gray-600 mb-6">Please connect your wallet to view the dashboard.</p>
//         </div>
//       </div>
//     );
//   }

//   // If loading, show loading state
//   if (isLoading) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {[...Array(4)].map((_, i) => (
//           <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
//             <div className="flex items-center">
//               <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
//               <div className="ml-4">
//                 <div className="h-4 bg-gray-200 rounded w-24"></div>
//                 <div className="h-8 bg-gray-200 rounded w-16 mt-2"></div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   // If error, show error state
//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//         <p className="text-red-600">Error loading dashboard statistics: {error.message}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="Total Users"
//           value={stats?.totalUsers || 0}
//           icon={UsersIcon}
//           color="bg-blue-500"
//         />
//         <StatCard
//           title="Total Jobs"
//           value={stats?.totalJobs || 0}
//           icon={BriefcaseIcon}
//           color="bg-green-500"
//         />
//         <StatCard
//           title="Active Jobs"
//           value={stats?.activeJobs || 0}
//           icon={ExclamationTriangleIcon}
//           color="bg-yellow-500"
//         />
//         <StatCard
//           title="Completed Contracts"
//           value={stats?.completedContracts || 0}
//           icon={FlagIcon}
//           color="bg-purple-500"
//         />
//       </div>

//       {/* Recent Activity Section */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
//         <div className="bg-white rounded-lg shadow">
//           <div className="p-6">
//             <p className="text-gray-500 text-center">Recent activity will be displayed here</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard; 

import React from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';
import { useWeb3 } from '../../context/Web3Context';
import { 
  UsersIcon, 
  BriefcaseIcon, 
  ExclamationTriangleIcon, 
  FlagIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, color }) => {
  const bgColorMap = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    purple: 'bg-purple-100'
  };

  const textColorMap = {
    blue: 'text-blue-800',
    green: 'text-green-800',
    yellow: 'text-yellow-800',
    purple: 'text-purple-800'
  };

  const iconColorMap = {
    blue: 'text-blue-500',
    green: 'text-[#6D9773]',
    yellow: 'text-[#FFBA00]',
    purple: 'text-[#BB8A52]'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${bgColorMap[color]} ${iconColorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-[#0C3B2E]">{value}</p>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { useDashboardStats } = useAdminApi();
  const { isConnected, account } = useWeb3();
  const { data: stats, isLoading, error } = useDashboardStats();

  if (!isConnected || !account) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-[#0C3B2E] mb-4">Wallet Not Connected</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to view the dashboard.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="ml-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mt-2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading dashboard statistics: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0C3B2E]">Dashboard Overview</h1>
        <div className="flex items-center text-sm text-[#6D9773]">
          <ArrowTrendingUpIcon className="w-5 h-5 mr-1" />
          <span>Last 30 days</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={UsersIcon}
          color="green"
        />
        <StatCard
          title="Total Jobs"
          value={stats?.totalJobs || 0}
          icon={BriefcaseIcon}
          color="yellow"
        />
        <StatCard
          title="Active Jobs"
          value={stats?.activeJobs || 0}
          icon={ExclamationTriangleIcon}
          color="blue"
        />
        <StatCard
          title="Completed Contracts"
          value={stats?.completedContracts || 0}
          icon={FlagIcon}
          color="purple"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-[#0C3B2E] mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
              <p className="mt-1 text-sm text-gray-500">Activity will appear here as it happens</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
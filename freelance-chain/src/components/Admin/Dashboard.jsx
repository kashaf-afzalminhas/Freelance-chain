import React from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';
import { 
  UsersIcon, 
  BriefcaseIcon, 
  ExclamationTriangleIcon, 
  FlagIcon 
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { useDashboardStats } = useAdminApi();
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
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
        <p className="text-red-600">Error loading dashboard statistics</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Users"
          value={stats?.activeUsers || 0}
          icon={UsersIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="Open Jobs"
          value={stats?.openJobs || 0}
          icon={BriefcaseIcon}
          color="bg-green-500"
        />
        <StatCard
          title="Active Contracts"
          value={stats?.activeContracts || 0}
          icon={ExclamationTriangleIcon}
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects || 0}
          icon={FlagIcon}
          color="bg-purple-500"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <p className="text-gray-500 text-center">Recent activity will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
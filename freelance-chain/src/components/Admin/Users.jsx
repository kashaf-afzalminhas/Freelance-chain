import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useWeb3 } from '../../context/Web3Context';
import { useAdminApi } from '../../hooks/useAdminApi';

const Users = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const queryClient = useQueryClient();
  const { account } = useWeb3();
  const { useUsers, useUpdateUserStatus } = useAdminApi();

  const { data, isLoading, error } = useUsers(page, {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    role: roleFilter !== 'all' ? roleFilter : undefined
  });

  const updateStatusMutation = useUpdateUserStatus();

  const handleStatusChange = (userId, newStatus) => {
    updateStatusMutation.mutate({ userId, status: newStatus });
  };

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Please connect your wallet</h2>
          <p className="mt-2 text-gray-500">You need to connect your wallet to access the admin panel</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading users: {error.message}</p>
        <p className="text-sm text-red-500 mt-2">
          Please ensure you are logged in and have admin privileges
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <div className="flex space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wallet Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.users?.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        src={user.profileImage || 'https://ui-avatars.com/api/?name=User&background=random'}
                        alt={user.name || 'User'}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.walletAddress || 'No wallet address'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'client' ? 'bg-blue-100 text-blue-800' :
                    user.role === 'freelancer' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' :
                    user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user._id, e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, data?.total || 0)} of {data?.total || 0} results
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page * 10 >= (data?.total || 0)}
            className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
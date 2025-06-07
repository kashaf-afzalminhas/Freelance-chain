import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const DataExport = () => {
  const [exportType, setExportType] = useState('users');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const exportMutation = useMutation({
    mutationFn: async ({ type, startDate, endDate }) => {
      const response = await axios.get(
        `http://localhost:5000/api/admin/export/${type}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
          params: {
            startDate,
            endDate
          },
          data: {
            walletAddress: '0x1a16d8976a56F7EFcF2C8f861C055badA335fBdc'
          },
          responseType: 'blob'
        }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Create a download link for the CSV file
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${variables.type}_export.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${variables.type} data exported successfully`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to export data');
    }
  });

  const handleExport = (e) => {
    e.preventDefault();
    exportMutation.mutate({
      type: exportType,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Export</h1>
        <p className="mt-1 text-sm text-gray-500">
          Export platform data to CSV format
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleExport}>
          <div className="space-y-6">
            <div>
              <label htmlFor="exportType" className="block text-sm font-medium text-gray-700">
                Data Type
              </label>
              <select
                id="exportType"
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="users">Users</option>
                <option value="jobs">Jobs</option>
                <option value="contracts">Contracts</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={exportMutation.isLoading}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                {exportMutation.isLoading ? 'Exporting...' : 'Export Data'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Export Information */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Export Information</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            {exportType === 'users' ? 'Users Export' :
             exportType === 'jobs' ? 'Jobs Export' :
             'Contracts Export'}
          </h3>
          <p className="text-sm text-gray-500">
            {exportType === 'users' ? 'Exports user data including profile information, wallet addresses, and account status.' :
             exportType === 'jobs' ? 'Exports job listings with details about clients, budgets, and job status.' :
             'Exports contract information including client and freelancer details, amounts, and contract status.'}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            The exported CSV file will include all relevant fields and can be opened in any spreadsheet application.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataExport; 
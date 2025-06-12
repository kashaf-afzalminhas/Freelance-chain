import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import Users from './Users';
import Jobs from './Jobs';
import Contracts from './Contracts';
import ContractDetails from './ContractDetails';
import Notifications from './Notifications';
import DataExport from './DataExport';
import Disputes from './Disputes';
import AdminAccessGuard from './AdminAccessGuard';

const AdminRoutes = () => {
  return (
    <AdminAccessGuard>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="contracts/:contractId" element={<ContractDetails />} />
          <Route path="disputes" element={<Disputes />} />
          <Route path="disputes/:contractId" element={<Disputes />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="export" element={<DataExport />} />
        </Route>
      </Routes>
    </AdminAccessGuard>
  );
};

export default AdminRoutes; 
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Welcome, {user?.name}!
      </h1>
      <div className="border-t border-gray-200 pt-4">
        <h2 className="text-lg font-medium text-gray-900">Your Role: {user?.role}</h2>
        <p className="mt-1 text-sm text-gray-500">
          This is your personalized dashboard. More features coming soon!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
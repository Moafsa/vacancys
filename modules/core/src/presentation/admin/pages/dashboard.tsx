import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardMetrics from '../components/metrics/DashboardMetrics';
import RecentActivity from '../components/activity/RecentActivity';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <DashboardMetrics />
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            <div className="mt-4 bg-white shadow rounded-lg p-6">
              <RecentActivity />
            </div>
          </div>

          {/* System Status */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">System Status</h2>
            <div className="mt-4 bg-white shadow rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">API Status</h3>
                  <div className="mt-2 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    </div>
                    <p className="ml-2 text-sm text-gray-900">Operational</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Database Status</h3>
                  <div className="mt-2 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    </div>
                    <p className="ml-2 text-sm text-gray-900">Connected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard; 
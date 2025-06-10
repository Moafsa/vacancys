import React from 'react';
import { useEffect, useState } from 'react';

interface Metrics {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  totalFreelancers: number;
  totalClients: number;
  pendingVerifications: number;
}

const DashboardMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics>({
    totalUsers: 0,
    activeUsers: 0,
    totalProjects: 0,
    totalFreelancers: 0,
    totalClients: 0,
    pendingVerifications: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/admin/metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const stats = [
    { name: 'Total Users', value: metrics.totalUsers },
    { name: 'Active Users', value: metrics.activeUsers },
    { name: 'Total Projects', value: metrics.totalProjects },
    { name: 'Freelancers', value: metrics.totalFreelancers },
    { name: 'Clients', value: metrics.totalClients },
    { name: 'Pending Verifications', value: metrics.pendingVerifications },
  ];

  if (loading) {
    return (
      <div className="animate-pulse">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  return (
    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((item) => (
        <div
          key={item.name}
          className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
        >
          <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
};

export default DashboardMetrics; 
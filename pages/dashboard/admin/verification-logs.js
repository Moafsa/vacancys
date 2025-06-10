import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/dashboard/AdminLayout';

export default function VerificationLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/v1/admin/account-verification-logs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch logs');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        setError('Failed to load logs');
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <AdminLayout currentSection="verification-logs">
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-4">Verification Audit Logs</h1>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : logs.length === 0 ? (
          <div>No logs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Timestamp</th>
                  <th className="px-4 py-2 border">File</th>
                  <th className="px-4 py-2 border">Type</th>
                  <th className="px-4 py-2 border">Result</th>
                  <th className="px-4 py-2 border">Reason</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={idx} className="text-sm">
                    <td className="px-4 py-2 border whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-2 border">{log.file}</td>
                    <td className="px-4 py-2 border">{log.fileType}</td>
                    <td className={`px-4 py-2 border font-bold ${log.result === 'APPROVED' ? 'text-green-600' : 'text-red-600'}`}>{log.result}</td>
                    <td className="px-4 py-2 border">{log.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 
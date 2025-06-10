'use client';

import { useEffect, useState } from 'react';
import Card, { CardContent, CardHeader, CardTitle } from 'pages/dashboard/admin/Card';
import Badge from 'pages/dashboard/admin/Badge';
import Alert, { AlertDescription } from 'pages/dashboard/admin/Alert';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  moduleName: string;
  action: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  details: Record<string, any>;
  timestamp: string;
}

export default function ModuleAuditPage({ params }: { params: { name: string } }) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`/api/modules/${params.name}/audit-logs`);
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [params.name]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Audit Logs - {params.name}</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  by {log.user.name} ({log.user.email})
                </p>
              </div>
              <Badge variant="outline">
                {format(new Date(log.timestamp), 'PPpp')}
              </Badge>
            </CardHeader>
            <CardContent>
              {Object.keys(log.details).length > 0 && (
                <pre className="text-sm bg-muted p-4 rounded-lg">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 
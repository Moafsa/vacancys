'use client';

import { useEffect, useState } from 'react';
import Card, { CardContent, CardHeader, CardTitle } from 'pages/dashboard/admin/Card';
import Badge from 'pages/dashboard/admin/Badge';
import Alert, { AlertDescription } from 'pages/dashboard/admin/Alert';
import Switch from 'pages/dashboard/admin/Switch';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModuleInfo {
  name: string;
  version: string;
  description: string;
  isActive: boolean;
  lastError?: string;
  dependencies: string[];
}

export default function ModulesPage() {
  const [modules, setModules] = useState<ModuleInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/modules');
      if (!response.ok) throw new Error('Failed to fetch modules');
      const data = await response.json();
      setModules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = async (moduleName: string, activate: boolean) => {
    try {
      const response = await fetch(`/api/modules/${moduleName}/${activate ? 'activate' : 'deactivate'}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error(`Failed to ${activate ? 'activate' : 'deactivate'} module`);
      await fetchModules(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update module');
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Module Management</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {modules.map((module) => (
          <Card key={module.name}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">{module.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{module.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={module.isActive ? 'default' : 'secondary'}>
                  {module.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Switch
                  checked={module.isActive}
                  onCheckedChange={(checked) => toggleModule(module.name, checked)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Version:</span> {module.version}
                </p>
                {module.dependencies.length > 0 && (
                  <p className="text-sm">
                    <span className="font-medium">Dependencies:</span>{' '}
                    {module.dependencies.join(', ')}
                  </p>
                )}
                {module.lastError && (
                  <p className="text-sm text-destructive">
                    <span className="font-medium">Last Error:</span> {module.lastError}
                  </p>
                )}
                <Link
                  to={`/dashboard/admin/modules/${module.name}/audit`}
                  className="text-sm text-primary hover:underline"
                >
                  View Audit Logs
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 
import React from 'react';
import Link from 'next/link';
import { Users, Package } from 'lucide-react';

interface SidebarProps {
  isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false }) => (
  <>
    {isAdmin && (
      <div className="space-y-1">
        <h4 className="px-2 text-xs font-semibold text-muted-foreground">Admin</h4>
        <Link
          href="/dashboard/admin/users"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <Users className="h-4 w-4" />
          Users
        </Link>
        <Link
          href="/dashboard/admin/modules"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <Package className="h-4 w-4" />
          Modules
        </Link>
      </div>
    )}
  </>
);

export default Sidebar; 
# Dashboard Implementation Guide

## Overview

This document provides guidelines for implementing and maintaining the dashboard interfaces in the Vacancy.service platform. The dashboards follow a modular structure with reusable components for consistency and maintainability.

## Component Structure

Dashboard components are organized in the following directory:

```
components/dashboard/
├── ActionCard.js     # For quick action buttons
├── DataTable.js      # For displaying tabular data 
├── Header.js         # Top navigation bar
├── index.js          # Exports all components
├── Sidebar.js        # Navigation sidebar
└── StatCard.js       # Metric display cards
```

## Dashboard Types

The platform includes three main dashboard types:

1. **Admin Dashboard** (`pages/dashboard/admin.js`)
   - Platform statistics and monitoring
   - User management
   - Content moderation
   - System settings

2. **Freelancer Dashboard** (`pages/dashboard/freelancer.js`)
   - Job search and application
   - Project management
   - Earnings tracking
   - Profile management
   - Skills and certifications

3. **Client Dashboard** (`pages/dashboard/client.js`)
   - Project posting
   - Freelancer hiring
   - Contract management
   - Payment processing

The main entry point (`pages/dashboard/index.js`) automatically redirects users to the appropriate dashboard based on their role.

## Reusable Components

### Sidebar

```jsx
import { Sidebar } from '../../components/dashboard';

<Sidebar 
  navItems={navItems} 
  activeSection={activeSection} 
  setActiveSection={setActiveSection} 
  bgColor="bg-indigo-700"
  bgColorDarker="bg-indigo-800"
  title="Dashboard Title"
/>
```

### StatCard

```jsx
import { StatCard } from '../../components/dashboard';

<StatCard 
  icon={<UsersIcon className="h-6 w-6" />}
  title="Total Users"
  value={1234}
  subtitle="Active this month"
  iconColor="text-blue-500"
  valueColor="text-blue-600"
/>
```

### ActionCard

```jsx
import { ActionCard } from '../../components/dashboard';

<ActionCard 
  icon={<PlusIcon className="h-6 w-6" />}
  title="Create Project"
  description="Post a new project and find talent"
  action={() => router.push('/projects/new')}
  iconColor="text-green-500"
/>
```

### Header

```jsx
import { Header } from '../../components/dashboard';

<Header 
  searchPlaceholder="Search for talent"
  onSearch={handleSearch}
  onMobileMenuToggle={toggleMobileMenu}
  notificationCount={5}
  messageCount={2}
/>
```

### DataTable

```jsx
import { DataTable } from '../../components/dashboard';

const columns = [
  { key: 'name', label: 'Name', render: (item) => <div>{item.name}</div> },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' }
];

<DataTable 
  title="Users"
  columns={columns}
  data={users}
  viewAllLink="/dashboard/admin/users"
  onRowClick={handleRowClick}
  rowActions={[
    { label: 'Edit', handler: handleEdit },
    { label: 'Delete', handler: handleDelete }
  ]}
/>
```

## Dashboard Sections

Each dashboard follows a similar structure with specific sections:

1. **Overview/Stats Section** - Key metrics displayed in StatCard components
2. **Action Section** - Quick actions specific to the user role
3. **Content Sections** - Tables, lists or cards showing relevant data
4. **Additional Tools** - Role-specific tools and features

## Adding New Dashboard Sections

To add a new section to a dashboard:

1. Add a new entry to the `navItems` array
2. Create a corresponding section in the UI with a conditional based on `activeSection`
3. Implement the section content using the reusable components

## Style Guidelines

- Use indigo color scheme for Freelancer dashboard
- Use green color scheme for Client dashboard
- Use blue/gray color scheme for Admin dashboard
- Maintain consistent spacing and typography
- Follow Upwork-like UI patterns for familiarity

## Integration with Modules

Dashboards should fetch data from appropriate modules using the pluggable architecture. Each dashboard component should:

1. Import the necessary services from modules
2. Use the module's actions/filters system to interact with data
3. Follow the event-driven architecture for real-time updates

Example:

```jsx
import { ProjectService } from '../../modules/projects';
import { UserService } from '../../modules/core';

// In component:
useEffect(() => {
  const loadProjects = async () => {
    const projects = await ProjectService.getUserProjects(userId);
    setProjects(projects);
  };
  loadProjects();
}, [userId]);
```

## Future Enhancements

- Implement responsive design for mobile views
- Add dark mode support
- Create module-specific dashboard sections
- Implement real-time notifications using WebSockets
- Add customizable dashboard layouts for users 
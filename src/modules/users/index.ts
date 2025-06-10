import { ModuleDefinition } from '../../core/ModuleRegistry';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

// Simulating a local database like WordPress does
const userPreferences: Record<string, User['preferences']> = {};

const usersModule: any = {
  name: 'users',
  version: '1.0.0',
  description: 'Users management module',
  baseUrl: '',
  endpoints: {},
  events: { subscribes: [], publishes: [] },
  actions: [
    {
      name: 'users.savePreferences',
      handler: async ({ userId, preferences }: { userId: string; preferences: Partial<User['preferences']> }) => {
        const currentPrefs = userPreferences[userId] || { theme: 'light', notifications: true };
        userPreferences[userId] = {
          ...currentPrefs,
          ...preferences
        };
        return { success: true };
      }
    }
  ],
  filters: [
    {
      name: 'users.getUserPreferences',
      handler: (userId: string) => {
        return userPreferences[userId] || { theme: 'light', notifications: true };
      }
    }
  ]
};

// Fake ModuleRegistry para o browser
class ModuleRegistry {
  registerModule(_module: any) {}
  registerAction(_name: string, _handler: any) {}
  async doAction(_name: string, _payload: any) {}
  registerFilter(_name: string, _handler: any) {}
  async applyFilter(_name: string, _arg: any) { return _arg; }
}
const moduleRegistry = new ModuleRegistry();

// Register the module
moduleRegistry.registerModule(usersModule);

// Integrate with auth module
moduleRegistry.registerAction('auth.afterLogin', async ({ session }) => {
  // Initialize user preferences if they don't exist
  if (!userPreferences[session.user.id]) {
    await moduleRegistry.doAction('users.savePreferences', {
      userId: session.user.id,
      preferences: { theme: 'light', notifications: true }
    });
  }
});

moduleRegistry.registerAction('auth.beforeLogout', async ({ session }) => {
  // Save current preferences before logout
  const prefs = moduleRegistry.applyFilter('users.getUserPreferences', session.user.id);
  console.log(`Saving preferences for user ${session.user.id}:`, prefs);
});

export default usersModule; 
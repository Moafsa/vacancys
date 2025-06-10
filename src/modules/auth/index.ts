import { ModuleDefinition } from '../../core/ModuleRegistry';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { createHash } from 'crypto';

interface LoginCredentials {
  email: string;
  password: string;
}

interface Session {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// Fake ModuleRegistry para o browser
class ModuleRegistry {
  registerModule(module: any) {}
  registerAction(name: string, handler: Function) {}
  async doAction(name: string, ...args: any[]) {}
  registerFilter(name: string, handler: Function) {}
  async applyFilter<T>(name: string, ...args: any[]): Promise<T> {
    return args[0] as T;
  }
}

const moduleRegistry = new ModuleRegistry();

const authModule: any = {
  name: 'auth',
  version: '1.0.0',
  description: 'Authentication module',
  baseUrl: '',
  endpoints: {},
  events: { subscribes: [], publishes: [] },
  actions: [
    {
      name: 'auth.login',
      handler: async (credentials: LoginCredentials) => {
        try {
          // Apply filters for credentials validation
          const validatedCredentials = await moduleRegistry.applyFilter<LoginCredentials>('auth.validateCredentials', credentials);
          
          // Find user
          const user = await prisma.user.findUnique({
            where: { email: validatedCredentials.email }
          });

          if (!user) {
            throw new Error('Invalid credentials');
          }

          // Compare password with bcrypt
          const isValidPassword = await bcrypt.compare(validatedCredentials.password, user.password);
          if (!isValidPassword) {
            throw new Error('Invalid credentials');
          }

          // Generate session token (in a real app, use a proper JWT library)
          const token = createHash('sha256')
            .update(user.id + Date.now().toString())
            .digest('hex');

          // Allow other modules to hook into the login process
          await moduleRegistry.doAction('auth.beforeLogin', { user });

          // Store session
          const session: Session = {
            token,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role
            }
          };

          // Store in "database"
          if (typeof window !== 'undefined') {
            localStorage.setItem('session', JSON.stringify(session));
          }

          // Allow other modules to hook into after login
          await moduleRegistry.doAction('auth.afterLogin', { session });

          return {
            success: true,
            ...session
          };
        } catch (error: any) {
          // Allow error handling by other modules
          await moduleRegistry.doAction('auth.loginError', { error });
          throw error;
        }
      }
    },
    {
      name: 'auth.logout',
      handler: async () => {
        const session = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('session') || '{}') : {};
        
        // Allow modules to clean up before logout
        await moduleRegistry.doAction('auth.beforeLogout', { session });
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('session');
        }
        
        // Notify modules after logout
        await moduleRegistry.doAction('auth.afterLogout', {});
        
        return { success: true };
      }
    }
  ],
  filters: [
    {
      name: 'auth.validateCredentials',
      handler: (credentials: LoginCredentials) => {
        if (!credentials.email || !credentials.password) {
          throw new Error('Email and password are required');
        }
        return credentials;
      }
    },
    {
      name: 'auth.isAuthenticated',
      handler: () => {
        const session = typeof window !== 'undefined' ? localStorage.getItem('session') : null;
        return !!session;
      }
    },
    {
      name: 'auth.getCurrentUser',
      handler: () => {
        const session = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('session') || '{}') : {};
        return session.user || null;
      }
    }
  ]
};

// Register the module
moduleRegistry.registerModule(authModule);

// Example of how other modules can extend auth functionality
moduleRegistry.registerAction('auth.afterLogin', async ({ session }: { session: Session }) => {
  console.log('User logged in:', session.user.email);
});

moduleRegistry.registerFilter('auth.validateCredentials', (credentials: LoginCredentials) => {
  // Example: Add additional validation
  if (!credentials.email.includes('@')) {
    throw new Error('Invalid email format');
  }
  return credentials;
});

export default authModule; 
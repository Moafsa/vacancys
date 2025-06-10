import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { logger } from './logger';

interface ModuleInfo {
  name: string;
  path: string;
  dependencies: string[];
  hasTests: boolean;
}

export const moduleUtils = {
  getModules(): ModuleInfo[] {
    const modulesPath = path.join(process.cwd(), 'modules');
    const modules = fs.readdirSync(modulesPath)
      .filter(file => fs.statSync(path.join(modulesPath, file)).isDirectory())
      .map(moduleName => {
        const modulePath = path.join(modulesPath, moduleName);
        const packageJsonPath = path.join(modulePath, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        return {
          name: moduleName,
          path: modulePath,
          dependencies: Object.keys(packageJson.dependencies || {}),
          hasTests: fs.existsSync(path.join(modulePath, 'src', '__tests__'))
        };
      });

    // Ensure core is first
    return modules.sort((a, b) => a.name === 'core' ? -1 : b.name === 'core' ? 1 : 0);
  },

  async setupModule(moduleInfo: ModuleInfo) {
    logger.module(moduleInfo.name, 'Setting up module...');

    // Install dependencies
    logger.info(`Installing dependencies for ${moduleInfo.name}...`);
    execSync('npm install', { cwd: moduleInfo.path, stdio: 'inherit' });

    // Setup environment
    const envExample = path.join(moduleInfo.path, '.env.example');
    const envFile = path.join(moduleInfo.path, '.env');
    
    if (fs.existsSync(envExample) && !fs.existsSync(envFile)) {
      fs.copyFileSync(envExample, envFile);
      logger.success(`Created .env file for ${moduleInfo.name}`);
    }

    // Run module-specific setup if it exists
    const setupScript = path.join(moduleInfo.path, 'scripts', 'setup.ts');
    if (fs.existsSync(setupScript)) {
      logger.info(`Running setup script for ${moduleInfo.name}...`);
      execSync(`npx ts-node ${setupScript}`, { cwd: moduleInfo.path, stdio: 'inherit' });
    }
  },

  async runTests(moduleInfo: ModuleInfo) {
    if (!moduleInfo.hasTests) {
      logger.warning(`No tests found for ${moduleInfo.name}`);
      return;
    }

    logger.module(moduleInfo.name, 'Running tests...');
    try {
      execSync('npm test', { cwd: moduleInfo.path, stdio: 'inherit' });
      logger.success(`Tests passed for ${moduleInfo.name}`);
    } catch (error) {
      logger.error(`Tests failed for ${moduleInfo.name}`, error);
      throw error;
    }
  },

  async startModule(moduleInfo: ModuleInfo) {
    logger.module(moduleInfo.name, 'Starting module...');
    try {
      execSync('npm run dev', { cwd: moduleInfo.path, stdio: 'inherit' });
    } catch (error) {
      logger.error(`Failed to start ${moduleInfo.name}`, error);
      throw error;
    }
  },

  async buildModule(moduleInfo: ModuleInfo) {
    logger.module(moduleInfo.name, 'Building module...');
    try {
      execSync('npm run build', { cwd: moduleInfo.path, stdio: 'inherit' });
      logger.success(`Built ${moduleInfo.name}`);
    } catch (error) {
      logger.error(`Failed to build ${moduleInfo.name}`, error);
      throw error;
    }
  }
}; 
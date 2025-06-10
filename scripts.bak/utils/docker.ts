import { execSync } from 'child_process';
import { logger } from './logger';

export const dockerUtils = {
  startServices: () => {
    try {
      logger.info('Starting Docker services...');
      execSync('docker-compose up -d', { stdio: 'inherit' });
    } catch (error) {
      logger.error('Failed to start Docker services', error);
      throw error;
    }
  },

  stopServices: () => {
    try {
      logger.info('Stopping Docker services...');
      execSync('docker-compose down', { stdio: 'inherit' });
    } catch (error) {
      logger.error('Failed to stop Docker services', error);
      throw error;
    }
  },

  ensureNetworks: () => {
    try {
      logger.info('Ensuring Docker networks exist...');
      execSync('docker network create vacancy-network || true', { stdio: 'inherit' });
    } catch (error) {
      logger.error('Failed to create Docker networks', error);
      throw error;
    }
  },

  checkServices: () => {
    try {
      const output = execSync('docker-compose ps', { encoding: 'utf8' });
      return output.includes('Up');
    } catch (error) {
      logger.error('Failed to check Docker services', error);
      return false;
    }
  }
}; 
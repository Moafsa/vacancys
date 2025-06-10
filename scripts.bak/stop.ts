import { moduleUtils } from './utils/modules';
import { dockerUtils } from './utils/docker';
import { logger } from './utils/logger';

async function stop() {
  try {
    // Get all modules
    const modules = moduleUtils.getModules();
    logger.info(`Found ${modules.length} modules to stop`);

    // Stop Docker services
    await dockerUtils.stopServices();

    // Check if services are stopped
    const servicesRunning = await dockerUtils.checkServices();
    if (servicesRunning) {
      throw new Error('Failed to stop services');
    }

    logger.success('All modules stopped successfully!');
  } catch (error) {
    logger.error('Failed to stop modules', error);
    process.exit(1);
  }
}

stop(); 
import { moduleUtils } from './utils/modules';
import { dockerUtils } from './utils/docker';
import { logger } from './utils/logger';

async function restart() {
  try {
    // Stop all modules and services
    const modules = moduleUtils.getModules();
    logger.info(`Found ${modules.length} modules to restart`);

    // Stop Docker services
    await dockerUtils.stopServices();

    // Check if services are stopped
    const servicesRunning = await dockerUtils.checkServices();
    if (servicesRunning) {
      throw new Error('Failed to stop services');
    }

    logger.success('All modules stopped successfully!');

    // Ensure Docker networks exist
    await dockerUtils.ensureNetworks();

    // Start each module sequentially
    for (const moduleInfo of modules) {
      await moduleUtils.startModule(moduleInfo);
    }

    // Start Docker services
    await dockerUtils.startServices();

    // Check if services are running
    const servicesStarted = await dockerUtils.checkServices();
    if (!servicesStarted) {
      throw new Error('Failed to start services');
    }

    logger.success('All modules restarted successfully!');
  } catch (error) {
    logger.error('Failed to restart modules', error);
    process.exit(1);
  }
}

restart(); 